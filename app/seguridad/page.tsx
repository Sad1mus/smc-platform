import type { Metadata } from "next"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { ContextPage } from "@/components/landing/context-page"
import { WhyUs } from "@/components/landing/why-us"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: t.pages.security.metaTitle,
    description: t.pages.security.metaDescription,
  }
}

/**
 * Página de contexto de "Seguridad" (docs/specs/landing-pages.md): expande los
 * pilares de confianza de WhyUs con señales REALES (TradingView, Stripe, RLS).
 * Sin sellos de regulador inventados ni promesas de rentabilidad. Copy i18n.
 */
export default async function SeguridadPage() {
  const { t } = await getDictionary()
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ContextPage content={t.pages.security}>
          <WhyUs />
        </ContextPage>
      </main>
      <SiteFooter />
    </>
  )
}
