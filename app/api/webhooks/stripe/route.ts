import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { sendPaymentConfirmationEmail } from "@/lib/email/send"
import { getStripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import { captureError, log } from "@/lib/observability/logger"

/**
 * Webhook de Stripe — firmado e idempotente.
 *
 * Eventos manejados:
 *  - checkout.session.completed  → alta/actualización de suscripción o pago único
 *  - invoice.paid                → renovación confirmada
 *  - customer.subscription.updated / .deleted → cambios de estado
 *
 * Idempotencia: cada evento se registra en payment_events por su
 * stripe_event_id (unique). Si ya existe, se responde 200 sin reprocesar.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook no configurado" },
      { status: 503 }
    )
  }

  const body = await request.text()
  const signature = (await headers()).get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    )
  } catch {
    // Firma inválida: rechazar SIEMPRE.
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 })
  }

  const supabase = createAdminClient()

  log.info("stripe_webhook_received", {
    eventId: event.id,
    eventType: event.type,
  })

  // ── Idempotencia ───────────────────────────────────────────
  // Solo se guarda una referencia mínima del evento (no el payload
  // completo) para evitar retener PII innecesaria del cliente.
  const eventObject = event.data.object as { id?: string; customer?: unknown }
  const { error: insertError } = await supabase.from("payment_events").insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: {
      object_id: eventObject.id ?? null,
      customer:
        typeof eventObject.customer === "string" ? eventObject.customer : null,
      created: event.created,
      livemode: event.livemode,
    },
  })

  if (insertError) {
    if (insertError.code === "23505") {
      // Evento ya procesado: responder OK sin repetir efectos.
      return NextResponse.json({ received: true, duplicated: true })
    }
    return NextResponse.json(
      { error: "No se pudo registrar el evento" },
      { status: 500 }
    )
  }

  // ── Procesamiento por tipo ─────────────────────────────────
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(supabase, session)
        break
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(supabase, invoice)
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await syncSubscription(supabase, subscription)
        break
      }
      default:
        // Evento no manejado: registrado en payment_events, sin efectos.
        break
    }
  } catch (error) {
    await captureError("stripe_webhook_processing_error", error, {
      eventId: event.id,
      eventType: event.type,
    })
    return NextResponse.json(
      { error: "Error procesando el evento" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}

type AdminClient = ReturnType<typeof createAdminClient>

/** Alta de suscripción o registro de pago único al completar el checkout. */
async function handleCheckoutCompleted(
  supabase: AdminClient,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.supabase_user_id
  const planId = session.metadata?.plan_id
  if (!userId || !planId) return

  // Guardar el stripe_customer_id en el perfil (primera compra).
  if (typeof session.customer === "string") {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: session.customer })
      .eq("id", userId)
  }

  // Email de confirmación de pago (stub si Resend no está configurado).
  const [{ data: profile }, { data: plan }] = await Promise.all([
    supabase.from("profiles").select("email").eq("id", userId).single(),
    supabase.from("plans").select("name").eq("id", planId).single(),
  ])
  if (profile?.email) {
    await sendPaymentConfirmationEmail(profile.email, plan?.name ?? planId)
  }

  if (session.mode === "subscription" && session.subscription) {
    // La suscripción se sincroniza con su propio evento; aquí se asegura
    // el alta inicial.
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.retrieve(
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id
    )
    await syncSubscription(supabase, subscription)
    return
  }

  if (session.mode === "payment") {
    // Pago único (plan de prueba): acceso registrado como suscripción
    // "active" sin stripe_subscription_id, con vigencia de 30 días.
    const periodEnd = new Date()
    periodEnd.setDate(periodEnd.getDate() + 30)

    await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        plan_id: planId,
        stripe_customer_id:
          typeof session.customer === "string" ? session.customer : null,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
      },
      { onConflict: "stripe_subscription_id", ignoreDuplicates: false }
    )
  }
}

/** Renovación pagada: extiende el período de la suscripción. */
async function handleInvoicePaid(
  supabase: AdminClient,
  invoice: Stripe.Invoice
) {
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : invoice.parent?.subscription_details?.subscription?.id

  if (!subscriptionId) return

  const stripe = getStripe()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  await syncSubscription(supabase, subscription)
}

/** Sincroniza el estado de una suscripción de Stripe en la tabla local. */
async function syncSubscription(
  supabase: AdminClient,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.supabase_user_id
  const planId = subscription.metadata?.plan_id
  if (!userId || !planId) return

  const item = subscription.items.data[0]

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_id: planId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      status: subscription.status,
      current_period_start: item?.current_period_start
        ? new Date(item.current_period_start * 1000).toISOString()
        : null,
      current_period_end: item?.current_period_end
        ? new Date(item.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "stripe_subscription_id" }
  )
}
