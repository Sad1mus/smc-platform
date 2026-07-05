import { getDictionary } from "@/lib/i18n/server"

/**
 * Franja de números (spec §Landing): solo afirmaciones VERIFICABLES.
 * Nada de métricas de vanidad ni usuarios inventados.
 */
export async function StatsStrip() {
  const { t } = await getDictionary()

  return (
    <section
      aria-label={t.howItWorks.heading}
      className="border-border/60 border-t"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-10 md:grid-cols-4 md:px-6">
        {t.stats.items.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 p-4 text-center">
            <span className="text-gold font-mono text-2xl font-bold tracking-tight md:text-3xl">
              {stat.value}
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
