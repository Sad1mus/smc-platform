import Link from "next/link"
import { UserPlus, CreditCard, LineChart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * CTA de cierre (playbook §11): embudo NUMERADO + un CTA grande centrado.
 * El embudo lleva a registrarse y elegir plan; nunca empuja a poner dinero ni
 * a ejecutar operaciones (marco vigente).
 * Incluye prueba social HONESTA: solo integraciones reales (TradingView, Stripe).
 */
const STEPS = [
  {
    icon: UserPlus,
    title: "Registrate",
    description: "Creá tu cuenta con tu correo en un minuto.",
  },
  {
    icon: CreditCard,
    title: "Elegí tu plan",
    description: "Prueba, Bronce, Plata o VIP. Pago seguro por Stripe.",
  },
  {
    icon: LineChart,
    title: "Visualizá los mercados",
    description: "Entrá al panel y seguí los mercados en tiempo real.",
  },
] as const

export function ClosingCta() {
  return (
    <section className="border-border/60 border-t">
      {/* Prueba social honesta: integraciones reales, sin premios inventados */}
      <div className="border-border/60 border-b">
        <ul className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-5 font-mono text-xs md:px-6">
          <li>Datos por TradingView</li>
          <li aria-hidden="true" className="text-border">
            ·
          </li>
          <li>Pagos por Stripe</li>
          <li aria-hidden="true" className="text-border">
            ·
          </li>
          <li>Datos protegidos con RLS</li>
        </ul>
      </div>

      <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-20 md:px-6 md:py-28">
        <div
          aria-hidden="true"
          className="bg-gold/10 pointer-events-none absolute top-1/2 left-1/2 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Empezá en tres pasos
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              Sin permanencia. Cancelá cuando quieras.
            </p>
          </div>

          {/* Embudo numerado */}
          <ol className="grid w-full gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="border-border/60 bg-card/50 flex flex-col items-center gap-2 rounded-xl border p-5 text-center"
              >
                <span className="text-gold font-mono text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <step.icon aria-hidden="true" className="text-gold size-5" />
                <span className="font-semibold">{step.title}</span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {step.description}
                </span>
              </li>
            ))}
          </ol>

          <Button asChild size="lg" className="group">
            <Link href="/registro">
              Crear mi cuenta
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
