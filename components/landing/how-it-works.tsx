import { UserPlus, CreditCard, LineChart } from "lucide-react"

import { RevealCascade } from "@/components/motion/reveal-cascade"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Cómo funciona (spec §Landing): 3 pasos que el usuario recorre en orden.
 * La numeración es real (secuencia). Concepto introducing broker. Copy i18n.
 */
const ICONS = [UserPlus, CreditCard, LineChart] as const

export async function HowItWorks() {
  const { t } = await getDictionary()

  return (
    <section id="como-funciona" className="scroll-mt-14">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold tracking-tight">
            {t.howItWorks.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>
        <RevealCascade className="mt-12 grid gap-5 md:grid-cols-3">
          {t.howItWorks.steps.map((step, index) => {
            const Icon = ICONS[index] ?? UserPlus
            return (
              <article
                key={step.title}
                className="glass-card group flex w-full flex-col gap-3 p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
                    <Icon
                      aria-hidden="true"
                      className="size-5 text-white transition-transform duration-200 ease-out group-hover:scale-110"
                    />
                  </span>
                  <span className="text-gold font-mono text-lg font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </article>
            )
          })}
        </RevealCascade>
      </div>
    </section>
  )
}
