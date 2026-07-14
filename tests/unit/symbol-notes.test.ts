import { afterEach, describe, expect, it, vi } from "vitest"

import { saveNote, type NoteActionResult } from "@/lib/notes/actions"

// Notas privadas por símbolo. Dos invariantes que estos tests fijan:
//  1. el símbolo se valida igual que en la watchlist (EXCHANGE:TICKER), porque
//     la validación ahora es compartida (lib/markets/symbol.ts);
//  2. vaciar el campo BORRA la nota — el check de la base exige body no vacío,
//     así que un upsert con "" reventaría en vez de hacer lo obvio.
const h = vi.hoisted(() => ({
  upsert: vi.fn(),
  deleted: vi.fn(),
  user: { id: "u1" } as { id: string } | null,
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: h.user } }) },
    from: () => ({
      upsert: h.upsert,
      delete: () => {
        h.deleted()
        return {
          eq: () => ({ eq: () => Promise.resolve({ error: null }) }),
        }
      },
    }),
  }),
}))

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const EMPTY: NoteActionResult = {}

function form(symbol: string, body: string): FormData {
  const data = new FormData()
  data.set("symbol", symbol)
  data.set("body", body)
  return data
}

afterEach(() => {
  h.upsert.mockReset()
  h.deleted.mockReset()
  h.user = { id: "u1" }
})

describe("notas por símbolo — validación del símbolo", () => {
  it("rechaza tickers sin exchange y no escribe en la base", async () => {
    for (const bare of ["NAS100", "XAUUSD", "AAPL"]) {
      const res = await saveNote(EMPTY, form(bare, "mi análisis"))
      expect(res.error).toMatch(/EXCHANGE:TICKER/)
    }
    expect(h.upsert).not.toHaveBeenCalled()
    expect(h.deleted).not.toHaveBeenCalled()
  })
})

describe("notas por símbolo — guardar", () => {
  it("guarda la nota del símbolo y lo normaliza a mayúsculas", async () => {
    h.upsert.mockResolvedValue({ error: null })

    const res = await saveNote(
      EMPTY,
      form("oanda:xauusd", "  soporte en 2400 ")
    )

    expect(res.ok).toBe(true)
    expect(res.error).toBeUndefined()
    expect(h.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "u1",
        symbol: "OANDA:XAUUSD",
        body: "soporte en 2400",
      }),
      expect.objectContaining({ onConflict: "user_id,symbol" })
    )
  })

  it("rechaza notas más largas que el límite de la base (2000)", async () => {
    const res = await saveNote(EMPTY, form("FX:EURUSD", "x".repeat(2001)))

    expect(res.error).toMatch(/2000/)
    expect(h.upsert).not.toHaveBeenCalled()
  })

  it("no guarda si la sesión expiró", async () => {
    h.user = null

    const res = await saveNote(EMPTY, form("FX:EURUSD", "algo"))

    expect(res.error).toMatch(/sesión/i)
    expect(h.upsert).not.toHaveBeenCalled()
  })
})

describe("notas por símbolo — vaciar borra", () => {
  it("borra la nota cuando el cuerpo queda vacío, en vez de intentar guardar ''", async () => {
    const res = await saveNote(EMPTY, form("FX:EURUSD", "   "))

    expect(res.ok).toBe(true)
    expect(h.deleted).toHaveBeenCalled()
    expect(h.upsert).not.toHaveBeenCalled()
  })
})
