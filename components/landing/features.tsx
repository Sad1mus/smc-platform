import { ArrowLeftRight, CandlestickChart, Wallet } from "lucide-react"

const FEATURES = [
  {
    icon: CandlestickChart,
    title: "Mercados en tiempo real",
    description:
      "Gráficos profesionales de acciones, índices y cripto, con los datos que de verdad importan.",
  },
  {
    icon: Wallet,
    title: "Tu portafolio, unificado",
    description:
      "Conecta tus wallets y exchanges y mira tu patrimonio fiat + cripto en un solo tablero.",
  },
  {
    icon: ArrowLeftRight,
    title: "Del peso al dólar digital",
    description:
      "Entra y sal entre tu moneda local y stablecoins de forma simple, vía socios regulados.",
  },
] as const

export function Features() {
  return (
    <section
      id="caracteristicas"
      className="border-border/60 scroll-mt-14 border-t border-dashed"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-h2 font-bold tracking-tight">
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
