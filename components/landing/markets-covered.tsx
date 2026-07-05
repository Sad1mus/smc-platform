import {
  TrendingUp,
  Bitcoin,
  DollarSign,
  BarChart3,
  Gem,
  Layers,
} from "lucide-react"

import { getDictionary } from "@/lib/i18n/server"

/**
 * Mercados cubiertos (spec §Landing): las 6 clases de activos del brief con
 * símbolos de ejemplo reales (formato TradingView). Nombres/descripciones i18n;
 * símbolos e íconos son estructura, no copy.
 */
const CATEGORIES = [
  {
    id: "indices",
    icon: BarChart3,
    symbols: ["SP:SPX", "NASDAQ:NDX", "DJ:DJI"],
  },
  {
    id: "forex",
    icon: DollarSign,
    symbols: ["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY"],
  },
  {
    id: "shares",
    icon: TrendingUp,
    symbols: ["NASDAQ:AAPL", "NASDAQ:TSLA", "NASDAQ:NVDA"],
  },
  {
    id: "commodities",
    icon: Gem,
    symbols: ["TVC:GOLD", "TVC:USOIL", "TVC:SILVER"],
  },
  { id: "etfs", icon: Layers, symbols: ["AMEX:SPY", "NASDAQ:QQQ", "AMEX:VTI"] },
  {
    id: "crypto",
    icon: Bitcoin,
    symbols: ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT"],
  },
] as const

export async function MarketsCovered() {
  const { t } = await getDictionary()

  return (
    <section id="mercados" className="border-border/60 scroll-mt-14 border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t.markets.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.markets.subtitle}
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const copy = t.markets.items[category.id]
            return (
              <article
                key={category.id}
                className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
              >
                <category.icon
                  aria-hidden="true"
                  className="text-gold size-5 transition-transform duration-200 ease-out group-hover:scale-110"
                />
                <h3 className="font-semibold">{copy.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {copy.description}
                </p>
                <ul className="border-border/60 mt-1 flex flex-col gap-1 border-t pt-3 font-mono text-xs">
                  {category.symbols.map((symbol) => (
                    <li key={symbol} className="text-muted-foreground/80">
                      {symbol}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
