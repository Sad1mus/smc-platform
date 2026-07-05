import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Sección plataforma / tecnología (playbook §6): dos columnas,
 * mockup del terminal (ilustrativo, dibujado en CSS/SVG, no datos en vivo) +
 * lista de features con checks + CTA contextual. Todo display/análisis.
 */
const FEATURES = [
  "Gráficos TradingView en tiempo real",
  "Watchlist personalizable con tus símbolos",
  "Heatmap, calendario económico y screener",
  "Tema claro y oscuro",
] as const

/** Mockup estilizado del terminal (ilustrativo, no es una captura en vivo). */
function TerminalMock() {
  return (
    <div className="border-border/60 bg-card/60 overflow-hidden rounded-xl border shadow-xl">
      {/* Barra superior del mock */}
      <div className="border-border/60 flex items-center gap-2 border-b px-3 py-2">
        <span className="bg-market-down/70 size-2.5 rounded-full" />
        <span className="size-2.5 rounded-full bg-yellow-500/70" />
        <span className="bg-market-up/70 size-2.5 rounded-full" />
        <span className="text-muted-foreground ml-3 font-mono text-[11px]">
          SMC · Mercados
        </span>
      </div>
      <div className="grid grid-cols-[1fr_128px] gap-px">
        {/* Panel gráfico */}
        <div className="bg-background/40 p-3">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px]">
            <span className="text-foreground">FX:EURUSD</span>
            <span className="text-market-up">+0.12%</span>
            <span className="text-muted-foreground ml-auto">1D</span>
          </div>
          {/* Línea "de mercado" dibujada en SVG (ilustrativa) */}
          <svg
            viewBox="0 0 240 96"
            className="h-24 w-full"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,70 30,60 55,66 80,44 110,52 140,30 170,38 200,20 240,26"
              fill="none"
              stroke="var(--color-gold, #b8860b)"
              strokeWidth="1.5"
            />
            <polyline
              points="0,96 0,70 30,60 55,66 80,44 110,52 140,30 170,38 200,20 240,26 240,96"
              fill="var(--color-gold, #b8860b)"
              opacity="0.08"
              stroke="none"
            />
          </svg>
          <div className="text-muted-foreground/70 mt-2 flex gap-3 font-mono text-[9px]">
            <span>1m</span>
            <span>5m</span>
            <span>1h</span>
            <span className="text-gold">1D</span>
            <span>1S</span>
          </div>
        </div>
        {/* Watchlist */}
        <div className="bg-background/40 flex flex-col gap-2 p-3">
          <span className="text-muted-foreground font-mono text-[9px]">
            Mi lista
          </span>
          {[
            ["AAPL", "+0.9%", true],
            ["BTC", "+2.4%", true],
            ["EURUSD", "-0.1%", false],
            ["SPX", "+0.5%", true],
          ].map(([sym, chg, up]) => (
            <div
              key={sym as string}
              className="flex items-center justify-between font-mono text-[9px]"
            >
              <span className="text-foreground/80">{sym}</span>
              <span className={up ? "text-market-up" : "text-market-down"}>
                {chg}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PlatformSection() {
  return (
    <section id="plataforma" className="border-border/60 scroll-mt-14 border-t">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Una sala de mercados, en tu navegador
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Gráficos profesionales, tu watchlist y los paneles de mercado, todo
            en una sola pantalla. Visualizás y analizás; nada más.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <Check
                  aria-hidden="true"
                  className="text-gold mt-0.5 size-4 shrink-0"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="group mt-8">
            <Link href="/registro">
              Explorá la plataforma
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
        <div className="order-first md:order-last">
          <TerminalMock />
          <p className="text-muted-foreground/60 mt-2 text-center font-mono text-[10px]">
            Vista ilustrativa. Los datos en tiempo real están dentro de la
            plataforma.
          </p>
        </div>
      </div>
    </section>
  )
}
