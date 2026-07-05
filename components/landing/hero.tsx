import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketStrip } from "@/components/landing/market-strip"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Halo dorado sutil detrás del titular */}
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute top-[-20%] left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full blur-[120px]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pt-20 pb-16 text-center md:px-6 md:pt-28 md:pb-24">
        {/* Eyebrow */}
        <p className="animate-in fade-in slide-in-from-bottom-2 text-gold border-gold/30 bg-gold/5 rounded-full border px-3 py-1 font-mono text-xs tracking-wide duration-500 motion-reduce:animate-none">
          La plataforma multi-activo para LATAM, España y EE. UU.
        </p>

        {/* Titular */}
        <h1 className="animate-in fade-in slide-in-from-bottom-3 max-w-4xl text-4xl font-bold tracking-tight delay-100 duration-500 motion-reduce:animate-none md:text-6xl">
          Tus mercados, tu portafolio y tu dinero,{" "}
          <span className="text-gold">fiat y cripto</span>,
          <br className="hidden md:block" /> en un solo lugar.
        </h1>

        {/* Subtítulo */}
        <p className="animate-in fade-in slide-in-from-bottom-3 text-muted-foreground max-w-2xl text-base leading-relaxed delay-200 duration-500 motion-reduce:animate-none md:text-lg">
          Visualiza los mercados en tiempo real, sigue todo tu patrimonio en una
          sola vista y convierte entre tu moneda local y el dólar digital a
          través de socios regulados.
        </p>

        {/* CTAs */}
        <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-col items-center gap-3 delay-300 duration-500 motion-reduce:animate-none sm:flex-row">
          <Button asChild size="lg" className="group">
            <Link href="/registro">
              Crear cuenta
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#planes">Conoce los planes</Link>
          </Button>
        </div>

        {/* Micro-copy de baja fricción */}
        <p className="animate-in fade-in text-muted-foreground/80 -mt-1 font-mono text-xs delay-300 duration-500 motion-reduce:animate-none">
          Sin permanencia · Cancelá cuando quieras
        </p>

        <MarketStrip />
      </div>
    </section>
  )
}
