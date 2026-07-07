import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RevealCascade } from "@/components/motion/reveal-cascade"
import { getDictionary } from "@/lib/i18n/server"
import type { PageDetail } from "@/lib/i18n/dictionaries"

/**
 * Página de contexto (docs/specs/landing-pages.md): da profundidad a una sección
 * del home sin reemplazarla. Estructura: hero editorial → la sección de la landing
 * reutilizada como resumen visual (`children`) → bloques de contexto → CTA.
 *
 * El CTA reutiliza las etiquetas globales (`cta.openAccount` / `cta.viewPlans`) y
 * respeta el guardarraíl regulatorio: registro y planes, nunca ejecución/custodia.
 */
export async function ContextPage({
  content,
  children,
}: {
  content: PageDetail
  children: ReactNode
}) {
  const { t } = await getDictionary()

  return (
    <div className="landing-editorial">
      {/* Hero de la página */}
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:pt-24 md:px-6">
        <p className="text-gold font-mono text-xs tracking-[0.2em] uppercase">
          {content.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {content.heading}
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl leading-relaxed">
          {content.subtitle}
        </p>
      </section>

      {/* Resumen visual: la misma sección del home, reutilizada */}
      {children}

      {/* Bloques de contexto */}
      <section
        aria-label={content.heading}
        className="border-border/60 border-t border-dashed"
      >
        <RevealCascade className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16 md:px-6 md:py-20">
          {content.blocks.map((block) => (
            <article key={block.heading} className="glass-card w-full p-7">
              <h2 className="text-xl font-semibold tracking-tight">
                {block.heading}
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {block.body}
              </p>
            </article>
          ))}
        </RevealCascade>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-20">
        <h2 className="text-h2 font-bold tracking-tight">
          {content.ctaHeading}
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-lg leading-relaxed">
          {content.ctaBody}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="group">
            <Link href="/registro">
              {t.cta.openAccount}
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/precios">{t.cta.viewPlans}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
