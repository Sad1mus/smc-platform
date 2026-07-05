import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { alertLimitForPlan, canCreateAlert } from "@/lib/alerts/limits"
import { AlertForm } from "@/components/dashboard/alert-form"

describe("alertLimitForPlan (gating por plan)", () => {
  it("mapea límites conocidos y deja ilimitado a plata/vip", () => {
    expect(alertLimitForPlan("prueba")).toBe(3)
    expect(alertLimitForPlan("bronce")).toBe(5)
    expect(alertLimitForPlan("plata")).toBe(Infinity)
    expect(alertLimitForPlan("vip")).toBe(Infinity)
  })

  it("plan desconocido o nulo cae al mínimo conservador (3)", () => {
    expect(alertLimitForPlan(null)).toBe(3)
    expect(alertLimitForPlan("otro")).toBe(3)
  })
})

describe("canCreateAlert", () => {
  it("bloquea al alcanzar el tope y permite bajo el tope", () => {
    expect(canCreateAlert("bronce", 4)).toBe(true)
    expect(canCreateAlert("bronce", 5)).toBe(false)
    expect(canCreateAlert("plata", 999)).toBe(true) // ilimitado
  })
})

describe("AlertForm (crear alerta — análisis, no operación)", () => {
  afterEach(() => cleanup())

  it("renderiza símbolo, condición (sube/baja) y umbral, sin comprar/vender", () => {
    const { container } = render(<AlertForm />)
    expect(screen.getByLabelText("Símbolo")).toBeTruthy()
    expect(screen.getByLabelText("Umbral")).toBeTruthy()
    expect(screen.getByText("Sube de")).toBeTruthy()
    expect(screen.getByText("Baja de")).toBeTruthy()
    const text = container.textContent ?? ""
    expect(/comprar|vender/i.test(text)).toBe(false)
  })
})
