import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}))

import { TvWidget } from "@/components/dashboard/tv-widget"
import { TickerTape } from "@/components/dashboard/ticker-tape"
import { TerminalPanels } from "@/components/dashboard/terminal-panels"

beforeEach(() => vi.clearAllMocks())
afterEach(() => cleanup())

describe("TvWidget (wrapper genérico de embeds TradingView)", () => {
  it("inyecta el script oficial de s3.tradingview.com con la config y el tema", () => {
    const { container } = render(
      <TvWidget
        widget="stock-heatmap"
        config={{ dataSource: "SPX500" }}
        height={520}
        title="Mapa de calor"
      />
    )

    const script = container.querySelector("script")
    expect(script?.getAttribute("src")).toBe(
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
    )
    const parsed = JSON.parse(script?.innerHTML ?? "{}")
    expect(parsed.dataSource).toBe("SPX500")
    expect(parsed.colorTheme).toBe("dark")
    expect(parsed.locale).toBe("es")
  })

  it("reserva la altura indicada (cero layout shift)", () => {
    render(
      <TvWidget widget="events" config={{}} height={520} title="Calendario" />
    )
    expect(screen.getByTestId("tv-widget-events").style.height).toBe("520px")
  })

  it("degrada limpio: si el script falla, muestra un aviso amable", () => {
    const { container } = render(
      <TvWidget widget="screener" config={{}} height={520} title="Screener" />
    )
    const script = container.querySelector("script")
    fireEvent.error(script!)
    expect(screen.getByRole("status").textContent).toMatch(/no disponible/i)
  })
})

describe("TickerTape", () => {
  it("monta el widget ticker-tape con símbolos de índices, cripto y forex", () => {
    const { container } = render(<TickerTape />)
    expect(screen.getByTestId("tv-widget-ticker-tape")).toBeTruthy()
    const parsed = JSON.parse(
      container.querySelector("script")?.innerHTML ?? "{}"
    )
    const names = (parsed.symbols as { proName: string }[]).map(
      (s) => s.proName
    )
    expect(names).toContain("FOREXCOM:SPXUSD")
    expect(names).toContain("BITSTAMP:BTCUSD")
    expect(names).toContain("FX_IDC:EURUSD")
  })
})

describe("TerminalPanels (tabs lazy)", () => {
  it("muestra las 3 pestañas y solo monta el panel activo", () => {
    render(<TerminalPanels />)
    expect(screen.getAllByRole("tab")).toHaveLength(3)
    expect(screen.getByTestId("tv-widget-stock-heatmap")).toBeTruthy()
    expect(screen.queryByTestId("tv-widget-events")).toBeNull()
    expect(screen.queryByTestId("tv-widget-screener")).toBeNull()
  })

  it("al cambiar de pestaña desmonta el anterior y monta el nuevo (lazy real)", () => {
    render(<TerminalPanels />)
    fireEvent.click(screen.getByRole("tab", { name: "Calendario" }))
    expect(screen.getByTestId("tv-widget-events")).toBeTruthy()
    expect(screen.queryByTestId("tv-widget-stock-heatmap")).toBeNull()
  })

  it("mantiene la atribución TradingView visible", () => {
    render(<TerminalPanels />)
    expect(screen.getByRole("link", { name: /by TradingView/i })).toBeTruthy()
  })
})
