import Link from "next/link"
import { Sprout, Gauge } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RevealCascade } from "@/components/motion/reveal-cascade"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Segmentación dual (playbook §8): dos bloques que hablan a dos perfiles,
 * cada uno con su CTA. Concepto introducing broker (operar vía socios regulados).
 * Copy i18n.
 */
export async function Segments() {
  const { t } = await getDictionary()

  return (
    <section aria-label={t.segments.novice.title}>
      <RevealCascade className="mx-auto grid max-w-6xl gap-5 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        {/* Novato */}
        <div className="glass-card flex w-full flex-col gap-4 p-8">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
            <Sprout aria-hidden="true" className="size-6 text-white" />
          </span>
          <h3 className="text-xl font-semibold">{t.segments.novice.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t.segments.novice.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/registro">{t.segments.novice.primary}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/como-funciona">{t.segments.novice.secondary}</Link>
            </Button>
          </div>
        </div>

        {/* Experimentado */}
        <div className="glass-card flex w-full flex-col gap-4 p-8">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
            <Gauge aria-hidden="true" className="size-6 text-white" />
          </span>
          <h3 className="text-xl font-semibold">{t.segments.pro.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t.segments.pro.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/#planes">{t.segments.pro.primary}</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/plataforma">{t.segments.pro.secondary}</Link>
            </Button>
          </div>
        </div>
      </RevealCascade>
    </section>
  )
}
