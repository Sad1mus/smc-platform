import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getProfile, getUser } from "@/lib/auth/profile"
import { shouldEnforcePaywall } from "@/lib/subscription/paywall"
import { hasActiveAccess } from "@/lib/subscription/queries"
import { createClient } from "@/lib/supabase/server"
import { MarketView } from "@/components/dashboard/market-view"
import { TerminalPanels } from "@/components/dashboard/terminal-panels"
import { TickerTape } from "@/components/dashboard/ticker-tape"

export const metadata: Metadata = {
  title: "Mercados",
  description: "Tu panel de visualización de mercados en tiempo real.",
}

export default async function DashboardPage() {
  // ── Gating por suscripción (muro de pago) ──────────────────
  // Falla CERRADO: en producción los mercados SIEMPRE exigen suscripción
  // activa, aunque falte la clave de Stripe (una mala config no debe regalar
  // el acceso). Solo en dev/test sin Stripe el muro se desactiva, porque ahí
  // comprar un plan es imposible. Ver lib/subscription/paywall.ts.
  if (shouldEnforcePaywall()) {
    const hasAccess = await hasActiveAccess()
    if (!hasAccess) {
      redirect("/dashboard/plan")
    }
  }

  const [user, profile, supabase] = await Promise.all([
    getUser(),
    getProfile(),
    createClient(),
  ])

  const { data: watchlist } = await supabase
    .from("watchlists")
    .select("symbol")
    .eq("user_id", user!.id)
    .order("sort_order")
    .order("created_at")

  const symbols = watchlist?.map((item) => item.symbol) ?? []
  const firstName = profile?.full_name?.split(" ")[0]

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1
          className="text-2xl font-bold tracking-tight"
          data-testid="dashboard-title"
        >
          Mercados
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {firstName ? `Hola, ${firstName}. ` : ""}Datos en tiempo real, en tu
          zona horaria.
        </p>
      </header>

      <TickerTape />

      <MarketView watchlistSymbols={symbols} />

      <TerminalPanels />
    </div>
  )
}
