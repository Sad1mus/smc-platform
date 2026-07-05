import { TrendingDown, TrendingUp } from "lucide-react"

/**
 * Ticker de cotizaciones ilustrativo del hero.
 * Valores estáticos de ejemplo (no son datos en vivo): la landing es
 * pública y los datos reales viven en el dashboard. El movimiento es
 * puramente estético (marquee CSS); se detiene con `reduced-motion`.
 */
const SAMPLE_QUOTES = [
  { symbol: "EUR/USD", price: "1.0842", change: "+0.12%", up: true },
  { symbol: "BTC/USD", price: "67,431", change: "+2.41%", up: true },
  { symbol: "AAPL", price: "227.85", change: "-0.34%", up: false },
  { symbol: "XAU/USD", price: "2,651.20", change: "+0.87%", up: true },
  { symbol: "SPX", price: "5,982.41", change: "+0.55%", up: true },
  { symbol: "ETH/USD", price: "3,512.04", change: "-1.02%", up: false },
  { symbol: "USD/JPY", price: "156.28", change: "+0.19%", up: true },
  { symbol: "TSLA", price: "412.60", change: "+1.74%", up: true },
  { symbol: "GBP/USD", price: "1.2691", change: "-0.08%", up: false },
  { symbol: "SOL/USD", price: "198.44", change: "+3.11%", up: true },
] as const

function TickerItem({ quote }: { quote: (typeof SAMPLE_QUOTES)[number] }) {
  const Arrow = quote.up ? TrendingUp : TrendingDown
  return (
    <li className="flex shrink-0 items-center gap-2.5 px-5 font-mono text-sm">
      <span className="text-muted-foreground text-xs tracking-wide">
        {quote.symbol}
      </span>
      <span className="tabular text-foreground">{quote.price}</span>
      <span
        className={`tabular inline-flex items-center gap-1 text-xs ${
          quote.up ? "text-market-up" : "text-market-down"
        }`}
      >
        <Arrow className="size-3" aria-hidden="true" />
        {quote.change}
      </span>
      <span aria-hidden="true" className="text-border ml-2">
        |
      </span>
    </li>
  )
}

export function MarketStrip() {
  return (
    <div
      aria-label="Cotizaciones de mercado ilustrativas"
      className="animate-in fade-in ticker-band relative mt-10 w-full delay-500 duration-700 motion-reduce:animate-none"
    >
      <div className="border-border/60 bg-card/40 overflow-hidden rounded-xl border backdrop-blur-sm">
        {/* Etiqueta de estado, estilo terminal */}
        <div className="border-border/60 bg-background/40 flex items-center gap-2 border-b px-4 py-1.5">
          <span className="bg-market-up relative flex size-1.5 rounded-full">
            <span className="bg-market-up absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden" />
          </span>
          <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
            Mercados · vista ilustrativa
          </span>
        </div>

        {/* Pista duplicada para el loop continuo */}
        <div className="ticker-mask overflow-hidden py-3">
          <ul className="ticker-track flex w-max items-center">
            {[...SAMPLE_QUOTES, ...SAMPLE_QUOTES].map((quote, i) => (
              <TickerItem key={`${quote.symbol}-${i}`} quote={quote} />
            ))}
          </ul>
        </div>
      </div>
      <p className="text-muted-foreground/60 mt-2 text-center font-mono text-[11px]">
        Valores ilustrativos. Los datos en tiempo real están en la plataforma.
      </p>
    </div>
  )
}
