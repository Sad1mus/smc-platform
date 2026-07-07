import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// Tema controlable por test. next-themes devuelve resolvedTheme=undefined en el
// primer render (antes de hidratar) y luego resuelve; simulamos ambos estados.
let mockResolvedTheme: string | undefined = "light"
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme }),
}))

import { TvWidget } from "@/components/dashboard/tv-widget"
import { TradingViewChart } from "@/components/dashboard/tradingview-chart"

const tvScripts = (c: HTMLElement) =>
  c.querySelectorAll('script[src*="s3.tradingview.com"]').length

afterEach(() => cleanup())

describe("Embeds TradingView — no doble montaje por tema sin resolver", () => {
  it("TvWidget NO inyecta el script mientras resolvedTheme es undefined", () => {
    mockResolvedTheme = undefined
    const { container } = render(
      <TvWidget widget="ticker-tape" config={{}} height={80} title="Ticker" />
    )
    // Antes del fix montaba con tema undefined (→ dark) y recargaba al resolver.
    expect(tvScripts(container)).toBe(0)
  })

  it("TvWidget inyecta el script UNA vez cuando el tema resuelve", () => {
    mockResolvedTheme = "light"
    const { container } = render(
      <TvWidget widget="ticker-tape" config={{}} height={80} title="Ticker" />
    )
    expect(tvScripts(container)).toBe(1)
  })

  it("TradingViewChart NO inyecta el script mientras resolvedTheme es undefined", () => {
    mockResolvedTheme = undefined
    const { container } = render(
      <TradingViewChart symbol="NASDAQ:AAPL" interval="D" />
    )
    expect(tvScripts(container)).toBe(0)
  })

  it("TradingViewChart inyecta el script UNA vez cuando el tema resuelve", () => {
    mockResolvedTheme = "light"
    const { container } = render(
      <TradingViewChart symbol="NASDAQ:AAPL" interval="D" />
    )
    expect(tvScripts(container)).toBe(1)
  })
})
