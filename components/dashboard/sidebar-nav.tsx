"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CandlestickChart, Bell, CreditCard } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Mercados",
    icon: CandlestickChart,
    exact: true,
  },
  {
    href: "/dashboard/alertas",
    label: "Alertas",
    icon: Bell,
    exact: false,
  },
  {
    href: "/dashboard/plan",
    label: "Mi plan",
    icon: CreditCard,
    exact: false,
  },
] as const

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1" aria-label="Navegación principal">
      {NAV_ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150",
              active
                ? "bg-gold/10 text-foreground font-medium"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
            )}
          >
            <item.icon
              aria-hidden="true"
              className={cn("size-4", active && "text-gold")}
            />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
