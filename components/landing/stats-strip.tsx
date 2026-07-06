import { AnimatedNumber } from "@/components/motion/animated-number"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Franja de números (spec §Landing): solo afirmaciones VERIFICABLES.
 * Nada de métricas de vanidad ni usuarios inventados.
 */
export async function StatsStrip() {
  const { t } = await getDictionary()

  return (
    <section aria-label={t.howItWorks.heading} className="px-4 md:px-6">
      <div className="glass-card mx-auto grid max-w-6xl grid-cols-2 overflow-hidden py-8 md:grid-cols-4">
        {t.stats.items.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 border-l border-[rgba(30,55,120,0.1)] p-4 text-center [&:nth-child(2n+1)]:border-l-0 md:[&:nth-child(2n+1)]:border-l md:[&:nth-child(4n+1)]:border-l-0"
          >
            <AnimatedNumber
              value={stat.value}
              className="text-gold font-mono text-2xl font-bold tracking-tight tabular-nums md:text-3xl"
            />
            <span className="text-muted-foreground text-sm font-medium">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
