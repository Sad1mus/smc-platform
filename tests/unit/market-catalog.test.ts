import { describe, expect, it } from "vitest"

import {
  MARKET_CATEGORIES,
  allSymbols,
  labelForSymbol,
  searchCatalog,
} from "@/lib/markets/catalog"

// El navegador de mercados antes filtraba solo por el ticker crudo sobre 15
// símbolos hardcodeados: buscar "oro" o "bitcoin" no devolvía nada y faltaba
// entera la clase ETF que la landing promete. Estos tests fijan las dos cosas.

describe("catálogo de mercados — forma e invariantes", () => {
  it("cubre las 6 clases de activo que promete la landing", () => {
    expect(MARKET_CATEGORIES.map((c) => c.id).sort()).toEqual([
      "commodities",
      "crypto",
      "etf",
      "forex",
      "indices",
      "stocks",
    ])
  })

  it("todos los símbolos usan EXCHANGE:TICKER (si no, TradingView no los resuelve)", () => {
    for (const { symbol } of allSymbols()) {
      expect(symbol).toMatch(/^[A-Z0-9_.]+:[A-Z0-9_.!&]+$/)
    }
  })

  it("no repite símbolos entre categorías", () => {
    const symbols = allSymbols().map((s) => s.symbol)
    expect(new Set(symbols).size).toBe(symbols.length)
  })

  it("todo símbolo tiene nombre legible (es lo que se busca sin saber el ticker)", () => {
    for (const { symbol, label } of allSymbols()) {
      expect(label.length, `${symbol} sin label`).toBeGreaterThan(0)
    }
  })
})

describe("catálogo de mercados — búsqueda", () => {
  it("sin query devuelve el catálogo completo", () => {
    expect(searchCatalog("")).toHaveLength(MARKET_CATEGORIES.length)
    expect(searchCatalog("   ")).toHaveLength(MARKET_CATEGORIES.length)
  })

  it("encuentra por nombre legible, no solo por ticker", () => {
    const oro = searchCatalog("oro").flatMap((c) => c.symbols)
    expect(oro.map((s) => s.symbol)).toContain("OANDA:XAUUSD")

    const btc = searchCatalog("bitcoin").flatMap((c) => c.symbols)
    expect(btc.map((s) => s.symbol)).toContain("BINANCE:BTCUSDT")
  })

  it("sigue encontrando por símbolo", () => {
    const found = searchCatalog("EURUSD").flatMap((c) => c.symbols)
    expect(found.map((s) => s.symbol)).toContain("FX:EURUSD")
  })

  it("ignora acentos y mayúsculas", () => {
    // "indices" (sin tilde) debe encontrar la categoría "Índices" por sus símbolos.
    const dolar = searchCatalog("DOLAR").flatMap((c) => c.symbols)
    expect(dolar.map((s) => s.symbol)).toContain("FX:EURUSD")
  })

  it("omite las categorías sin coincidencias en vez de mostrarlas vacías", () => {
    const result = searchCatalog("bitcoin")
    expect(result.every((c) => c.symbols.length > 0)).toBe(true)
    expect(result.map((c) => c.id)).toEqual(["crypto"])
  })

  it("query sin resultados devuelve lista vacía", () => {
    expect(searchCatalog("zzzzz-no-existe")).toEqual([])
  })
})

describe("labelForSymbol", () => {
  it("resuelve el nombre legible del símbolo activo", () => {
    expect(labelForSymbol("BINANCE:BTCUSDT")).toBe("Bitcoin")
    expect(labelForSymbol("binance:btcusdt")).toBe("Bitcoin")
  })

  it("devuelve null para símbolos fuera del catálogo (el usuario puede tener los suyos)", () => {
    expect(labelForSymbol("NASDAQ:ZZZZ")).toBeNull()
  })
})
