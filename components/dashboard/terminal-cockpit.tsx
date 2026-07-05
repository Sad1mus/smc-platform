"use client"

import { useState } from "react"

import { MarketNavigator } from "@/components/dashboard/market-navigator"
import { TradingViewChart } from "@/components/dashboard/tradingview-chart"
import { WatchlistPanel } from "@/components/dashboard/watchlist-panel"
import { TvWidget } from "@/components/dashboard/tv-widget"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Cockpit de terminal (spec §Terminal display): layout 3 paneles —
 * [B] navegador de mercados · [C] gráfico central · [D] watchlist / análisis.
 * SOLO visualización: no expone acciones de operación ni de dinero.
 */
const DEFAULT_SYMBOL = "FX:EURUSD"

const INTERVALS = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "60", label: "1h" },
  { value: "240", label: "4h" },
  { value: "D", label: "1D" },
  { value: "W", label: "1S" },
] as const

export function TerminalCockpit({
  watchlistSymbols,
}: {
  watchlistSymbols: string[]
}) {
  const [activeSymbol, setActiveSymbol] = useState(
    watchlistSymbols[0] ?? DEFAULT_SYMBOL
  )
  const [interval, setInterval] = useState<string>("D")

  return (
    <div className="grid gap-4 lg:grid-cols-[210px_1fr_280px]">
      {/* [B] Navegador de mercados */}
      <div className="min-w-0">
        <MarketNavigator
          activeSymbol={activeSymbol}
          onSelect={setActiveSymbol}
        />
      </div>

      {/* [C] Gráfico central */}
      <div className="flex min-w-0 flex-col gap-3">
        <div
          role="group"
          aria-label="Intervalo del gráfico"
          className="flex flex-wrap items-center gap-1"
        >
          <span className="text-muted-foreground mr-2 font-mono text-sm">
            {activeSymbol}
          </span>
          {INTERVALS.map((item) => (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setInterval(item.value)}
              aria-pressed={interval === item.value}
              className={cn(
                "h-7 px-2.5 font-mono text-xs active:scale-95",
                interval === item.value &&
                  "bg-secondary text-foreground font-semibold"
              )}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <TradingViewChart symbol={activeSymbol} interval={interval} />
      </div>

      {/* [D] Watchlist + análisis técnico del símbolo activo */}
      <div className="flex min-w-0 flex-col gap-4">
        <WatchlistPanel
          symbols={watchlistSymbols}
          activeSymbol={activeSymbol}
          onSelect={setActiveSymbol}
        />
        {/* Análisis técnico atado al símbolo activo (display-only) */}
        <TvWidget
          widget="technical-analysis"
          height={400}
          title={`Análisis técnico de ${activeSymbol}`}
          config={{
            symbol: activeSymbol,
            interval: "1D",
            showIntervalTabs: true,
            displayMode: "single",
          }}
          className="border-border/60 bg-card overflow-hidden rounded-lg border"
        />
      </div>
    </div>
  )
}
