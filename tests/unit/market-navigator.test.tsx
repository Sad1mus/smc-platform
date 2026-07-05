import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

import { MarketNavigator } from "@/components/dashboard/market-navigator"
import { TerminalStatusBar } from "@/components/dashboard/terminal-status-bar"

afterEach(() => cleanup())

describe("MarketNavigator (navegador de mercados, display-only)", () => {
  it("lista las 5 categorías con símbolos de ejemplo", () => {
    render(<MarketNavigator activeSymbol="FX:EURUSD" onSelect={() => {}} />)
    for (const cat of [
      "Forex",
      "Índices",
      "Materias primas",
      "Acciones",
      "Cripto",
    ]) {
      expect(screen.getByText(cat)).toBeTruthy()
    }
    expect(screen.getByText("BINANCE:BTCUSDT")).toBeTruthy()
  })

  it("el buscador filtra símbolos y al elegir uno llama onSelect", () => {
    const onSelect = vi.fn()
    render(<MarketNavigator activeSymbol="FX:EURUSD" onSelect={onSelect} />)
    fireEvent.change(screen.getByLabelText(/buscar mercado/i), {
      target: { value: "btc" },
    })
    const btc = screen.getByText("BINANCE:BTCUSDT")
    expect(screen.queryByText("NASDAQ:AAPL")).toBeNull()
    fireEvent.click(btc)
    expect(onSelect).toHaveBeenCalledWith("BINANCE:BTCUSDT")
  })

  it("no expone ninguna acción de operación (solo navegación)", () => {
    const { container } = render(
      <MarketNavigator activeSymbol="FX:EURUSD" onSelect={() => {}} />
    )
    const text = container.textContent ?? ""
    expect(/comprar|vender|deposit/i.test(text)).toBe(false)
  })
})

describe("TerminalStatusBar (barra de estado sin dinero)", () => {
  it("muestra plan y sesión, nunca fondos/margen/P&L", () => {
    const { container } = render(<TerminalStatusBar planName="Plata" />)
    expect(screen.getByText("Plata")).toBeTruthy()
    const text = container.textContent ?? ""
    expect(/fondos|equidad|margen|depósito|depositar/i.test(text)).toBe(false)
  })
})
