import type { Metadata } from "next"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { ContextPage } from "@/components/landing/context-page"
import { PlatformSection } from "@/components/landing/platform-section"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: t.pages.platform.metaTitle,
    description: t.pages.platform.metaDescription,
  }
}

/**
 * Página de contexto de "La plataforma" (docs/specs/landing-pages.md): expande
 * qué ofrece el panel (display-only) con el embed real de TradingView. Copy i18n.
 */
export default async function PlataformaPage() {
  const { t } = await getDictionary()
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ContextPage content={t.pages.platform}>
          <PlatformSection />
        </ContextPage>
      </main>
      <SiteFooter />
    </>
  )
}
