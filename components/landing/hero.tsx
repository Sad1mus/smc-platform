import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HeroChart } from "@/components/landing/hero-chart"
import { Parallax } from "@/components/motion/parallax"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Hero — rediseño "glass / futurista fluido" (referencia: fintechx).
 * Fondo atmosférico con aurora que deriva, panel de vidrio esmerilado con el
 * gráfico REAL en vivo flotando, tipografía display (Bricolage), CTA glossy.
 * Copy del diccionario (congelada). El producto (dashboard) sigue dark.
 */
export async function Hero() {
  const { t } = await getDictionary()
  return (
    <section className="relative overflow-hidden">
      {/* Fondo atmosférico: degradé cielo -> papel + aurora en capas (fluido) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-b from-[#D8E8FF] via-[#E7F0FE] to-[#EEF3FC]"
      />
      <Parallax
        speed={80}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="hero-aurora-a absolute -top-40 -left-24 h-[560px] w-[720px] rounded-full bg-[#3E72F7]/25 blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="hero-aurora-b absolute -top-24 right-[-10%] h-[520px] w-[620px] rounded-full bg-[#8FB6FF]/30 blur-[150px]"
        />
      </Parallax>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-24 pb-20 md:px-6 md:pt-28 lg:grid-cols-[1fr_1.08fr] lg:gap-14 lg:pt-32 lg:pb-28">
        {/* Izquierda — texto */}
        <div className="max-w-xl">
          <p className="animate-in fade-in slide-in-from-bottom-2 inline-flex items-center rounded-full border border-white/60 bg-white/40 px-3 py-1 font-mono text-[11px] tracking-[0.18em] text-[#2E4C8E] uppercase backdrop-blur duration-700 ease-out motion-reduce:animate-none">
            {t.hero.eyebrow}
          </p>

          <h1
            className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 mt-6 text-5xl leading-[1.0] font-bold tracking-tight text-[#141824] delay-100 duration-700 ease-out motion-reduce:animate-none md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.hero.titleLead}{" "}
            <span className="bg-gradient-to-br from-[#3E72F7] to-[#1E3F9E] bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
            {t.hero.titleTail ? <> {t.hero.titleTail}</> : null}
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-4 mt-7 max-w-lg text-base leading-relaxed text-[#3F455A] delay-200 duration-700 ease-out motion-reduce:animate-none md:text-lg">
            {t.hero.subtitle}
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-4 mt-9 flex flex-col gap-3 delay-300 duration-700 ease-out motion-reduce:animate-none sm:flex-row">
            <Link
              href="/registro"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#3E72F7] to-[#2350E8] px-6 text-sm font-medium text-white shadow-[0_12px_30px_-8px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-200 ease-out hover:from-[#3568F0] hover:to-[#1E48D8] active:translate-y-px"
            >
              {t.cta.openAccount}
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#planes"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/70 bg-white/50 px-6 text-sm font-medium text-[#141824] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur transition-colors duration-200 hover:bg-white/75 active:translate-y-px"
            >
              {t.cta.viewPlans}
            </Link>
          </div>

          <p className="animate-in fade-in mt-5 font-mono text-xs text-[#5B6072] delay-500 duration-700 ease-out motion-reduce:animate-none">
            {t.hero.microcopy}
          </p>
        </div>

        {/* Derecha — gráfico REAL en vivo en panel de vidrio flotante */}
        <Parallax
          speed={-28}
          className="animate-in fade-in zoom-in-95 slide-in-from-bottom-6 delay-200 duration-1000 ease-out motion-reduce:animate-none"
        >
          <figure className="relative overflow-hidden rounded-[22px] border border-white/60 bg-white/40 shadow-[0_40px_90px_-35px_rgba(28,52,120,0.5)] backdrop-blur-2xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
            />
            <figcaption className="relative flex items-center justify-between border-b border-white/40 px-4 py-2.5">
              <span className="font-mono text-[11px] tracking-[0.18em] text-[#3F455A] uppercase">
                Mercados en vivo
              </span>
              <a
                href="https://www.tradingview.com/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-1.5 font-mono text-[10px] text-[#2E4C8E] hover:underline"
              >
                <span
                  className="size-1.5 rounded-full bg-[#22B07A]"
                  aria-hidden="true"
                />
                by TradingView
              </a>
            </figcaption>
            <div className="relative h-[360px] bg-white/75 md:h-[440px]">
              <HeroChart />
            </div>
          </figure>
        </Parallax>
      </div>
    </section>
  )
}
