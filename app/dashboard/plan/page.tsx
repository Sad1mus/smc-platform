import type { Metadata } from "next"
import { CheckCircle2, XCircle } from "lucide-react"

import { isStripeConfigured } from "@/lib/stripe/client"
import { getActiveSubscription } from "@/lib/subscription/queries"
import { createClient } from "@/lib/supabase/server"
import type { Plan } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ManageSubscriptionButton,
  PlanCheckoutButton,
} from "@/components/dashboard/plan-checkout-button"

export const metadata: Metadata = {
  title: "Mi plan",
  description: "Gestiona tu plan de acceso a la plataforma.",
}

function formatPrice(plan: Plan): string {
  if (plan.is_custom || plan.price_usd === null) return "Personalizado"
  return `$${Number(plan.price_usd).toLocaleString("en-US")} USD`
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams
  const [subscription, supabase] = await Promise.all([
    getActiveSubscription(),
    createClient(),
  ])

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("sort_order")

  const stripeReady = isStripeConfigured()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Mi plan</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tu suscripción y método de pago, gestionados de forma segura por
          Stripe.
        </p>
      </header>

      {/* Resultado del checkout */}
      {estado === "exitoso" ? (
        <div
          role="status"
          className="border-market-up/40 bg-market-up/10 text-foreground flex items-center gap-3 rounded-lg border p-4 text-sm"
        >
          <CheckCircle2 className="text-market-up size-5 shrink-0" />
          Pago confirmado. Tu acceso se activará en unos segundos (cuando Stripe
          confirme el evento).
        </div>
      ) : null}
      {estado === "cancelado" ? (
        <div
          role="status"
          className="border-border bg-secondary/40 text-muted-foreground flex items-center gap-3 rounded-lg border p-4 text-sm"
        >
          <XCircle className="size-5 shrink-0" />
          Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
        </div>
      ) : null}

      {/* Suscripción actual */}
      {subscription ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Plan {subscription.plan?.name ?? subscription.plan_id}
                  <Badge className="bg-market-up/15 text-market-up border-market-up/30">
                    {subscription.status === "trialing"
                      ? "En prueba"
                      : "Activo"}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  {subscription.current_period_end
                    ? `Acceso vigente hasta ${new Date(
                        subscription.current_period_end
                      ).toLocaleDateString("es", { dateStyle: "long" })}`
                    : "Acceso vigente"}
                </CardDescription>
              </div>
              <ManageSubscriptionButton />
            </div>
          </CardHeader>
        </Card>
      ) : (
        <>
          {!stripeReady ? (
            <Card>
              <CardHeader>
                <CardTitle>Pagos en preparación</CardTitle>
                <CardDescription>
                  El procesamiento de pagos estará habilitado muy pronto.
                  Mientras tanto puedes explorar los planes disponibles.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {/* Selección de plan */}
          <div className="grid gap-4 md:grid-cols-3">
            {(plans ?? [])
              .filter((plan) => !plan.is_custom)
              .map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <p className="font-mono text-2xl font-bold tracking-tight">
                      {formatPrice(plan)}
                    </p>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <PlanCheckoutButton
                      planId={plan.id}
                      planName={plan.name}
                      variant={plan.id === "plata" ? "default" : "outline"}
                    />
                  </CardContent>
                </Card>
              ))}
          </div>

          <p className="text-muted-foreground/80 text-xs leading-relaxed">
            ¿Necesitas el plan VIP personalizado? Escríbenos y lo configuramos a
            tu medida. Pagos procesados por Stripe (PCI-DSS SAQ-A): ningún dato
            de tarjeta toca los servidores de SMC.
          </p>
        </>
      )}
    </div>
  )
}
