import type { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Mi plan",
  description: "Gestiona tu plan de acceso a la plataforma.",
}

export default function PlanPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Mi plan</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tu suscripción y método de pago.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Sin plan activo</CardTitle>
          <CardDescription>
            Cuando los pagos estén habilitados podrás elegir y gestionar tu
            plan desde aquí.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-border/60 bg-secondary/40 grid h-32 place-items-center rounded-lg border border-dashed">
            <p className="text-muted-foreground font-mono text-sm">
              Planes y facturación — Stripe
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
