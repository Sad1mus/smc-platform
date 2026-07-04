import Link from "next/link"
import { Plus } from "lucide-react"

/**
 * FAQ de facturación (spec §/precios #3): 5 preguntas honestas sobre lo que el
 * sistema hace HOY. Reembolsos remiten a /reembolsos, sin prometer una política
 * distinta a la publicada. Acordeón accesible con <details>/<summary>.
 */
const BILLING_FAQS = [
  {
    q: "¿Cómo pago?",
    a: (
      <>
        Con tarjeta, mediante Stripe. El cobro se procesa de forma segura y
        ningún dato de tu tarjeta pasa por los servidores de SMC.
      </>
    ),
  },
  {
    q: "¿Puedo cancelar?",
    a: (
      <>
        Sí. Cancelás desde Mi plan cuando quieras y conservás el acceso hasta el
        fin del período que ya pagaste.
      </>
    ),
  },
  {
    q: "¿Cómo funciona la Prueba?",
    a: (
      <>
        El plan Prueba es un pago único de $250 USD que te da acceso al
        contenido del plan para evaluar la plataforma. No es una suscripción
        recurrente.
      </>
    ),
  },
  {
    q: "¿Puedo cambiar de plan?",
    a: (
      <>Sí. Gestionás el cambio de plan desde Mi plan, en tu panel de cuenta.</>
    ),
  },
  {
    q: "¿Facturan en mi moneda?",
    a: (
      <>
        Los precios están en USD; tu banco emisor hace la conversión a tu moneda
        local. Para reembolsos, consultá la{" "}
        <Link href="/reembolsos" className="text-gold underline">
          política de reembolsos
        </Link>
        .
      </>
    ),
  },
] as const

export function BillingFaq() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
        Preguntas de facturación
      </h2>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Cómo funciona el pago, la cancelación y la prueba.
      </p>
      <div className="divide-border/60 mt-8 divide-y overflow-hidden rounded-xl border">
        {BILLING_FAQS.map((faq) => (
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
  )
}
