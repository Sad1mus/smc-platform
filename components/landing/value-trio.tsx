import { Zap, LayoutGrid, ShieldCheck } from "lucide-react"

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
    <section aria-label={t.whyUs.heading} className="border-border/60 border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
          {t.valueTrio.items.map((item, i) => {
            const Icon = ICONS[i] ?? Zap
            return (
              <article
                key={item.title}
                className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
              >
                <Icon
                  aria-hidden="true"
                  className="text-gold size-5 transition-transform duration-200 ease-out group-hover:scale-110"
                />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
