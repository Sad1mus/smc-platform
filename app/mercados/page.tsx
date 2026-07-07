import type { Metadata } from "next"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { ContextPage } from "@/components/landing/context-page"
import { MarketsCovered } from "@/components/landing/markets-covered"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: t.pages.markets.metaTitle,
    description: t.pages.markets.metaDescription,
  }
}

/**
 * Página de contexto de "Mercados" (docs/specs/landing-pages.md): expande la
 * sección del home con las seis clases de activos y su detalle. Copy i18n.
 */
export default async function MercadosPage() {
  const { t } = await getDictionary()
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ContextPage content={t.pages.markets}>
          <MarketsCovered />
        </ContextPage>
      </main>
      <SiteFooter />
    </>
  )
}
