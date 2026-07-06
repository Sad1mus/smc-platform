import { Zap, LayoutGrid, ShieldCheck } from "lucide-react"

import { RevealCascade } from "@/components/motion/reveal-cascade"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Trío de valor (playbook §4): exactamente 3 tarjetas, regla de tres.
 * Concepto introducing broker: la ejecución se atribuye a socios regulados.
 * Copy desde el diccionario (i18n).
 */
const ICONS = [Zap, LayoutGrid, ShieldCheck] as const

export async function ValueTrio() {
  const { t } = await getDictionary()

  return (
    <section
      aria-label={t.whyUs.heading}
      className="border-border/60 border-t border-dashed"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <RevealCascade className="grid gap-5 md:grid-cols-3">
          {t.valueTrio.items.map((item, i) => {
            const Icon = ICONS[i] ?? Zap
            return (
              <article
                key={item.title}
                className="glass-card group flex w-full flex-col gap-3 p-7"
              >
                <span className="mb-1 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <Icon
                    aria-hidden="true"
                    className="size-5 text-white transition-transform duration-200 ease-out group-hover:scale-110"
                  />
                </span>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </article>
            )
          })}
        </RevealCascade>
      </div>
    </section>
  )
}
