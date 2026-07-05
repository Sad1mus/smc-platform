"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

/** Categorías del nav — anclas reales de la landing. */
const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#mercados", label: "Mercados" },
  { href: "/#planes", label: "Planes" },
  { href: "/#faq", label: "Preguntas" },
] as const

/**
 * Chrome del header (cliente): sticky con sombra al despegar del top, nav de
 * categorías, CTA de acento persistente (nunca desaparece en móvil) y menú
 * hamburguesa en móvil. El usuario se resuelve en el server (SiteHeader).
 */
export function HeaderChrome({ isAuthed }: { isAuthed: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "bg-background/80 sticky top-0 z-40 backdrop-blur-md transition-shadow duration-200",
        scrolled
          ? "border-border/60 border-b shadow-sm"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
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
          {isAuthed ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Ir al dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              {/* CTA de acento persistente — visible también en móvil */}
              <Button asChild size="sm">
                <Link href="/registro">Crear cuenta</Link>
              </Button>
            </>
          )}
          {/* Hamburguesa: solo móvil */}
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground -mr-1 inline-flex size-9 items-center justify-center rounded-md md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Panel móvil desplegable */}
      {open ? (
        <nav className="border-border/60 bg-background/95 border-t backdrop-blur-md md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
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
                  Iniciar sesión
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
