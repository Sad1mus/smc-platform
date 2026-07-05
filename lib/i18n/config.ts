/**
 * Configuración de i18n (spec §i18n.md). Estrategia: cookie de locale + diccionarios
 * server-side, sin reestructurar rutas en [locale]. ES es el idioma por defecto.
 */
export const LOCALES = ["es", "en"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "es"
export const LOCALE_COOKIE = "smc-locale"

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "es" || value === "en"
}

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
}
