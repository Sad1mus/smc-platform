import { describe, expect, it } from "vitest"

import { dictionaries } from "@/lib/i18n/dictionaries"

/**
 * Cierre, segmentación y recursos sobre el diccionario i18n, en ambos idiomas.
 */
const LOCALES = ["es", "en"] as const

describe("Diccionario — cierre, segmentos y recursos", () => {
  for (const l of LOCALES) {
    const t = dictionaries[l]

    it(`[${l}] closing: embudo de 3 pasos + prueba social`, () => {
      expect(t.closing.steps).toHaveLength(3)
      expect(t.closing.proof).toHaveLength(3)
      expect(t.closing.heading.length).toBeGreaterThan(0)
    })

    it(`[${l}] segments: dos bloques con título y CTAs`, () => {
      expect(t.segments.novice.title.length).toBeGreaterThan(0)
      expect(t.segments.novice.primary.length).toBeGreaterThan(0)
      expect(t.segments.pro.title.length).toBeGreaterThan(0)
      expect(t.segments.pro.primary.length).toBeGreaterThan(0)
    })

    it(`[${l}] resources: 3 recursos`, () => {
      expect(t.resources.items).toHaveLength(3)
    })
  }
})
