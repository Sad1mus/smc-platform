import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { signOut } from "@/lib/auth/actions"
import { getProfile, getUser } from "@/lib/auth/profile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Dashboard — SMC",
  description: "Tu panel de visualización de mercados.",
}

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) {
    redirect("/login?next=/dashboard")
  }

  const profile = await getProfile()

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-6 md:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="dashboard-title">
          Dashboard
        </h1>
        <form action={signOut}>
          <Button type="submit" variant="outline" data-testid="logout-button">
            Cerrar sesión
          </Button>
        </form>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Hola, {profile?.full_name || user.email}</CardTitle>
          <CardDescription>
            Sesión activa con rol{" "}
            <Badge variant="secondary">{profile?.role ?? "user"}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Los gráficos de mercado en tiempo real estarán disponibles aquí.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
