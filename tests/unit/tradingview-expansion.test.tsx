import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark" }),
}))

import { TerminalPanels } from "@/components/dashboard/terminal-panels"
import { TerminalCockpit } from "@/components/dashboard/terminal-cockpit"

beforeEach(() => vi.clearAllMocks())
afterEach(() => cleanup())

describe("TerminalPanels — set ampliado de widgets display-only", () => {
  it("expone las pestañas nuevas (cripto, ETF, forex, mercados, noticias)", () => {
    render(<TerminalPanels />)
    for (const label of ["Cripto", "ETF", "Forex", "Mercados", "Noticias"]) {
      expect(screen.getByRole("tab", { name: label })).toBeTruthy()
    }
  })

  it("solo el panel activo monta su widget (lazy)", () => {
    const { container } = render(<TerminalPanels />)
    // Por defecto 'heatmap' está activo → su widget está montado; los demás no.
    expect(
      container.querySelector('[data-testid="tv-widget-stock-heatmap"]')
    ).toBeTruthy()
    expect(
      container.querySelector('[data-testid="tv-widget-timeline"]')
    ).toBeNull()
    // Al activar 'Noticias' se monta el timeline.
    fireEvent.click(screen.getByRole("tab", { name: "Noticias" }))
    expect(
      container.querySelector('[data-testid="tv-widget-timeline"]')
    ).toBeTruthy()
  })
})

describe("TerminalCockpit — análisis técnico atado al símbolo activo", () => {
  it("monta un widget technical-analysis en la columna de análisis", () => {
    const { container } = render(
      <TerminalCockpit watchlistSymbols={["NASDAQ:AAPL"]} />
    )
    expect(
      container.querySelector('[data-testid="tv-widget-technical-analysis"]')
    ).toBeTruthy()
  })
})
