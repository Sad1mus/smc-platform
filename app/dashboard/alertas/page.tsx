import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { shouldEnforcePaywall } from "@/lib/subscription/paywall"
import {
  getActiveSubscription,
  hasActiveAccess,
} from "@/lib/subscription/queries"
import { listAlerts } from "@/lib/alerts/queries"
import { alertLimitForPlan } from "@/lib/alerts/limits"
import { AlertForm } from "@/components/dashboard/alert-form"
import { AlertDeleteButton } from "@/components/dashboard/alert-delete-button"

export const metadata: Metadata = {
  title: "Alertas de precio",
  description:
    "Definí umbrales por símbolo y te avisamos cuando el precio los cruza.",
}

export default async function AlertasPage() {
  if (shouldEnforcePaywall()) {
    const hasAccess = await hasActiveAccess()
    if (!hasAccess) redirect("/dashboard/plan")
  }

  const [alerts, subscription] = await Promise.all([
    listAlerts(),
    getActiveSubscription(),
  ])
  const limit = alertLimitForPlan(subscription?.plan_id ?? null)
  const limitLabel = Number.isFinite(limit) ? String(limit) : "ilimitadas"

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Alertas de precio</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Definí un umbral por símbolo y te avisamos cuando el precio lo cruza.
          Es una herramienta de análisis: no ejecuta ninguna operación.
        </p>
      </header>

      <AlertForm />

      <section className="flex flex-col gap-3">
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            {alerts.length}{" "}
            {alerts.length === 1 ? "alerta activa" : "alertas activas"}
          </span>
          <span className="font-mono text-xs">Tu plan: {limitLabel}</span>
        </div>

        {alerts.length === 0 ? (
          <p className="border-border/60 text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
            Todavía no tenés alertas. Creá la primera arriba.
          </p>
        ) : (
          <ul className="border-border/60 divide-border/60 divide-y divide-dashed overflow-hidden rounded-xl border border-dashed">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="bg-card flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="text-foreground">{alert.symbol}</span>
                  <span className="text-muted-foreground text-xs">
                    {alert.direction === "above" ? "sube de" : "baja de"}
                  </span>
                  <span className="text-gold tabular-nums">
                    {alert.threshold}
                  </span>
                </div>
                <AlertDeleteButton id={alert.id} />
              </li>
            ))}
          </ul>
        )}

        <p className="text-muted-foreground/70 font-mono text-[11px]">
          Nota: la notificación al cruzar el umbral está en preparación; por
          ahora la alerta se guarda en tu cuenta.
        </p>
      </section>
    </div>
  )
}
