"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

/** Persiste el locale en cookie (fuera del componente: efecto de plataforma). */
function persistLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
}

/**
 * Toggle de idioma (spec §i18n.md): setea la cookie de locale y refresca los
 * Server Components para re-renderizar con el nuevo diccionario. Persiste 1 año.
 */
export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function choose(next: Locale) {
    if (next === locale) return
    persistLocale(next)
    startTransition(() => router.refresh())
  }

  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className="border-border/60 bg-card/40 flex items-center rounded-md border p-0.5 font-mono text-xs"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          aria-pressed={l === locale}
          disabled={pending}
          className={cn(
            "rounded px-1.5 py-0.5 tracking-wide uppercase transition-colors",
            l === locale
              ? "bg-secondary text-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
