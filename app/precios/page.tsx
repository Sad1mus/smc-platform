import type { Metadata } from "next"

import { Plans } from "@/components/landing/plans"
import { PlanComparison } from "@/components/pricing/plan-comparison"
import { BillingFaq } from "@/components/pricing/billing-faq"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: t.pricing.title,
    description: t.meta.pricingDescription,
  }
}

/**
 * Superficie brand (ver docs/specs/product.md): los planes del dossier
 * en su propia ruta, reutilizando la misma sección de la landing. Copy i18n.
 */
export default async function PreciosPage() {
  const { t } = await getDictionary()
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-4 text-center sm:pt-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.pricing.title}
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm sm:text-base">
            {t.pricing.subtitle}
          </p>
        </section>
        <Plans />
        {/* Tabla comparativa de features (desde la tabla plans) */}
        <section aria-label={t.pricing.title} className="py-16 md:py-20">
          <PlanComparison />
        </section>
        {/* FAQ de facturación */}
        <section
          aria-label={t.faq.heading}
          className="border-border/60 border-t py-16 md:py-20"
        >
          <BillingFaq />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
