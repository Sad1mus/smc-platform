"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { LanguageToggle } from "@/components/i18n/language-toggle"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

/**
 * Chrome del header (cliente): sticky con sombra al despegar del top, nav de
 * categorías, CTA de acento persistente (nunca desaparece en móvil), toggle de
 * idioma y menú hamburguesa en móvil. Usuario e idioma se resuelven en el server
 * (SiteHeader); las etiquetas vienen del diccionario (sin copy hardcodeada).
 */
export function HeaderChrome({
  isAuthed,
  locale,
  nav,
  cta,
}: {
  isAuthed: boolean
  locale: Locale
  nav: Dictionary["nav"]
  cta: Dictionary["cta"]
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const NAV = [
    { href: "/#como-funciona", label: nav.howItWorks },
    { href: "/#mercados", label: nav.markets },
    { href: "/#planes", label: nav.plans },
    { href: "/faq", label: nav.faq },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:pt-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full border border-white/60 py-2 pr-2 pl-4 backdrop-blur-xl transition-all duration-300 md:pl-6",
          scrolled
            ? "bg-white/70 shadow-[0_20px_44px_-24px_rgba(28,52,120,0.55)]"
            : "bg-white/45 shadow-[0_14px_36px_-26px_rgba(28,52,120,0.45)]"
        )}
      >
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle locale={locale} />
          {isAuthed ? (
            <Button asChild size="sm">
              <Link href="/dashboard">{cta.dashboard}</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/login">{cta.login}</Link>
              </Button>
              {/* CTA de acento persistente (visible también en móvil) */}
              <Button asChild size="sm">
                <Link href="/registro">{cta.openAccount}</Link>
              </Button>
            </>
          )}
          {/* Hamburguesa: solo móvil */}
          <button
            type="button"
            aria-label={open ? cta.menuClose : cta.menuOpen}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground -mr-1 inline-flex size-9 items-center justify-center rounded-md md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Panel móvil desplegable — card glass flotante bajo la píldora */}
      {open ? (
        <nav className="mx-auto mt-2 max-w-5xl rounded-2xl border border-white/60 bg-white/75 shadow-[0_24px_50px_-28px_rgba(28,52,120,0.5)] backdrop-blur-xl md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground/90 hover:text-foreground block py-2.5 text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!isAuthed ? (
              <li>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground block py-2.5 text-sm sm:hidden"
                >
                  {cta.login}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
