import { Activity, Lock, DatabaseZap, Languages } from "lucide-react"

import { RevealCascade } from "@/components/motion/reveal-cascade"
import { SectionMore } from "@/components/landing/section-more"
import { getDictionary } from "@/lib/i18n/server"

/**
 * "¿Por qué elegirnos?" (playbook §7): 4 pilares de confianza.
 * SOLO señales REALES y verificables, sin sellos de regulador, premios ni
 * certificaciones inventadas. Copy i18n.
 */
const ICONS = [Activity, Lock, DatabaseZap, Languages] as const

export async function WhyUs({ moreHref }: { moreHref?: string } = {}) {
  const { t } = await getDictionary()

  return (
    <section aria-label={t.whyUs.heading}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold tracking-tight">
            {t.whyUs.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>
        <RevealCascade className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.whyUs.pillars.map((pillar, i) => {
            const Icon = ICONS[i] ?? Activity
            return (
              <article
                key={pillar.title}
                className="glass-card group flex w-full flex-col gap-3 p-7"
              >
                <span className="mb-1 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <Icon
                    aria-hidden="true"
                    className="size-5 text-white transition-transform duration-200 ease-out group-hover:scale-110"
                  />
                </span>
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </article>
            )
          })}
        </RevealCascade>
        {moreHref ? <SectionMore href={moreHref} /> : null}
      </div>
    </section>
  )
}
