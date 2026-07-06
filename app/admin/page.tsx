import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getDictionary } from "@/lib/i18n/server"

export const metadata: Metadata = { title: "Admin — SMC Markets" }

const ACTIVE_STATUSES = ["active", "trialing"]

function fmtDate(v: string | null) {
  if (!v) return "—"
  return new Date(v).toISOString().slice(0, 10)
}

/**
 * Panel de administración (solo lectura) — spec §admin.md. Gated por isAdmin()
 * en el layout. profiles/subscriptions se leen con el server client (RLS admin);
 * payment_events/price_alerts no tienen policy admin, así que se leen con el
 * cliente admin (service_role, server-only), degradando si falta la clave.
 */
export default async function AdminPage() {
  const [supabase, { t }] = await Promise.all([createClient(), getDictionary()])
  const [{ data: profiles }, { data: subscriptions }, { data: plansData }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("subscriptions")
        .select(
          "id, user_id, plan_id, status, current_period_end, cancel_at_period_end"
        )
        .order("created_at", { ascending: false }),
      supabase.from("plans").select("id, name, price_usd, is_custom"),
    ])

  const users = profiles ?? []
  const subs = subscriptions ?? []
  const plans = plansData ?? []

  const priceById = new Map(plans.map((p) => [p.id, p]))
  const activeSubs = subs.filter((s) => ACTIVE_STATUSES.includes(s.status))

  // Distribución por plan (solo suscripciones activas).
  const planDist = new Map<string, number>()
  for (const s of activeSubs) {
    planDist.set(s.plan_id, (planDist.get(s.plan_id) ?? 0) + 1)
  }

  // Proxy de ingresos: suma de precios de planes con suscripción activa.
  const revenueProxy = activeSubs.reduce((acc, s) => {
    const plan = priceById.get(s.plan_id)
    const price = plan && !plan.is_custom ? Number(plan.price_usd ?? 0) : 0
    return acc + price
  }, 0)

  // payment_events + price_alerts vía cliente admin (degrada sin service_role).
  let payments: {
    event_type: string
    stripe_event_id: string
    user_id: string | null
    processed_at: string
  }[] = []
  let alerts = { total: 0, active: 0 }
  let observabilityAvailable = true
  try {
    const admin = createAdminClient()
    const [{ data: pe }, { data: pa }] = await Promise.all([
      admin
        .from("payment_events")
        .select("event_type, stripe_event_id, user_id, processed_at")
        .order("processed_at", { ascending: false })
        .limit(50),
      admin.from("price_alerts").select("id, active"),
    ])
    payments = pe ?? []
    const alertRows = pa ?? []
    alerts = {
      total: alertRows.length,
      active: alertRows.filter((a) => a.active).length,
    }
  } catch {
    observabilityAvailable = false
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {t.admin.title}
        </h1>
        <p className="text-muted-foreground text-sm">{t.admin.subtitle}</p>
      </div>

      {/* Métricas agregadas */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metric label={t.admin.metricUsers} value={String(users.length)} />
        <Metric
          label={t.admin.metricActiveSubs}
          value={String(activeSubs.length)}
        />
        <Metric
          label={t.admin.metricRevenue}
          value={`$${revenueProxy.toLocaleString("en-US")}`}
        />
        <Metric
          label={t.admin.metricAlerts}
          value={observabilityAvailable ? String(alerts.total) : "—"}
        />
      </div>
      <p className="text-muted-foreground/70 -mt-2 font-mono text-[11px]">
        {t.admin.proxyNote}
      </p>

      {/* Distribución por plan */}
      <Card variant="hairline">
        <CardHeader>
          <CardTitle className="text-base">
            {t.admin.planDistribution}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 font-mono text-xs">
          {planDist.size === 0 ? (
            <span className="text-muted-foreground">{t.admin.empty}</span>
          ) : (
            [...planDist.entries()].map(([planId, count]) => (
              <span key={planId} className="flex items-center gap-2">
                <span className="text-foreground">
                  {priceById.get(planId)?.name ?? planId}
                </span>
                <span className="text-gold">{count}</span>
              </span>
            ))
          )}
        </CardContent>
      </Card>

      {/* Usuarios */}
      <Card variant="hairline">
        <CardHeader>
          <CardTitle>{t.admin.usersTitle}</CardTitle>
          <CardDescription>
            {users.length} {t.admin.registered}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.admin.empty}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-border/60 border-b border-dashed text-left font-mono text-xs uppercase">
                <tr>
                  <th className="py-2 pr-4">{t.admin.colEmail}</th>
                  <th className="py-2 pr-4">{t.admin.colName}</th>
                  <th className="py-2 pr-4">{t.admin.colRole}</th>
                  <th className="py-2">{t.admin.colCreated}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-border/40 border-b border-dashed last:border-0"
                  >
                    <td className="py-2 pr-4 font-mono text-xs">{u.email}</td>
                    <td className="py-2 pr-4">{u.full_name ?? "—"}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{u.role}</td>
                    <td className="py-2 font-mono text-xs">
                      {fmtDate(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Suscripciones */}
      <Card variant="hairline">
        <CardHeader>
          <CardTitle>{t.admin.subsTitle}</CardTitle>
          <CardDescription>
            {subs.length} {t.admin.registered}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {subs.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.admin.empty}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-border/60 border-b border-dashed text-left font-mono text-xs uppercase">
                <tr>
                  <th className="py-2 pr-4">{t.admin.colUser}</th>
                  <th className="py-2 pr-4">{t.admin.colPlan}</th>
                  <th className="py-2 pr-4">{t.admin.colStatus}</th>
                  <th className="py-2 pr-4">{t.admin.colEnds}</th>
                  <th className="py-2">{t.admin.colCancels}</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr
                    key={s.id}
                    className="border-border/40 border-b border-dashed last:border-0"
                  >
                    <td className="py-2 pr-4 font-mono text-[11px]">
                      {s.user_id}
                    </td>
                    <td className="py-2 pr-4">{s.plan_id}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{s.status}</td>
                    <td className="py-2 pr-4 font-mono text-xs">
                      {fmtDate(s.current_period_end)}
                    </td>
                    <td className="py-2 font-mono text-xs">
                      {s.cancel_at_period_end ? t.admin.yes : t.admin.no}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Pagos */}
      <Card variant="hairline">
        <CardHeader>
          <CardTitle>{t.admin.paymentsTitle}</CardTitle>
          <CardDescription>
            {observabilityAvailable
              ? `${payments.length} ${t.admin.registered}`
              : t.admin.unavailable}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {!observabilityAvailable ? (
            <p className="text-muted-foreground text-sm">
              {t.admin.unavailable}
            </p>
          ) : payments.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.admin.empty}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-border/60 border-b border-dashed text-left font-mono text-xs uppercase">
                <tr>
                  <th className="py-2 pr-4">{t.admin.colType}</th>
                  <th className="py-2 pr-4">{t.admin.colEvent}</th>
                  <th className="py-2 pr-4">{t.admin.colUser}</th>
                  <th className="py-2">{t.admin.colDate}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.stripe_event_id}
                    className="border-border/40 border-b border-dashed last:border-0"
                  >
                    <td className="py-2 pr-4 font-mono text-xs">
                      {p.event_type}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[11px]">
                      {p.stripe_event_id}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[11px]">
                      {p.user_id ?? "—"}
                    </td>
                    <td className="py-2 font-mono text-xs">
                      {fmtDate(p.processed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Alertas de precio */}
      <Card variant="hairline">
        <CardHeader>
          <CardTitle>{t.admin.alertsTitle}</CardTitle>
          <CardDescription>
            {observabilityAvailable
              ? `${alerts.total} · ${alerts.active} ${t.admin.alertsActive}`
              : t.admin.unavailable}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card variant="hairline">
      <CardContent className="flex flex-col gap-1 p-4">
        <span className="text-gold font-mono text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </span>
        <span className="text-muted-foreground text-xs">{label}</span>
      </CardContent>
    </Card>
  )
}
