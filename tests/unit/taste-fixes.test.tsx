import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { Hero } from "@/components/landing/hero"
import { TrustStrip } from "@/components/landing/trust-strip"

afterEach(() => cleanup())

describe("Taste: hero sin trust-strip", () => {
  it("el hero NO contiene las señales de confianza (movidas a su franja)", () => {
    const { container } = render(<Hero />)
    const text = container.textContent ?? ""
    expect(/sin comisiones ocultas|tus datos, cifrados/i.test(text)).toBe(false)
  })

  it("el CTA de signup del hero es 'Crear cuenta' (label unificado)", () => {
    render(<Hero />)
    const cta = screen.getByRole("link", { name: /^crear cuenta$/i })
    expect(cta.getAttribute("href")).toBe("/registro")
  })

  it("el hero no usa em-dash", () => {
    const { container } = render(<Hero />)
    expect((container.textContent ?? "").includes("—")).toBe(false)
  })
})

describe("Taste: TrustStrip como franja propia", () => {
  it("renderiza las señales de confianza fuera del hero", () => {
    render(<TrustStrip />)
    expect(screen.getByText("Sin comisiones ocultas")).toBeTruthy()
    expect(screen.getByText("Tus datos, cifrados")).toBeTruthy()
  })
})
