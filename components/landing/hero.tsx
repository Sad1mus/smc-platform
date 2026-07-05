import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketStrip } from "@/components/landing/market-strip"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop en capas: grilla de terminal + aurora dorada */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="hero-grid absolute inset-0" />
        <div className="hero-aurora bg-gold/15 absolute top-[-25%] left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-[130px]" />
        {/* Desvanecido inferior hacia el fondo de la página */}
        <div className="from-background absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pt-20 pb-16 text-center md:px-6 md:pt-28 md:pb-24">
        {/* Eyebrow */}
        <p className="animate-in fade-in slide-in-from-bottom-2 text-gold border-gold/30 bg-gold/5 rounded-full border px-3 py-1 font-mono text-xs tracking-wide duration-700 ease-out motion-reduce:animate-none">
          Trading multi-activo · LATAM, España y EE. UU.
        </p>

        {/* Titular */}
        <h1 className="animate-in fade-in slide-in-from-bottom-4 max-w-4xl text-4xl font-bold tracking-tight delay-100 duration-700 ease-out motion-reduce:animate-none md:text-6xl">
          Operá los mercados del mundo,{" "}
          <span className="text-gold">fiat y cripto</span>,
          <br className="hidden md:block" /> desde un solo lugar.
        </h1>

        {/* Subtítulo */}
        <p className="animate-in fade-in slide-in-from-bottom-4 text-muted-foreground max-w-2xl text-base leading-relaxed delay-200 duration-700 ease-out motion-reduce:animate-none md:text-lg">
          Gráficos en tiempo real, tu portafolio y tus operaciones en una sola
          plataforma. Vos analizás y decidís; la ejecución y el resguardo de tus
          fondos quedan en manos de brokers socios regulados.
        </p>

        {/* CTAs */}
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-3 delay-300 duration-700 ease-out motion-reduce:animate-none sm:flex-row">
          <Button asChild size="lg" className="group">
            <Link href="/registro">
              Abrí tu cuenta
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#planes">Ver los planes</Link>
          </Button>
        </div>

        {/* Micro-copy de baja fricción */}
        <p className="animate-in fade-in text-muted-foreground/80 -mt-1 font-mono text-xs delay-500 duration-700 ease-out motion-reduce:animate-none">
          Sin permanencia · Cancelá cuando quieras
        </p>

        <MarketStrip />
      </div>
    </section>
  )
}
