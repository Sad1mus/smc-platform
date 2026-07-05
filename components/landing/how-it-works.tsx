import { UserPlus, CreditCard, LineChart } from "lucide-react"

import { getDictionary } from "@/lib/i18n/server"

/**
 * Cómo funciona (spec §Landing): 3 pasos que el usuario recorre en orden.
 * La numeración es real (secuencia). Concepto introducing broker. Copy i18n.
 */
const ICONS = [UserPlus, CreditCard, LineChart] as const

export async function HowItWorks() {
  const { t } = await getDictionary()

  return (
    <section
      id="como-funciona"
      className="border-border/60 scroll-mt-14 border-t"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t.howItWorks.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
          {t.howItWorks.steps.map((step, index) => {
            const Icon = ICONS[index] ?? UserPlus
            return (
              <li
                key={step.title}
                className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gold font-mono text-sm font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon aria-hidden="true" className="text-gold size-5" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
