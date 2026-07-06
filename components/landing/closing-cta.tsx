import Link from "next/link"
import { UserPlus, CreditCard, LineChart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n/server"

/**
 * CTA de cierre (playbook §11): embudo NUMERADO + un CTA grande centrado.
 * Concepto introducing broker: abrí cuenta, elegí plan y operá vía socios
 * regulados. Prueba social HONESTA: solo integraciones reales. Copy i18n.
 */
const ICONS = [UserPlus, CreditCard, LineChart] as const

export async function ClosingCta() {
  const { t } = await getDictionary()

  return (
    <section>
      {/* Prueba social honesta: integraciones reales, sin premios inventados */}
      <div>
        <ul className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-5 font-mono text-xs md:px-6">
          {t.closing.proof.map((item, i) => (
            <li key={item} className="flex items-center gap-8">
              {i > 0 ? (
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
              ) : null}
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-20 md:px-6 md:py-28">
        <div
          aria-hidden="true"
          className="bg-gold/10 pointer-events-none absolute top-1/2 left-1/2 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-h1 font-bold tracking-tight">
              {t.closing.heading}
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              {t.closing.subtitle}
            </p>
          </div>

          {/* Embudo numerado */}
          <ol className="grid w-full gap-5 sm:grid-cols-3">
            {t.closing.steps.map((step, i) => {
              const Icon = ICONS[i] ?? UserPlus
              return (
                <li
                  key={step.title}
                  className="glass-card flex flex-col items-center gap-2 p-6 text-center"
                >
                  <span className="mb-1 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
                    <Icon aria-hidden="true" className="size-5 text-white" />
                  </span>
                  <span className="text-gold font-mono text-xs font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-semibold">{step.title}</span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {step.description}
                  </span>
                </li>
              )
            })}
          </ol>

          <Button
            asChild
            size="lg"
            className="btn-glossy group rounded-full px-8"
          >
            <Link href="/registro">
              {t.cta.openAccount}
              <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
