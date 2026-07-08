"use client"

import { memo, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

/**
 * Wrapper genérico para los embeds gratuitos display-only de TradingView
 * (ticker-tape, stock-heatmap, events, screener…). Mismo patrón que
 * TradingViewChart: script oficial de s3.tradingview.com (ya permitido por
 * la CSP) con la config en JSON. Altura reservada (cero layout shift) y
 * degradación limpia si el script de terceros no carga.
 */

type TvWidgetProps = {
  /** Nombre del embed: "ticker-tape" | "stock-heatmap" | "events" | "screener" */
  widget: string
  /** Config del widget (sin colorTheme/locale: se inyectan solos). */
  config: Record<string, unknown>
  /** Altura reservada en px. */
  height: number
  /** Nombre humano para accesibilidad y fallback. */
  title: string
  className?: string
}

function TvWidgetInner({
  widget,
  config,
  height,
  title,
  className,
}: TvWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // next-themes devuelve resolvedTheme=undefined en el primer render y luego
    // resuelve; sin esta guarda el embed monta con el tema equivocado y se
    // recarga al resolver (doble carga del script de terceros → errores
    // intermitentes / flicker). Montamos una sola vez, ya con el tema correcto.
    if (!resolvedTheme) return

    // Limpiar un error previo al re-montar el embed de terceros (cambio de tema/
    // config) es sincronización con un sistema externo, no un cascading render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFailed(false)
    container.innerHTML = ""

    const widgetDiv = document.createElement("div")
    widgetDiv.className = "tradingview-widget-container__widget"
    widgetDiv.style.height = "100%"
    widgetDiv.style.width = "100%"
    container.appendChild(widgetDiv)

    const script = document.createElement("script")
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widget}.js`
    script.type = "text/javascript"
    script.async = true
    script.onerror = () => setFailed(true)
    script.innerHTML = JSON.stringify({
      colorTheme: resolvedTheme === "light" ? "light" : "dark",
      locale: "es",
      width: "100%",
      height: "100%",
      ...config,
    })
    container.appendChild(script)

    return () => {
      container.innerHTML = ""
    }
  }, [widget, config, resolvedTheme])

  return (
    <div
      className={className}
      style={{ height }}
      data-testid={`tv-widget-${widget}`}
    >
      {failed ? (
        <div
          role="status"
          className="border-border/60 bg-card text-muted-foreground flex h-full items-center justify-center rounded-lg border text-sm"
        >
          {title} no disponible en este momento.
        </div>
      ) : (
        <div
          ref={containerRef}
          aria-label={title}
          className="tradingview-widget-container h-full overflow-hidden"
        />
      )}
    </div>
  )
}

export const TvWidget = memo(TvWidgetInner)
