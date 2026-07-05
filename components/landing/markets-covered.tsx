import { TrendingUp, Bitcoin, DollarSign, BarChart3 } from "lucide-react"

/**
 * Mercados cubiertos (spec §Landing #4): 4 categorías con símbolos de ejemplo
 * reales. Lista estática (no datos en vivo): la landing es pública y los datos
 * en tiempo real viven en el dashboard. Símbolos en formato TradingView.
 */
const CATEGORIES = [
  {
    icon: TrendingUp,
    name: "Acciones",
    description: "Las mayores compañías del mundo, en tiempo real.",
    symbols: ["NASDAQ:AAPL", "NASDAQ:TSLA", "NASDAQ:NVDA"],
  },
  {
    icon: Bitcoin,
    name: "Cripto",
    description: "El mercado que cotiza 24/7, sin cierre.",
    symbols: ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT"],
  },
  {
    icon: DollarSign,
    name: "Forex",
    description: "Los pares de divisas más negociados.",
    symbols: ["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY"],
  },
  {
    icon: BarChart3,
    name: "Índices",
    description: "El pulso agregado de cada mercado.",
    symbols: ["SP:SPX", "NASDAQ:NDX", "DJ:DJI"],
  },
] as const

export function MarketsCovered() {
  return (
    <section id="mercados" className="border-border/60 scroll-mt-14 border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Mercados cubiertos
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Cuatro clases de activos, una sola pantalla. Visualizás y analizás;
            el análisis siempre es tuyo.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <article
              key={category.name}
              className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
            >
              <category.icon
                aria-hidden="true"
                className="text-gold size-5 transition-transform duration-200 ease-out group-hover:scale-110"
              />
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {category.description}
              </p>
              <ul className="border-border/60 mt-1 flex flex-col gap-1 border-t pt-3 font-mono text-xs">
                {category.symbols.map((symbol) => (
                  <li key={symbol} className="text-muted-foreground/80">
                    {symbol}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
