import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

/**
 * Cascarón compartido de las páginas legales (Términos, Privacidad, Reembolsos).
 * El contenido es PROVISIONAL: usa marcadores [[...]] que deben reemplazarse con
 * los datos legales reales del cliente antes del go-live.
 */
export function LegalPage({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground/70 mt-2 mb-10 font-mono text-xs">
            Documento provisional · pendiente de los datos legales del cliente.
          </p>
          <div className="text-muted-foreground flex flex-col gap-6 text-sm leading-relaxed">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}

/** Sección con título para las páginas legales. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-foreground text-base font-medium">{heading}</h2>
      {children}
    </section>
  )
}
