import { UserPlus, CreditCard, LineChart } from "lucide-react"

/**
 * Cómo funciona (spec §Landing #3): 3 pasos, verbos de visualización/análisis.
 * La numeración es real: es una secuencia que el usuario recorre en orden.
 */
const STEPS = [
  {
    icon: UserPlus,
    title: "Creá tu cuenta",
    description:
      "Registro con tu correo en menos de un minuto. Confirmás desde tu bandeja y ya estás adentro.",
  },
  {
    icon: CreditCard,
    title: "Elegí tu plan",
    description:
      "Bronce, Plata o VIP — o empezá con el plan Prueba. Pago seguro procesado por Stripe.",
  },
  {
    icon: LineChart,
    title: "Analizá los mercados",
    description:
      "Gráficos en tiempo real, heatmap, calendario económico y tu watchlist. Todo en un solo panel.",
  },
] as const

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-border/60 scroll-mt-14 border-t"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            De cero a tu panel de mercados en tres pasos.
          </p>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-gold font-mono text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <step.icon aria-hidden="true" className="text-gold size-5" />
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
