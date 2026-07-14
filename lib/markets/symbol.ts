import { z } from "zod"

/**
 * Validación única del formato de símbolo. La comparten watchlist y notas, y
 * cualquier feature futura que acepte un símbolo del usuario: el invariante es
 * del dominio, no de una feature.
 *
 * Símbolos en formato TradingView "EXCHANGE:TICKER" (el prefijo de mercado es
 * OBLIGATORIO). Ej.: NASDAQ:AAPL, BINANCE:BTCUSDT, FX:EURUSD, OANDA:XAUUSD.
 *
 * Un ticker "pelado" (p. ej. NAS100, XAUUSD) NO lo resuelve TradingView y el
 * panel de análisis técnico queda en "no existen datos". Por eso se exige el
 * exchange en vez de aceptarlo opcional.
 */
export const symbolSchema = z
  .string()
  .trim()
  .min(1, "Ingresa un símbolo")
  .max(40, "El símbolo es demasiado largo")
  .regex(
    /^[A-Za-z0-9_.]+:[A-Za-z0-9_.!&]+$/,
    "Incluí el mercado: EXCHANGE:TICKER (ej.: NASDAQ:AAPL, OANDA:XAUUSD)"
  )
  .transform((value) => value.toUpperCase())
