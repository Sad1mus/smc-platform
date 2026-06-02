"use server"

import { redirect } from "next/navigation"

import { getProfile } from "@/lib/auth/profile"
import { getStripe, isStripeConfigured } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"

export type CheckoutActionResult = {
  error?: string
}

function appUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return `${base}${path}`
}

/**
 * Crea una Checkout Session de Stripe para el plan elegido y redirige.
 * - Planes recurrentes (bronce, plata): mode subscription.
 * - Plan de prueba (prueba): pago único, mode payment.
 * - VIP: no pasa por checkout (contacto directo).
 */
export async function createCheckoutSession(
  planId: string
): Promise<CheckoutActionResult> {
  if (!isStripeConfigured()) {
    return {
      error:
        "Los pagos aún no están habilitados en este entorno. Intenta más tarde.",
    }
  }

  const profile = await getProfile()
  if (!profile) {
    redirect("/login?next=/dashboard/plan")
  }

  const supabase = await createClient()
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .eq("active", true)
    .single()

  if (!plan || plan.is_custom) {
    return { error: "Plan no disponible para compra directa." }
  }
  if (!plan.stripe_price_id) {
    return {
      error:
        "Este plan aún no tiene precio configurado en Stripe. Contacta a soporte.",
    }
  }

  const stripe = getStripe()

  // Reutilizar el customer de Stripe si ya existe; crearlo si no.
  let customerId = profile.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      name: profile.full_name ?? undefined,
      metadata: { supabase_user_id: profile.id },
    })
    customerId = customer.id

    // Guardar el customer id (vía service no disponible: el perfil propio
    // no permite editar stripe_customer_id con la sesión del usuario, así
    // que se guarda al confirmar el pago en el webhook). Metadata del
    // checkout lleva el user id como fuente de verdad.
  }

  const isOneTime = plan.id === "prueba"

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: isOneTime ? "payment" : "subscription",
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
    success_url: appUrl(
      "/dashboard/plan?estado=exitoso&session_id={CHECKOUT_SESSION_ID}"
    ),
    cancel_url: appUrl("/dashboard/plan?estado=cancelado"),
    metadata: {
      supabase_user_id: profile.id,
      plan_id: plan.id,
    },
    ...(isOneTime
      ? {
          payment_intent_data: {
            metadata: { supabase_user_id: profile.id, plan_id: plan.id },
          },
        }
      : {
          subscription_data: {
            metadata: { supabase_user_id: profile.id, plan_id: plan.id },
          },
        }),
  })

  if (!session.url) {
    return { error: "No se pudo iniciar el pago. Intenta de nuevo." }
  }

  redirect(session.url)
}

/**
 * Abre el Customer Portal de Stripe para gestionar la suscripción
 * (cambiar plan, actualizar tarjeta, cancelar).
 */
export async function createPortalSession(): Promise<CheckoutActionResult> {
  if (!isStripeConfigured()) {
    return {
      error:
        "Los pagos aún no están habilitados en este entorno. Intenta más tarde.",
    }
  }

  const profile = await getProfile()
  if (!profile) {
    redirect("/login?next=/dashboard/plan")
  }

  if (!profile.stripe_customer_id) {
    return { error: "Aún no tienes una suscripción activa." }
  }

  const stripe = getStripe()
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: appUrl("/dashboard/plan"),
  })

  redirect(session.url)
}
