/**
 * Franja de números (spec §Landing #2): solo afirmaciones VERIFICABLES.
 * Nada de métricas de vanidad ni usuarios inventados.
 */
const STATS = [
  {
    value: "4",
    label: "clases de activos",
    detail: "acciones · cripto · forex · índices",
  },
  {
    value: "Tiempo real",
    label: "datos de mercado",
    detail: "vía TradingView",
  },
  { value: "24/7", label: "mercado cripto", detail: "cotización continua" },
  {
    value: "ES",
    label: "español primero",
    detail: "hecho para LATAM y España",
  },
] as const

export function StatsStrip() {
  return (
    <section
      aria-label="La plataforma en números"
      className="border-border/60 border-t"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-10 md:grid-cols-4 md:px-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 p-4 text-center">
            <span className="text-gold font-mono text-2xl font-bold tracking-tight md:text-3xl">
              {stat.value}
            </span>
            <span className="text-sm font-medium">{stat.label}</span>
            <span className="text-muted-foreground font-mono text-xs">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
