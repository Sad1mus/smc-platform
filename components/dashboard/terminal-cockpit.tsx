"use client"

import { useState } from "react"

import { MarketNavigator } from "@/components/dashboard/market-navigator"
import { TradingViewChart } from "@/components/dashboard/tradingview-chart"
import { WatchlistPanel } from "@/components/dashboard/watchlist-panel"
import { SymbolNotes } from "@/components/dashboard/symbol-notes"
import { TvWidget } from "@/components/dashboard/tv-widget"
import { PanelHeader } from "@/components/dashboard/panel-header"
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
  notes,
}: {
  watchlistSymbols: string[]
  /** Nota privada del usuario por símbolo. Ver components/dashboard/symbol-notes.tsx. */
  notes: Record<string, string>
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

      {/* [C] Gráfico central + notas del símbolo activo */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="terminal-panel flex flex-col overflow-hidden">
          <PanelHeader
            label="Gráfico"
            hint={<span className="text-foreground">{activeSymbol}</span>}
          />
          <div
            role="group"
            aria-label="Intervalo del gráfico"
            className="border-border/60 flex flex-wrap items-center gap-1 border-b px-2 py-1.5"
          >
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

          <div className="min-w-0 p-2">
            <TradingViewChart symbol={activeSymbol} interval={interval} />
          </div>
        </div>

        {/* key={activeSymbol} remonta el panel al cambiar de símbolo: el textarea
            toma la nota nueva y no arrastra el "Guardado" del símbolo anterior. */}
        <SymbolNotes
          key={activeSymbol}
          symbol={activeSymbol}
          note={notes[activeSymbol] ?? ""}
        />
      </div>

      {/* [D] Watchlist + análisis técnico del símbolo activo */}
      <div className="flex min-w-0 flex-col gap-4">
        <WatchlistPanel
          symbols={watchlistSymbols}
          activeSymbol={activeSymbol}
          onSelect={setActiveSymbol}
        />
        {/* Análisis técnico atado al símbolo activo (display-only) */}
        <div className="terminal-panel overflow-hidden">
          <PanelHeader
            label="Análisis técnico"
            hint={<span className="text-foreground">{activeSymbol}</span>}
          />
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
            className="bg-card"
          />
        </div>
      </div>
    </div>
  )
}
