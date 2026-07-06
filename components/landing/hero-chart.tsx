"use client"

import { memo, useEffect, useRef } from "react"

const SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"

/**
 * Gráfico de mercado REAL de TradingView para el hero (embed oficial, tema claro,
 * tinteado al acento de la landing). Datos en vivo por el widget. Reemplaza al
 * ticker ilustrativo: el hero muestra el producto de verdad, no un mockup.
 * Atribución "by TradingView" en el hero (requerida por sus términos).
 */
function HeroChartInner() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    container.innerHTML = ""

    const widget = document.createElement("div")
    widget.className = "tradingview-widget-container__widget"
    widget.style.height = "100%"
    widget.style.width = "100%"
    container.appendChild(widget)

    const script = document.createElement("script")
    script.src = SRC
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        ["Nasdaq 100", "FOREXCOM:NSXUSD|12M"],
        ["Bitcoin", "BINANCE:BTCUSDT|12M"],
        ["EUR/USD", "FX:EURUSD|12M"],
        ["Oro", "OANDA:XAUUSD|12M"],
      ],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "es",
      colorTheme: "light",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      lineWidth: 2,
      lineType: 0,
      lineColor: "#38455E",
      topColor: "rgba(56, 69, 94, 0.20)",
      bottomColor: "rgba(56, 69, 94, 0.00)",
      backgroundColor: "#FFFFFF",
      support_host: "https://www.tradingview.com",
    })
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }, [])

  return (
    <div ref={ref} className="tradingview-widget-container h-full w-full" />
  )
}

export const HeroChart = memo(HeroChartInner)
