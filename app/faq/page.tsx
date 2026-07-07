import type { Metadata } from "next"

import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { ContextPage } from "@/components/landing/context-page"
import { Faq } from "@/components/landing/faq"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: t.pages.faq.metaTitle,
    description: t.pages.faq.metaDescription,
  }
}

/**
 * Página de contexto de "Preguntas frecuentes" (docs/specs/landing-pages.md):
 * mantiene el acordeón completo como resumen y agrega bloques temáticos de
 * contexto (introducing broker, datos/asesoría, pagos, prueba). Copy i18n.
 */
export default async function FaqPage() {
  const { t } = await getDictionary()
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ContextPage content={t.pages.faq}>
          <Faq />
        </ContextPage>
      </main>
      <SiteFooter />
    </>
  )
}
