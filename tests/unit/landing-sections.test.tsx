import { describe, expect, it } from "vitest"

import { dictionaries } from "@/lib/i18n/dictionaries"

/**
 * Con i18n, la copy de la landing vive en el diccionario (fuente de verdad),
 * no hardcodeada en los componentes. Estos tests asertan el diccionario en
 * AMBOS idiomas: estructura, conteos e invariantes de contenido.
 */
const LOCALES = ["es", "en"] as const

describe("Diccionario — secciones de la landing", () => {
  for (const l of LOCALES) {
    const t = dictionaries[l]

    it(`[${l}] stats: 4 afirmaciones verificables`, () => {
      expect(t.stats.items).toHaveLength(4)
      for (const s of t.stats.items) {
        expect(s.value.length).toBeGreaterThan(0)
        expect(s.label.length).toBeGreaterThan(0)
      }
    })

    it(`[${l}] howItWorks: exactamente 3 pasos con título`, () => {
      expect(t.howItWorks.heading.length).toBeGreaterThan(0)
      expect(t.howItWorks.steps).toHaveLength(3)
    })

    it(`[${l}] markets: las 6 clases de activos del brief`, () => {
      const ids = Object.keys(t.markets.items)
      expect(ids).toHaveLength(6)
      expect(ids).toEqual(
        expect.arrayContaining([
          "indices",
          "forex",
          "shares",
          "commodities",
          "etfs",
          "crypto",
        ])
      )
    })

    it(`[${l}] faq: al menos 6 preguntas con respuesta`, () => {
      expect(t.faq.items.length).toBeGreaterThanOrEqual(6)
      for (const item of t.faq.items) {
        expect(item.q.length).toBeGreaterThan(0)
        expect(item.a.length).toBeGreaterThan(0)
      }
    })
  }
})
