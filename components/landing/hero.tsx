import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketStrip } from "@/components/landing/market-strip"
import { getDictionary } from "@/lib/i18n/server"

export async function Hero() {
  const { t } = await getDictionary()
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
          {t.hero.eyebrow}
        </p>

        {/* Titular */}
        <h1 className="animate-in fade-in slide-in-from-bottom-4 max-w-4xl text-4xl font-bold tracking-tight delay-100 duration-700 ease-out motion-reduce:animate-none md:text-6xl">
          {t.hero.titleLead}{" "}
          <span className="text-gold">{t.hero.titleAccent}</span>
          {t.hero.titleTail ? (
            <>
              <br className="hidden md:block" /> {t.hero.titleTail}
            </>
          ) : null}
        </h1>

        {/* Subtítulo */}
        <p className="animate-in fade-in slide-in-from-bottom-4 text-muted-foreground max-w-2xl text-base leading-relaxed delay-200 duration-700 ease-out motion-reduce:animate-none md:text-lg">
          {t.hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-3 delay-300 duration-700 ease-out motion-reduce:animate-none sm:flex-row">
          <Button asChild size="lg" className="group">
            <Link href="/registro">
              {t.cta.openAccount}
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#planes">{t.cta.viewPlans}</Link>
          </Button>
        </div>

        {/* Micro-copy de baja fricción */}
        <p className="animate-in fade-in text-muted-foreground/80 -mt-1 font-mono text-xs delay-500 duration-700 ease-out motion-reduce:animate-none">
          {t.hero.microcopy}
        </p>

        <MarketStrip />
      </div>
    </section>
  )
}
