import "server-only"

import { cookies } from "next/headers"

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  type Locale,
} from "@/lib/i18n/config"
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries"

/**
 * Resuelve el locale activo desde la cookie (server-side). Cae a ES por defecto.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** Locale + diccionario ya resuelto, para Server Components. */
export async function getDictionary(): Promise<{
  locale: Locale
  t: Dictionary
}> {
  const locale = await getLocale()
  return { locale, t: dictionaries[locale] }
}
