import { Plus } from "lucide-react"

/**
 * FAQ pública (spec §Landing #7): acordeón accesible con las 8 preguntas canon.
 * Concepto introducing broker: SMC es la plataforma; la ejecución y la custodia
 * las hacen brokers socios regulados. SMC no da consejos de inversión.
 *
 * Se usa <details>/<summary> nativo: accesible por teclado y lectores de
 * pantalla sin JavaScript, y funciona aunque la hidratación falle.
 */
const FAQS = [
  {
    q: "¿Qué es SMC?",
    a: "Una plataforma de trading multi-activo: reunís gráficos, portafolio y tus operaciones en un lugar. La ejecución de órdenes y la custodia de fondos están a cargo de brokers socios regulados.",
  },
  {
    q: "¿Los datos son en tiempo real?",
    a: "Sí. Los gráficos y cotizaciones del panel se muestran en tiempo real a través de TradingView.",
  },
  {
    q: "¿Qué mercados puedo ver?",
    a: "Cuatro clases de activos: acciones, cripto, forex e índices.",
  },
  {
    q: "¿Cómo pago?",
    a: "Con tarjeta, mediante Stripe. Ningún dato de tu tarjeta pasa por los servidores de SMC.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Gestionás la cancelación desde Mi plan, y conservás el acceso hasta el fin del período pagado.",
  },
  {
    q: "¿SMC da consejos de inversión?",
    a: "No. SMC entrega datos y herramientas de análisis; las decisiones son siempre tuyas.",
  },
  {
    q: "¿En qué idioma está?",
    a: "En español primero, pensado para LATAM y España.",
  },
  {
    q: "¿Hay una prueba?",
    a: "Sí. El plan Prueba, un pago único de $250 USD, te da acceso al contenido para evaluar la plataforma.",
  },
] as const

export function Faq() {
  return (
    <section id="faq" className="border-border/60 scroll-mt-14 border-t">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Lo esencial antes de empezar.
          </p>
        </div>
        <div className="divide-border/60 mt-10 divide-y overflow-hidden rounded-xl border">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group bg-card [&_summary]:hover:bg-secondary/40"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium transition-colors duration-200 marker:content-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <Plus
                  aria-hidden="true"
                  className="text-gold size-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
