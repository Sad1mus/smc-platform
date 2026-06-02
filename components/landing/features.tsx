import { CandlestickChart, Globe2, ShieldCheck } from "lucide-react"

const FEATURES = [
  {
    icon: CandlestickChart,
    title: "Gráficos profesionales",
    description:
      "Velas, indicadores técnicos e intervalos desde 1 minuto hasta 1 mes, con la precisión de TradingView.",
  },
  {
    icon: Globe2,
    title: "Todos los mercados",
    description:
      "Acciones, divisas, índices, materias primas y criptomonedas de América y Europa en una sola vista.",
  },
  {
    icon: ShieldCheck,
    title: "Tu cuenta, protegida",
    description:
      "Sesiones cifradas, pagos procesados por Stripe y datos personales bajo políticas de acceso estrictas.",
  },
] as const

export function Features() {
  return (
    <section
      id="caracteristicas"
      className="border-border/60 border-t scroll-mt-14"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Una sala de mercados en tu navegador
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            La plataforma muestra los datos tal como se mueven. Sin retrasos,
            sin capturas estáticas, sin hojas de cálculo.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
            >
              <feature.icon
                aria-hidden="true"
                className="text-gold size-5 transition-transform duration-200 ease-out group-hover:scale-110"
              />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
