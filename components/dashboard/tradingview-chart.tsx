"use client"

import { memo, useEffect, useRef } from "react"
import { useTheme } from "next-themes"

const TRADINGVIEW_SCRIPT_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"

type TradingViewChartProps = {
  symbol: string
  interval: string
}

/**
 * Advanced Real-Time Chart Widget de TradingView (embed oficial).
 * Los datos llegan por WebSocket dentro del iframe del widget.
 * Atribución "by TradingView" requerida por sus términos de uso.
 */
function TradingViewChartInner({ symbol, interval }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ""

    const widgetDiv = document.createElement("div")
    widgetDiv.className = "tradingview-widget-container__widget"
    widgetDiv.style.height = "100%"
    widgetDiv.style.width = "100%"
    container.appendChild(widgetDiv)

    const script = document.createElement("script")
    script.src = TRADINGVIEW_SCRIPT_SRC
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: resolvedTheme === "light" ? "light" : "dark",
      style: "1",
      locale: "es",
      allow_symbol_change: true,
      hide_side_toolbar: false,
      withdateranges: true,
      support_host: "https://www.tradingview.com",
    })
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }, [symbol, interval, resolvedTheme])

  return (
    <figure className="flex h-full min-h-[480px] flex-col gap-2">
      <div
        ref={containerRef}
        data-testid="tradingview-container"
        className="tradingview-widget-container border-border/60 bg-card min-h-0 flex-1 overflow-hidden rounded-lg border border-dashed"
      />
      <figcaption className="text-muted-foreground text-right font-mono text-xs">
        Gráficos{" "}
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-gold underline-offset-4 hover:underline"
        >
          by TradingView
        </a>
      </figcaption>
    </figure>
  )
}

export const TradingViewChart = memo(TradingViewChartInner)
