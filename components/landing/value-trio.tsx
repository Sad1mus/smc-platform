import { Zap, LayoutGrid, ShieldCheck } from "lucide-react"

/**
 * Trío de valor (playbook §4): exactamente 3 tarjetas, regla de tres.
 * Concepto introducing broker: mercados en tiempo real · todo en un panel ·
 * ejecución a cargo de socios regulados. Solo afirmaciones verificables.
 */
const TRIO = [
  {
    icon: Zap,
    title: "Datos en tiempo real",
    description:
      "Cotizaciones y gráficos en vivo vía TradingView, sin capturas estáticas ni retrasos.",
  },
  {
    icon: LayoutGrid,
    title: "Todo en un panel",
    description:
      "Acciones, cripto, forex e índices en una sola pantalla, con tu watchlist a mano.",
  },
  {
    icon: ShieldCheck,
    title: "Ejecución con socios regulados",
    description:
      "Operá a través de brokers socios regulados: ellos ejecutan tus órdenes y resguardan tus fondos.",
  },
] as const

export function ValueTrio() {
  return (
    <section
      aria-label="Propuesta de valor"
      className="border-border/60 border-t"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
          {TRIO.map((item) => (
            <article
              key={item.title}
              className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
            >
              <item.icon
                aria-hidden="true"
                className="text-gold size-5 transition-transform duration-200 ease-out group-hover:scale-110"
              />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
