import type { Metadata } from "next"

import { Plans } from "@/components/landing/plans"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Planes de acceso a SMC: visualización de mercados en tiempo real. Precios claros, sin permanencia.",
}

/**
 * Superficie brand (ver docs/specs/product.md): los planes del dossier
 * en su propia ruta, reutilizando la misma sección de la landing.
 */
export default function PreciosPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-4 text-center sm:pt-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Precios
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm sm:text-base">
            Elige tu nivel de acceso a los mercados en tiempo real. Pagos
            procesados de forma segura por Stripe.
          </p>
        </section>
        <Plans />
      </main>
      <SiteFooter />
    </>
  )
}
