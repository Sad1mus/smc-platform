import { describe, expect, it } from "vitest"

import { dictionaries } from "@/lib/i18n/dictionaries"

/**
 * Invariantes de contenido del diccionario (Taste + guardarraíles de marca):
 * sin em-dash, sin promesas de rentabilidad, marca presente, y PARIDAD de
 * claves entre es/en (una traducción faltante es un bug).
 */
const LOCALES = ["es", "en"] as const

function strings(v: unknown): string[] {
  if (typeof v === "string") return [v]
  if (Array.isArray(v)) return v.flatMap(strings)
  if (v && typeof v === "object") return Object.values(v).flatMap(strings)
  return []
}

function paths(v: unknown, prefix = ""): string[] {
  if (Array.isArray(v))
    return v.flatMap((el, i) => paths(el, `${prefix}[${i}]`))
  if (v && typeof v === "object") {
    return Object.entries(v).flatMap(([k, val]) =>
      paths(val, prefix ? `${prefix}.${k}` : k)
    )
  }
  return [prefix]
}

describe("Diccionario — invariantes de contenido y guardarraíles", () => {
  for (const l of LOCALES) {
    const all = strings(dictionaries[l])

    it(`[${l}] sin em-dash en ninguna cadena`, () => {
      expect(all.some((s) => s.includes("—"))).toBe(false)
    })

    it(`[${l}] sin promesas de rentabilidad/retorno`, () => {
      const banned = /rentabilidad garantiz|retorno garantiz|guaranteed return/i
      expect(all.some((s) => banned.test(s))).toBe(false)
    })

    it(`[${l}] la marca "SMC Markets" aparece`, () => {
      expect(all.some((s) => s.includes("SMC Markets"))).toBe(true)
    })

    it(`[${l}] hero tiene titular con acento`, () => {
      expect(dictionaries[l].hero.titleAccent.length).toBeGreaterThan(0)
    })
  }

  it("es y en tienen exactamente las mismas claves (paridad i18n)", () => {
    expect(paths(dictionaries.es).sort()).toEqual(paths(dictionaries.en).sort())
  })
})
