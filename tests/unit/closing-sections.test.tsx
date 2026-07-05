import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { Segments } from "@/components/landing/segments"
import { Resources } from "@/components/landing/resources"
import { ClosingCta } from "@/components/landing/closing-cta"

afterEach(() => cleanup())

describe("Segments (segmentación dual)", () => {
  it("muestra los dos perfiles con su propio CTA", () => {
    render(<Segments />)
    expect(screen.getByText("¿Nuevo en los mercados?")).toBeTruthy()
    expect(screen.getByText("¿Ya seguís los mercados?")).toBeTruthy()
    expect(
      screen.getByRole("link", { name: /empezar con prueba/i })
    ).toBeTruthy()
    expect(screen.getByRole("link", { name: /ver los planes/i })).toBeTruthy()
  })
})

describe("Resources (solo enlaces reales)", () => {
  it("enlaza a recursos que existen hoy, sin webinars falsos", () => {
    render(<Resources />)
    const precios = screen.getByRole("link", { name: /planes y precios/i })
    expect(precios.getAttribute("href")).toBe("/precios")
    const como = screen.getByRole("link", { name: /cómo funciona/i })
    expect(como.getAttribute("href")).toBe("/#como-funciona")
  })
})

describe("ClosingCta (embudo numerado dentro del marco)", () => {
  it("el embudo es Registrate → Elegí plan → Visualizá (no Depositá/Operá)", () => {
    const { container } = render(<ClosingCta />)
    expect(screen.getByText("Registrate")).toBeTruthy()
    expect(screen.getByText("Elegí tu plan")).toBeTruthy()
    expect(screen.getByText("Visualizá los mercados")).toBeTruthy()
    const text = container.textContent ?? ""
    expect(/depositá|depósito|operá|operar/i.test(text)).toBe(false)
  })

  it("tiene un CTA grande hacia /registro y prueba social honesta", () => {
    render(<ClosingCta />)
    const cta = screen.getByRole("link", { name: /crear cuenta/i })
    expect(cta.getAttribute("href")).toBe("/registro")
    expect(screen.getByText(/datos por tradingview/i)).toBeTruthy()
    expect(screen.getByText(/pagos por stripe/i)).toBeTruthy()
  })
})
