import { ShieldCheck, Lock, Eye } from "lucide-react"

import { getDictionary } from "@/lib/i18n/server"

/**
 * Franja de confianza (Taste §hero): las señales de confianza NO van dentro del
 * hero; viven en su propia franja debajo. Solo afirmaciones verificables.
 */
export async function TrustStrip() {
  const { t } = await getDictionary()
  const items = [
    { icon: ShieldCheck, label: t.trustStrip.execution },
    { icon: Lock, label: t.trustStrip.data },
    { icon: Eye, label: t.trustStrip.noHidden },
  ]

  return (
    <section aria-label={t.trustStrip.execution}>
      <ul className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-x-8 gap-y-3 px-4 py-6 text-sm sm:flex-row sm:flex-wrap sm:justify-center md:px-6">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <item.icon aria-hidden="true" className="text-gold/80 size-4" />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
