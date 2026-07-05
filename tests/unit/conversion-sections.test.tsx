import { describe, expect, it } from "vitest"

import { dictionaries } from "@/lib/i18n/dictionaries"

/**
 * Secciones de conversión (trío de valor, plataforma, por qué elegirnos) sobre
 * el diccionario i18n, en ambos idiomas.
 */
const LOCALES = ["es", "en"] as const

describe("Diccionario — secciones de conversión", () => {
  for (const l of LOCALES) {
    const t = dictionaries[l]

    it(`[${l}] valueTrio: exactamente 3 tarjetas`, () => {
      expect(t.valueTrio.items).toHaveLength(3)
      for (const item of t.valueTrio.items) {
        expect(item.title.length).toBeGreaterThan(0)
        expect(item.description.length).toBeGreaterThan(0)
      }
    })

    it(`[${l}] platform: features + CTA + heading`, () => {
      expect(t.platform.heading.length).toBeGreaterThan(0)
      expect(t.platform.features.length).toBeGreaterThanOrEqual(3)
      expect(t.platform.cta.length).toBeGreaterThan(0)
    })

    it(`[${l}] whyUs: 4 pilares reales`, () => {
      expect(t.whyUs.pillars).toHaveLength(4)
    })
  }
})
