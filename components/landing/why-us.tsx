import { Activity, Lock, DatabaseZap, Languages } from "lucide-react"

/**
 * "¿Por qué elegirnos?" (playbook §7): 4 pilares de confianza.
 * SOLO señales REALES y verificables, sin sellos de regulador, premios ni
 * certificaciones inventadas (regla de honestidad del propio playbook).
 */
const PILLARS = [
  {
    icon: Activity,
    title: "Datos en tiempo real",
    description: "Cotizaciones y gráficos en vivo provistos por TradingView.",
  },
  {
    icon: Lock,
    title: "Pagos cifrados",
    description: "Cobros procesados por Stripe; SMC no almacena tu tarjeta.",
  },
  {
    icon: DatabaseZap,
    title: "Tus datos, protegidos",
    description:
      "Acceso por roles y aislamiento por usuario a nivel base de datos (RLS).",
  },
  {
    icon: Languages,
    title: "Español primero",
    description: "Producto pensado para LATAM y España, en tu idioma.",
  },
] as const

export function WhyUs() {
  return (
    <section
      aria-label="Por qué elegirnos"
      className="border-border/60 border-t"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Sin promesas vacías: solo lo que la plataforma realmente hace.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="bg-card flex flex-col gap-3 p-6"
            >
              <pillar.icon aria-hidden="true" className="text-gold size-5" />
              <h3 className="font-semibold">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
