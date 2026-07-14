"use client"

import { useMemo, useState } from "react"
import {
  Search,
  TrendingUp,
  Bitcoin,
  DollarSign,
  BarChart3,
  Gem,
  Layers,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { searchCatalog, type MarketCategoryId } from "@/lib/markets/catalog"

/**
 * Navegador de mercados (spec §Terminal display [B]): buscador instantáneo +
 * categorías de mercado. Al elegir un símbolo, actualiza el gráfico central.
 * Es navegación/visualización — no expone acciones de operación.
 *
 * Los símbolos viven en `lib/markets/catalog.ts` (módulo puro, testeado). El
 * buscador matchea símbolo Y nombre legible: antes solo filtraba el ticker crudo,
 * así que había que saber `TVC:GOLD` de memoria para encontrar el oro.
 */
const CATEGORY_ICONS: Record<MarketCategoryId, LucideIcon> = {
  forex: DollarSign,
  indices: BarChart3,
  commodities: Gem,
  stocks: TrendingUp,
  crypto: Bitcoin,
  etf: Layers,
}

type MarketNavigatorProps = {
  activeSymbol: string
  onSelect: (symbol: string) => void
}

export function MarketNavigator({
  activeSymbol,
  onSelect,
}: MarketNavigatorProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => searchCatalog(query), [query])

  return (
    <div className="terminal-panel overflow-hidden">
      <PanelHeader label="Mercados" />
      <div className="flex flex-col gap-3 p-3">
        <label className="relative block">
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: oro, bitcoin, EURUSD…"
            aria-label="Buscar mercado por símbolo o nombre"
            className="border-border/60 bg-background/60 focus:ring-gold/40 w-full rounded-md border py-1.5 pr-2 pl-8 font-mono text-xs outline-none focus:ring-2"
          />
        </label>

        <nav
          aria-label="Categorías de mercado"
          className="flex max-h-[32rem] flex-col gap-3 overflow-y-auto"
        >
          {filtered.map((category) => {
            const Icon = CATEGORY_ICONS[category.id]
            return (
              <div key={category.id}>
                <div className="text-muted-foreground mb-1 flex items-center gap-1.5 px-1 text-[11px] font-medium tracking-wide uppercase">
                  <Icon aria-hidden="true" className="text-gold size-3" />
                  {category.name}
                </div>
                <ul className="flex flex-col">
                  {category.symbols.map((entry) => (
                    <li key={entry.symbol}>
                      <button
                        type="button"
                        onClick={() => onSelect(entry.symbol)}
                        aria-pressed={activeSymbol === entry.symbol}
                        title={`${entry.label} — ${entry.symbol}`}
                        className={cn(
                          "hover:bg-secondary/60 w-full rounded px-2 py-1.5 text-left transition-colors",
                          activeSymbol === entry.symbol
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "block truncate font-mono text-xs",
                            activeSymbol === entry.symbol && "font-semibold"
                          )}
                        >
                          {entry.symbol}
                        </span>
                        <span className="text-muted-foreground/80 block truncate text-[11px]">
                          {entry.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
          {filtered.length === 0 ? (
            <p className="text-muted-foreground px-1 text-xs">
              Sin resultados.
            </p>
          ) : null}
        </nav>
      </div>
    </div>
  )
}
