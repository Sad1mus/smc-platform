import Link from "next/link"
import { Compass, HelpCircle, Tags, ArrowRight } from "lucide-react"

import { RevealCascade } from "@/components/motion/reveal-cascade"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Recursos (playbook §9): SOLO enlaces reales que existen hoy. Copy i18n.
 */
const ITEMS = [
  { icon: Compass, href: "/como-funciona" },
  { icon: Tags, href: "/precios" },
  { icon: HelpCircle, href: "/faq" },
] as const

export async function Resources() {
  const { t } = await getDictionary()

  return (
    <section aria-label={t.resources.heading}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold tracking-tight">
            {t.resources.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.resources.subtitle}
          </p>
        </div>
        <RevealCascade className="mt-10 grid gap-5 md:grid-cols-3">
          {ITEMS.map((item, i) => {
            const copy = t.resources.items[i]
            return (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card group flex w-full flex-col gap-3 p-7"
              >
                <span className="mb-1 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#3E72F7] to-[#2350E8] shadow-[0_8px_20px_-6px_rgba(35,80,232,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <item.icon
                    aria-hidden="true"
                    className="size-5 text-white transition-transform duration-200 ease-out group-hover:scale-110"
                  />
                </span>
                <h3 className="flex items-center gap-1.5 font-semibold">
                  {copy.title}
                  <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {copy.description}
                </p>
              </Link>
            )
          })}
        </RevealCascade>
      </div>
    </section>
  )
}
