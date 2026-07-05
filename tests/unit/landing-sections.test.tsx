import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { StatsStrip } from "@/components/landing/stats-strip"
import { HowItWorks } from "@/components/landing/how-it-works"
import { MarketsCovered } from "@/components/landing/markets-covered"
import { Faq } from "@/components/landing/faq"
import { Cta } from "@/components/landing/cta"

afterEach(() => cleanup())

describe("StatsStrip (franja de números verificables)", () => {
  it("muestra las 4 afirmaciones verificables, sin métricas de vanidad", () => {
    render(<StatsStrip />)
    expect(screen.getByText("clases de activos")).toBeTruthy()
    expect(screen.getByText("datos de mercado")).toBeTruthy()
    expect(screen.getByText("mercado cripto")).toBeTruthy()
    expect(screen.getByText("español primero")).toBeTruthy()
  })
})

describe("HowItWorks (3 pasos)", () => {
  it("renderiza exactamente 3 pasos en una lista ordenada", () => {
    const { container } = render(<HowItWorks />)
    expect(screen.getByText("Cómo funciona")).toBeTruthy()
    const steps = container.querySelectorAll("ol > li")
    expect(steps.length).toBe(3)
    expect(screen.getByText("Creá tu cuenta")).toBeTruthy()
    expect(screen.getByText("Elegí tu plan")).toBeTruthy()
    expect(screen.getByText("Analizá los mercados")).toBeTruthy()
  })
})

describe("MarketsCovered (mercados cubiertos)", () => {
  it("muestra las 4 categorías con símbolos de ejemplo en formato TradingView", () => {
    render(<MarketsCovered />)
    expect(screen.getByRole("heading", { name: "Acciones" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Cripto" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Forex" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Índices" })).toBeTruthy()
    expect(screen.getByText("NASDAQ:AAPL")).toBeTruthy()
    expect(screen.getByText("BINANCE:BTCUSDT")).toBeTruthy()
    expect(screen.getByText("FX:EURUSD")).toBeTruthy()
    expect(screen.getByText("SP:SPX")).toBeTruthy()
  })
})

describe("Faq (acordeón público)", () => {
  it("renderiza 8 preguntas en elementos details accesibles", () => {
    const { container } = render(<Faq />)
    const items = container.querySelectorAll("details")
    expect(items.length).toBe(8)
    expect(screen.getByText("¿Qué es SMC?")).toBeTruthy()
    expect(screen.getByText("¿Hay una prueba?")).toBeTruthy()
  })

  it("mantiene el marco regulatorio: no ejecuta órdenes ni da consejos", () => {
    render(<Faq />)
    expect(
      screen.getByText(/no ejecuta órdenes ni custodia fondos/i)
    ).toBeTruthy()
    expect(screen.getByText(/las decisiones son siempre tuyas/i)).toBeTruthy()
  })
})

describe("Cta (llamada final)", () => {
  it("invita a crear cuenta con enlace a /registro", () => {
    render(<Cta />)
    const cta = screen.getByRole("link", { name: /crear cuenta/i })
    expect(cta.getAttribute("href")).toBe("/registro")
  })
})

describe("Copy regulatoria de la landing", () => {
  it("ninguna sección nueva usa la palabra prohibida 'broker'", () => {
    const { container: c1 } = render(<StatsStrip />)
    const { container: c2 } = render(<HowItWorks />)
    const { container: c3 } = render(<MarketsCovered />)
    const { container: c4 } = render(<Faq />)
    const { container: c5 } = render(<Cta />)
    const all = [c1, c2, c3, c4, c5].map((c) => c.textContent ?? "").join(" ")
    expect(/broker/i.test(all)).toBe(false)
  })
})
