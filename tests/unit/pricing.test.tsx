import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, within } from "@testing-library/react"

/**
 * Planes con las features REALES del seed (tabla plans). Las features son
 * acumulativas ("Todo lo del plan X"): el test verifica que la comparativa
 * resuelve la herencia usando solo strings que existen en la DB.
 */
const SEED_PLANS = [
  {
    id: "prueba",
    name: "Prueba",
    price_usd: "250.00",
    is_custom: false,
    sort_order: 0,
    features: [
      "Acceso a la plataforma",
      "Gráficos en tiempo real",
      "Soporte estándar",
    ],
  },
  {
    id: "bronce",
    name: "Bronce",
    price_usd: "1500.00",
    is_custom: false,
    sort_order: 1,
    features: [
      "Acceso a la plataforma",
      "Gráficos y dashboards en tiempo real",
      "Soporte estándar",
    ],
  },
  {
    id: "plata",
    name: "Plata",
    price_usd: "2800.00",
    is_custom: false,
    sort_order: 2,
    features: [
      "Todo lo del plan Bronce",
      "Funcionalidades avanzadas",
      "Soporte prioritario",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    price_usd: null,
    is_custom: true,
    sort_order: 3,
    features: [
      "Todo lo del plan Plata",
      "Configuración a medida",
      "Soporte dedicado y onboarding",
    ],
  },
]

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: async () => ({ data: SEED_PLANS }),
        }),
      }),
    }),
  }),
}))

import { PlanComparison } from "@/components/pricing/plan-comparison"
import { BillingFaq } from "@/components/pricing/billing-faq"

afterEach(() => cleanup())

describe("PlanComparison (tabla comparativa desde la DB)", () => {
  it("muestra los 4 planes como columnas con su precio", async () => {
    render(await PlanComparison())
    expect(screen.getByText("Tabla comparativa")).toBeTruthy()
    for (const name of ["Prueba", "Bronce", "Plata", "VIP"]) {
      expect(
        screen.getByRole("columnheader", { name: new RegExp(name) })
      ).toBeTruthy()
    }
    expect(screen.getByText("Personalizado")).toBeTruthy()
  })

  it("resuelve 'Todo lo del plan X': Plata incluye features heredadas de Bronce", async () => {
    render(await PlanComparison())
    // "Acceso a la plataforma" es de Bronce; Plata lo hereda vía "Todo lo del plan Bronce".
    const row = screen.getByRole("row", { name: /Acceso a la plataforma/ })
    // Prueba, Bronce, Plata y VIP lo incluyen → 4 marcas "Incluido".
    const included = within(row).getAllByLabelText("Incluido")
    expect(included.length).toBe(4)
  })

  it("no inventa features: solo strings presentes en la DB", async () => {
    render(await PlanComparison())
    expect(
      screen.getByRole("row", { name: /Configuración a medida/ })
    ).toBeTruthy()
    expect(screen.queryByText("Ejecución de órdenes")).toBeNull()
  })
})

describe("BillingFaq (FAQ de facturación honesta)", () => {
  it("renderiza las 5 preguntas canon", () => {
    const { container } = render(<BillingFaq />)
    expect(container.querySelectorAll("details").length).toBe(5)
    expect(screen.getByText("¿Cómo pago?")).toBeTruthy()
    expect(screen.getByText("¿Cómo funciona la Prueba?")).toBeTruthy()
  })

  it("los reembolsos remiten a /reembolsos sin prometer otra política", () => {
    render(<BillingFaq />)
    const link = screen.getByRole("link", { name: /política de reembolsos/i })
    expect(link.getAttribute("href")).toBe("/reembolsos")
  })
})
