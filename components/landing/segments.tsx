import Link from "next/link"
import { Sprout, Gauge } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Segmentación dual (playbook §8): dos bloques que hablan a dos perfiles,
 * cada uno con su CTA. Concepto introducing broker (operar vía socios regulados).
 * Copy i18n.
 */
export async function Segments() {
  const { t } = await getDictionary()

  return (
    <section
      aria-label={t.segments.novice.title}
      className="border-border/60 border-t"
    >
      <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        {/* Novato */}
        <div className="bg-card flex flex-col gap-4 rounded-l-xl border p-8">
          <Sprout aria-hidden="true" className="text-gold size-6" />
          <h3 className="text-xl font-semibold">{t.segments.novice.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t.segments.novice.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/registro">{t.segments.novice.primary}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/#como-funciona">{t.segments.novice.secondary}</Link>
            </Button>
          </div>
        </div>

        {/* Experimentado */}
        <div className="bg-card flex flex-col gap-4 rounded-r-xl border border-l-0 p-8">
          <Gauge aria-hidden="true" className="text-gold size-6" />
          <h3 className="text-xl font-semibold">{t.segments.pro.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t.segments.pro.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/#planes">{t.segments.pro.primary}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/#plataforma">{t.segments.pro.secondary}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
