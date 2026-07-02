import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export const metadata = { title: "Admin — SMC" }

function fmtDate(v: string | null) {
  if (!v) return "—"
  return new Date(v).toISOString().slice(0, 10)
}

/**
 * Panel de gestión (solo lectura) sobre el RBAC existente. Las lecturas usan el
 * server client respetando RLS: las políticas `profiles_select_admin` y
 * `subscriptions_select_admin` (via `public.is_admin()`) permiten al admin ver
 * todos los registros. No se usa `service_role`.
 */
export default async function AdminPage() {
  const supabase = await createClient()
  const [{ data: profiles }, { data: subscriptions }] = await Promise.all([
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
  ])

  const users = profiles ?? []
  const subs = subscriptions ?? []

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Panel de administración
        </h1>
        <p className="text-muted-foreground text-sm">
          Gestión de usuarios y suscripciones · solo lectura.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>{users.length} registrados</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">Sin usuarios.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-border/60 border-b text-left font-mono text-xs uppercase">
                <tr>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">Rol</th>
                  <th className="py-2">Alta</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-border/40 border-b last:border-0"
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

      <Card>
        <CardHeader>
          <CardTitle>Suscripciones</CardTitle>
          <CardDescription>{subs.length} registradas</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {subs.length === 0 ? (
            <p className="text-muted-foreground text-sm">Sin suscripciones.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-border/60 border-b text-left font-mono text-xs uppercase">
                <tr>
                  <th className="py-2 pr-4">Usuario</th>
                  <th className="py-2 pr-4">Plan</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Vence</th>
                  <th className="py-2">Cancela al fin</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr
                    key={s.id}
                    className="border-border/40 border-b last:border-0"
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
                      {s.cancel_at_period_end ? "sí" : "no"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
