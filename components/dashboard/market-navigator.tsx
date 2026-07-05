"use client"

import { useMemo, useState } from "react"
import {
  Search,
  TrendingUp,
  Bitcoin,
  DollarSign,
  BarChart3,
  Gem,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Navegador de mercados (spec §Terminal display [B]): buscador instantáneo +
 * categorías de mercado con símbolos de ejemplo. Al elegir un símbolo, actualiza
 * el gráfico central. Es navegación/visualización — no expone acciones de operación.
 */
const CATEGORIES = [
  {
    icon: DollarSign,
    name: "Forex",
    symbols: ["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY"],
  },
  {
    icon: BarChart3,
    name: "Índices",
    symbols: ["SP:SPX", "NASDAQ:NDX", "DJ:DJI"],
  },
  {
    icon: Gem,
    name: "Materias primas",
    symbols: ["TVC:GOLD", "TVC:USOIL", "TVC:SILVER"],
  },
  {
    icon: TrendingUp,
    name: "Acciones",
    symbols: ["NASDAQ:AAPL", "NASDAQ:TSLA", "NASDAQ:NVDA"],
  },
  {
    icon: Bitcoin,
    name: "Cripto",
    symbols: ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT"],
  },
] as const

type MarketNavigatorProps = {
  activeSymbol: string
  onSelect: (symbol: string) => void
}

export function MarketNavigator({
  activeSymbol,
  onSelect,
}: MarketNavigatorProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase()
    if (!q) return CATEGORIES
    return CATEGORIES.map((cat) => ({
      ...cat,
      symbols: cat.symbols.filter((s) => s.includes(q)),
    })).filter((cat) => cat.symbols.length > 0)
  }, [query])

  return (
    <div className="border-border/60 bg-card/40 flex flex-col gap-3 rounded-xl border p-3">
      <label className="relative block">
        <Search
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar símbolo…"
          aria-label="Buscar mercado por símbolo"
          className="border-border/60 bg-background/60 focus:ring-gold/40 w-full rounded-md border py-1.5 pr-2 pl-8 font-mono text-xs outline-none focus:ring-2"
        />
      </label>

      <nav aria-label="Categorías de mercado" className="flex flex-col gap-3">
        {filtered.map((cat) => (
          <div key={cat.name}>
            <div className="text-muted-foreground mb-1 flex items-center gap-1.5 px-1 text-[11px] font-medium tracking-wide uppercase">
              <cat.icon aria-hidden="true" className="text-gold size-3" />
              {cat.name}
            </div>
            <ul className="flex flex-col">
              {cat.symbols.map((symbol) => (
                <li key={symbol}>
                  <button
                    type="button"
                    onClick={() => onSelect(symbol)}
                    aria-pressed={activeSymbol === symbol}
                    className={cn(
                      "hover:bg-secondary/60 w-full rounded px-2 py-1.5 text-left font-mono text-xs transition-colors",
                      activeSymbol === symbol
                        ? "bg-secondary text-foreground font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {symbol}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground px-1 text-xs">Sin resultados.</p>
        ) : null}
      </nav>
    </div>
  )
}
