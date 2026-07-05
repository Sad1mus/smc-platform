import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { getDictionary } from "@/lib/i18n/server"

export async function SiteFooter() {
  const { t } = await getDictionary()
  const year = new Date().getFullYear()
  const links = [
    { href: "/#caracteristicas", label: t.footer.links.features },
    { href: "/#planes", label: t.footer.links.plans },
    { href: "/login", label: t.footer.links.login },
    { href: "/terminos", label: t.footer.links.terms },
    { href: "/privacidad", label: t.footer.links.privacy },
    { href: "/reembolsos", label: t.footer.links.refunds },
  ]

  return (
    <footer className="border-border/60 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <Logo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-border/60 flex flex-col gap-4 border-t pt-6">
          <p className="text-muted-foreground/80 max-w-3xl text-xs leading-relaxed">
            {t.footer.disclaimer}
          </p>
          <p className="text-muted-foreground/60 font-mono text-xs">
            © {year} SMC Markets
          </p>
        </div>
      </div>
    </footer>
  )
}
