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
    <footer className="px-4 pt-4 pb-8 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[1.75rem] bg-[#141824] p-8 text-white/90 shadow-[0_30px_64px_-32px_rgba(28,52,120,0.6)] md:p-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <Logo className="text-white" />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/55 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-white/55">
            {t.footer.disclaimer}
          </p>
          <p className="font-mono text-xs text-white/40">
            © {year} SMC Markets
          </p>
        </div>
      </div>
    </footer>
  )
}
