import { afterEach, describe, expect, it, vi } from "vitest"

import { addSymbol } from "@/lib/watchlist/actions"

// Regresión: un ticker "pelado" (NAS100, XAUUSD) NO lo resuelve TradingView y
// el panel de análisis técnico queda en "no existen datos". La validación debe
// exigir el prefijo de mercado EXCHANGE:TICKER antes de tocar la base.
const h = vi.hoisted(() => ({ insert: vi.fn() }))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
    from: () => ({ insert: h.insert }),
  }),
}))

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

afterEach(() => {
  h.insert.mockReset()
})

describe("watchlist — la validación exige EXCHANGE:TICKER", () => {
  it("rechaza tickers sin exchange y no escribe en la base", async () => {
    for (const bare of ["NAS100", "XAUUSD", "AAPL"]) {
      const res = await addSymbol(bare)
      expect(res.error).toMatch(/EXCHANGE:TICKER/)
    }
    expect(h.insert).not.toHaveBeenCalled()
  })

  it("acepta símbolos con exchange y los normaliza a mayúsculas", async () => {
    h.insert.mockResolvedValue({ error: null })
    const res = await addSymbol("oanda:xauusd")
    expect(res.error).toBeUndefined()
    expect(h.insert).toHaveBeenCalledWith(
      expect.objectContaining({ symbol: "OANDA:XAUUSD" })
    )
  })
})
