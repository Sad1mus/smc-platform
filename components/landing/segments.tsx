import Link from "next/link"
import { Sprout, Gauge } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Segmentación dual (playbook §8): dos bloques que hablan a dos perfiles,
 * cada uno con su CTA. Concepto introducing broker (operar vía socios regulados).
 */
export function Segments() {
  return (
    <section aria-label="Para vos" className="border-border/60 border-t">
      <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        {/* Novato */}
        <div className="bg-card flex flex-col gap-4 rounded-l-xl border p-8">
          <Sprout aria-hidden="true" className="text-gold size-6" />
          <h3 className="text-xl font-semibold">¿Nuevo en los mercados?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Empezá tranquilo. El plan Prueba te da acceso al contenido para que
            conozcas la plataforma a tu ritmo, y te mostramos cómo funciona en
            tres pasos.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/registro">Empezar con Prueba</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/#como-funciona">Cómo funciona</Link>
            </Button>
          </div>
        </div>

        {/* Experimentado */}
        <div className="bg-card flex flex-col gap-4 rounded-r-xl border border-l-0 p-8">
          <Gauge aria-hidden="true" className="text-gold size-6" />
          <h3 className="text-xl font-semibold">¿Ya seguís los mercados?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Andá directo al panel: gráficos en tiempo real, heatmap, calendario
            económico, screener y tu watchlist. Operá a través de brokers socios
            regulados, todo desde una pantalla.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/#planes">Ver los planes</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/#plataforma">Explorar el panel</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
