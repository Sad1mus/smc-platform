"use client"

import { useState } from "react"

import { TradingViewChart } from "@/components/dashboard/tradingview-chart"
import { WatchlistPanel } from "@/components/dashboard/watchlist-panel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Símbolo por defecto cuando la watchlist está vacía. */
const DEFAULT_SYMBOL = "FX:EURUSD"

/** Intervalos del selector (formato del widget de TradingView). */
const INTERVALS = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "60", label: "1h" },
  { value: "240", label: "4h" },
  { value: "D", label: "1D" },
  { value: "W", label: "1S" },
] as const

type MarketViewProps = {
  watchlistSymbols: string[]
}

export function MarketView({ watchlistSymbols }: MarketViewProps) {
  const [activeSymbol, setActiveSymbol] = useState(
    watchlistSymbols[0] ?? DEFAULT_SYMBOL
  )
  const [interval, setInterval] = useState<string>("D")

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="flex min-w-0 flex-col gap-3">
        {/* Selector de intervalos */}
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

      <WatchlistPanel
        symbols={watchlistSymbols}
        activeSymbol={activeSymbol}
        onSelect={setActiveSymbol}
      />
    </div>
  )
}
