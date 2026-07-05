import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LazyMount } from "@/components/dashboard/lazy-mount"
import { TvWidget } from "@/components/dashboard/tv-widget"

/**
 * Sección plataforma / tecnología (playbook §6): dos columnas, un embed REAL de
 * TradingView (display-only, montado lazy para no degradar el LCP) + lista de
 * features con checks + CTA contextual. La ejecución es de los socios regulados.
 */
const FEATURES = [
  "Gráficos TradingView en tiempo real",
  "Watchlist personalizable con tus símbolos",
  "Heatmap, calendario económico y screener",
  "Tema claro y oscuro",
] as const

/** Símbolos de muestra del mini-overview (display-only). */
const OVERVIEW_SYMBOLS = [
  ["Bitcoin", "BINANCE:BTCUSDT|3M"],
  ["Apple", "NASDAQ:AAPL|3M"],
  ["EUR/USD", "FX:EURUSD|3M"],
]

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
            en una sola pantalla. Analizás, decidís y operás a través de socios
            regulados.
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
          {/* Embed REAL de TradingView, montado solo al entrar en viewport */}
          <LazyMount
            height={360}
            className="border-border/60 bg-card/60 overflow-hidden rounded-xl border shadow-xl"
          >
            <TvWidget
              widget="symbol-overview"
              height={360}
              title="Resumen de mercados por TradingView"
              config={{
                symbols: OVERVIEW_SYMBOLS,
                chartOnly: false,
                showVolume: false,
                isTransparent: true,
                scalePosition: "right",
                fontSize: "10",
              }}
            />
          </LazyMount>
          <p className="text-muted-foreground/60 mt-2 text-center font-mono text-[10px]">
            Datos en vivo por TradingView.
          </p>
        </div>
      </div>
    </section>
  )
}
