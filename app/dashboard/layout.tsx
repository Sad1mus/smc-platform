import { redirect } from "next/navigation"

import { getProfile, getUser } from "@/lib/auth/profile"
import { getLocale } from "@/lib/i18n/server"
import { Logo } from "@/components/brand/logo"
import { BiometricGate } from "@/components/native/biometric-gate"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { LanguageToggle } from "@/components/i18n/language-toggle"
import { UserNav } from "@/components/dashboard/user-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) {
    redirect("/login?next=/dashboard")
  }

  const [profile, locale] = await Promise.all([getProfile(), getLocale()])

  return (
    <div className="flex min-h-svh">
      {/* Sidebar — solo desktop */}
      <aside className="border-sidebar-border bg-sidebar sticky top-0 hidden h-svh w-56 flex-col gap-6 border-r p-4 md:flex">
        <Logo href="/dashboard" className="px-3" />
        <SidebarNav />
        <p className="text-muted-foreground/60 mt-auto px-3 font-mono text-[11px] leading-relaxed">
          Análisis de mercados. La ejecución es de los brokers socios regulados.
        </p>
      </aside>

      {/* Área principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border/60 bg-background/80 sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-md md:px-6">
          <div className="md:hidden">
            <Logo href="/dashboard" />
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <LanguageToggle locale={locale} />
            <ThemeToggle />
            <UserNav
              email={user.email ?? ""}
              fullName={profile?.full_name ?? null}
              role={profile?.role ?? "user"}
            />
          </div>
        </header>

        {/* Nav móvil bajo el header */}
        <div className="border-border/60 border-b p-2 md:hidden">
          <SidebarNav />
        </div>

        <main className="terminal-app flex-1 p-4 md:p-6">
          <BiometricGate>{children}</BiometricGate>
        </main>
      </div>
    </div>
  )
}
