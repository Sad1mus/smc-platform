import { redirect } from "next/navigation"

import { getProfile, getUser, isAdmin } from "@/lib/auth/profile"
import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { UserNav } from "@/components/dashboard/user-nav"

/**
 * Panel de administración — protegido por RBAC.
 * Acceso solo para usuarios con `profiles.role = 'admin'` (via isAdmin()).
 * No-autenticado → login; autenticado no-admin → dashboard.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) {
    redirect("/login?next=/admin")
  }
  if (!(await isAdmin())) {
    redirect("/dashboard")
  }

  const profile = await getProfile()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-border/60 bg-background/80 sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-3">
          <Logo href="/admin" />
          <span className="text-muted-foreground border-border/60 rounded border px-2 py-0.5 font-mono text-[11px] tracking-wide uppercase">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <UserNav
            email={user.email ?? ""}
            fullName={profile?.full_name ?? null}
            role={profile?.role ?? "user"}
          />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
