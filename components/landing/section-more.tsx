import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getDictionary } from "@/lib/i18n/server"

/**
 * Enlace "Conocer más →" al pie de una sección del home que tiene una página de
 * detalle (docs/specs/landing-pages.md). Las secciones lo renderizan solo cuando
 * reciben `href`; en la propia página de detalle no se pasa, y así no se autoenlaza.
 */
export async function SectionMore({ href }: { href: string }) {
  const { t } = await getDictionary()
  return (
    <div className="mt-10 flex justify-center">
      <Link
        href={href}
        className="group text-foreground/80 hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors duration-200"
      >
        {t.cta.learnMore}
        <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
