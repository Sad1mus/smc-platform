import { Activity, Lock, DatabaseZap, Languages } from "lucide-react"

import { getDictionary } from "@/lib/i18n/server"

/**
 * "¿Por qué elegirnos?" (playbook §7): 4 pilares de confianza.
 * SOLO señales REALES y verificables, sin sellos de regulador, premios ni
 * certificaciones inventadas. Copy i18n.
 */
const ICONS = [Activity, Lock, DatabaseZap, Languages] as const

export async function WhyUs() {
  const { t } = await getDictionary()

  return (
    <section aria-label={t.whyUs.heading} className="border-border/60 border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t.whyUs.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4">
          {t.whyUs.pillars.map((pillar, i) => {
            const Icon = ICONS[i] ?? Activity
            return (
              <article
                key={pillar.title}
                className="bg-card flex flex-col gap-3 p-6"
              >
                <Icon aria-hidden="true" className="text-gold size-5" />
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
