import type { Metadata } from "next"

import { getProfile } from "@/lib/auth/profile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Mercados",
  description: "Tu panel de visualización de mercados.",
}

export default async function DashboardPage() {
  const profile = await getProfile()
  const firstName = profile?.full_name?.split(" ")[0]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1
          className="text-2xl font-bold tracking-tight"
          data-testid="dashboard-title"
        >
          Mercados
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {firstName ? `Hola, ${firstName}. ` : ""}Aquí verás tus gráficos en
          tiempo real.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Gráficos en camino</CardTitle>
          <CardDescription>
            Los gráficos de mercado en tiempo real estarán disponibles aquí en
            la siguiente actualización de la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-border/60 bg-secondary/40 grid h-64 place-items-center rounded-lg border border-dashed">
            <p className="text-muted-foreground font-mono text-sm">
              Área del gráfico — TradingView
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
