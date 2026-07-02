"use client"

import { TvWidget } from "@/components/dashboard/tv-widget"

/** Símbolos de la cinta: índices + cripto + forex (spec §Dashboard terminal). */
const TICKER_SYMBOLS = [
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
  { proName: "FOREXCOM:NSXUSD", title: "US 100" },
  { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
  { proName: "BITSTAMP:ETHUSD", title: "ETH/USD" },
  { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
  { proName: "TVC:GOLD", title: "Oro" },
]

const TICKER_CONFIG = {
  symbols: TICKER_SYMBOLS,
  showSymbolLogo: true,
  isTransparent: true,
  displayMode: "adaptive",
}

/** Cinta de precios en el tope del dashboard (display-only). */
export function TickerTape() {
  return (
    <TvWidget
      widget="ticker-tape"
      config={TICKER_CONFIG}
      height={46}
      title="Cinta de precios"
      className="border-border/60 bg-card overflow-hidden rounded-lg border"
    />
  )
}
