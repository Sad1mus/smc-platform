import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { ValueTrio } from "@/components/landing/value-trio"
import { PlatformSection } from "@/components/landing/platform-section"
import { WhyUs } from "@/components/landing/why-us"

afterEach(() => cleanup())

describe("ValueTrio (trío de valor, regla de 3)", () => {
  it("renderiza exactamente 3 tarjetas adaptadas al marco", () => {
    const { container } = render(<ValueTrio />)
    expect(container.querySelectorAll("article").length).toBe(3)
    expect(screen.getByText("Datos en tiempo real")).toBeTruthy()
    expect(screen.getByText("Todo en un panel")).toBeTruthy()
    expect(screen.getByText("Pagos seguros")).toBeTruthy()
  })
})

describe("PlatformSection (plataforma / tecnología)", () => {
  it("muestra el CTA contextual hacia /registro", () => {
    render(<PlatformSection />)
    const cta = screen.getByRole("link", { name: /explorá la plataforma/i })
    expect(cta.getAttribute("href")).toBe("/registro")
  })

  it("usa un embed real de TradingView con su atribución (no un mockup fake)", () => {
    render(<PlatformSection />)
    expect(screen.getByText(/datos en vivo por tradingview/i)).toBeTruthy()
  })
})

describe("WhyUs (pilares de confianza REALES)", () => {
  it("renderiza 4 pilares con señales verificables", () => {
    const { container } = render(<WhyUs />)
    expect(container.querySelectorAll("article").length).toBe(4)
    expect(screen.getByText(/provistos por TradingView/i)).toBeTruthy()
    expect(screen.getByText(/procesados por Stripe/i)).toBeTruthy()
    expect(screen.getByText(/RLS/)).toBeTruthy()
  })

  it("no inventa premios ni reguladores", () => {
    const { container } = render(<WhyUs />)
    const text = container.textContent ?? ""
    expect(/premio|galardón|regulado por|licencia n/i.test(text)).toBe(false)
  })
})
