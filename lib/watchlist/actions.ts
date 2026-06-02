"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

/**
 * Símbolos en formato TradingView: "EXCHANGE:TICKER" o "TICKER".
 * Ej.: NASDAQ:AAPL, BINANCE:BTCUSDT, FX:EURUSD.
 */
const symbolSchema = z
  .string()
  .trim()
  .min(1, "Ingresa un símbolo")
  .max(40, "El símbolo es demasiado largo")
  .regex(
    /^[A-Za-z0-9_.]+(:[A-Za-z0-9_.!&]+)?$/,
    "Formato de símbolo no válido (ej.: NASDAQ:AAPL)"
  )
  .transform((value) => value.toUpperCase())

export type WatchlistActionResult = {
  error?: string
}

/** Agrega un símbolo a la watchlist del usuario actual. */
export async function addSymbol(
  rawSymbol: string
): Promise<WatchlistActionResult> {
  const parsed = symbolSchema.safeParse(rawSymbol)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Tu sesión expiró. Vuelve a iniciar sesión." }
  }

  const { error } = await supabase.from("watchlists").insert({
    user_id: user.id,
    symbol: parsed.data,
  })

  if (error) {
    if (error.code === "23505") {
      return { error: "Ese símbolo ya está en tu lista." }
    }
    return { error: "No se pudo guardar el símbolo. Intenta de nuevo." }
  }

  revalidatePath("/dashboard")
  return {}
}

/** Elimina un símbolo de la watchlist del usuario actual. */
export async function removeSymbol(
  rawSymbol: string
): Promise<WatchlistActionResult> {
  const parsed = symbolSchema.safeParse(rawSymbol)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Tu sesión expiró. Vuelve a iniciar sesión." }
  }

  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("user_id", user.id)
    .eq("symbol", parsed.data)

  if (error) {
    return { error: "No se pudo eliminar el símbolo. Intenta de nuevo." }
  }

  revalidatePath("/dashboard")
  return {}
}
