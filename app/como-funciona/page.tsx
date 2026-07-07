import type { Metadata } from "next"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { ContextPage } from "@/components/landing/context-page"
import { HowItWorks } from "@/components/landing/how-it-works"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: t.pages.howItWorks.metaTitle,
    description: t.pages.howItWorks.metaDescription,
  }
}

/**
 * Página de contexto de "Cómo funciona" (docs/specs/landing-pages.md): expande
 * los tres pasos y explica el modelo introducing broker. Copy i18n.
 */
export default async function ComoFuncionaPage() {
  const { t } = await getDictionary()
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ContextPage content={t.pages.howItWorks}>
          <HowItWorks />
        </ContextPage>
      </main>
      <SiteFooter />
    </>
  )
}
