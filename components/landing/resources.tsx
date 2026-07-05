import Link from "next/link"
import { Compass, HelpCircle, Tags, ArrowRight } from "lucide-react"

import { getDictionary } from "@/lib/i18n/server"

/**
 * Recursos (playbook §9): SOLO enlaces reales que existen hoy. Copy i18n.
 */
const ITEMS = [
  { icon: Compass, href: "/#como-funciona" },
  { icon: Tags, href: "/precios" },
  { icon: HelpCircle, href: "/#faq" },
] as const

export async function Resources() {
  const { t } = await getDictionary()

  return (
    <section
      aria-label={t.resources.heading}
      className="border-border/60 border-t"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t.resources.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.resources.subtitle}
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
          {ITEMS.map((item, i) => {
            const copy = t.resources.items[i]
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
              >
                <item.icon aria-hidden="true" className="text-gold size-5" />
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
        </div>
      </div>
    </section>
  )
}
