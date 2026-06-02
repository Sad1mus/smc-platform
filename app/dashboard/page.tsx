import type { Metadata } from "next"

import { getProfile, getUser } from "@/lib/auth/profile"
import { createClient } from "@/lib/supabase/server"
import { MarketView } from "@/components/dashboard/market-view"

export const metadata: Metadata = {
  title: "Mercados",
  description: "Tu panel de visualización de mercados en tiempo real.",
}

export default async function DashboardPage() {
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

      <MarketView watchlistSymbols={symbols} />
    </div>
  )
}
