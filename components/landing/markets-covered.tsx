import {
  TrendingUp,
  Bitcoin,
  DollarSign,
  BarChart3,
  Gem,
  Layers,
} from "lucide-react"

import { RevealCascade } from "@/components/motion/reveal-cascade"
import { SectionMore } from "@/components/landing/section-more"
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

export async function MarketsCovered({ moreHref }: { moreHref?: string } = {}) {
  const { t } = await getDictionary()

  return (
    <section
      id="mercados"
      className="border-border/60 scroll-mt-14 border-t border-dashed"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold tracking-tight">
            {t.markets.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.markets.subtitle}
          </p>
        </div>
        <RevealCascade className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const copy = t.markets.items[category.id]
            return (
              <article
                key={category.id}
                className="glass-card group flex w-full flex-col gap-3 p-7"
              >
                <span className="mb-1 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <category.icon
                    aria-hidden="true"
                    className="size-5 text-white transition-transform duration-200 ease-out group-hover:scale-110"
                  />
                </span>
                <h3 className="font-semibold">{copy.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {copy.description}
                </p>
                <ul className="mt-1 flex flex-col gap-1 border-t border-[rgba(30,55,120,0.12)] pt-3 font-mono text-xs">
                  {category.symbols.map((symbol) => (
                    <li key={symbol} className="text-muted-foreground/80">
                      {symbol}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </RevealCascade>
        {moreHref ? <SectionMore href={moreHref} /> : null}
      </div>
    </section>
  )
}
