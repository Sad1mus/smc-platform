/**
 * Franja de cotizaciones ilustrativa del hero.
 * Valores estáticos de ejemplo (no son datos en vivo): la landing es
 * pública y los datos reales viven en el dashboard.
 */
const SAMPLE_QUOTES = [
  { symbol: "EUR/USD", price: "1.0842", change: "+0.12%", up: true },
  { symbol: "BTC/USD", price: "67,431", change: "+2.41%", up: true },
  { symbol: "AAPL", price: "227.85", change: "-0.34%", up: false },
  { symbol: "XAU/USD", price: "2,651.20", change: "+0.87%", up: true },
  { symbol: "SPX", price: "5,982.41", change: "+0.55%", up: true },
  { symbol: "ETH/USD", price: "3,512.04", change: "-1.02%", up: false },
] as const

export function MarketStrip() {
  return (
    <div
      aria-label="Ejemplo de cotizaciones de mercado"
      className="animate-in fade-in border-border/60 bg-card/60 mt-6 w-full overflow-hidden rounded-xl border backdrop-blur-sm delay-500 duration-700 motion-reduce:animate-none"
    >
      <ul className="divide-border/60 grid grid-cols-2 divide-y font-mono text-sm sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-6">
        {SAMPLE_QUOTES.map((quote) => (
          <li
            key={quote.symbol}
            className="flex flex-col gap-1 px-4 py-3 text-left"
          >
            <span className="text-muted-foreground text-xs tracking-wide">
              {quote.symbol}
            </span>
            <span className="tabular text-foreground">{quote.price}</span>
            <span
              className={`tabular text-xs ${quote.up ? "text-market-up" : "text-market-down"}`}
            >
              {quote.change}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground/70 border-border/60 border-t px-4 py-2 text-left font-mono text-[11px]">
        Valores ilustrativos. Los datos en tiempo real están disponibles en la
        plataforma.
      </p>
    </div>
  )
}
