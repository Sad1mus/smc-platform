import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * CTA final (spec §Landing #8): invitación a crear cuenta, antes del footer.
 * Copy de visualización/análisis; sin promesas de rentabilidad.
 */
export function Cta() {
  return (
    <section className="border-border/60 border-t border-dashed">
      <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-20 text-center md:px-6 md:py-28">
        <div
          aria-hidden="true"
          className="bg-gold/10 pointer-events-none absolute top-1/2 left-1/2 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 className="text-h1 font-bold tracking-tight">
            Tus mercados, en una sola pantalla
          </h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Creá tu cuenta y empezá a visualizar acciones, cripto, forex e
            índices en tiempo real. Sin comisiones ocultas.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/registro">
                Crear cuenta
                <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#planes">Ver los planes</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
