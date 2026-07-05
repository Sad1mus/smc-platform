import Link from "next/link"
import { Compass, HelpCircle, Tags, ArrowRight } from "lucide-react"

/**
 * Recursos (playbook §9): SOLO enlaces reales que existen hoy. Sin academia,
 * webinars ni blog inventados. Si en el futuro hay contenido real, se amplía.
 */
const RESOURCES = [
  {
    icon: Compass,
    title: "Cómo funciona",
    description: "De cero a tu panel de mercados en tres pasos.",
    href: "/#como-funciona",
  },
  {
    icon: Tags,
    title: "Planes y precios",
    description: "Compará qué incluye cada plan, sin permanencia.",
    href: "/precios",
  },
  {
    icon: HelpCircle,
    title: "Preguntas frecuentes",
    description: "Lo esencial antes de empezar, respondido.",
    href: "/#faq",
  },
] as const

export function Resources() {
  return (
    <section aria-label="Recursos" className="border-border/60 border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Antes de decidir
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Todo lo que necesitás para conocer la plataforma, en un clic.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border md:grid-cols-3">
          {RESOURCES.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className="bg-card group hover:bg-secondary/60 flex flex-col gap-3 p-6 transition-colors duration-200"
            >
              <r.icon aria-hidden="true" className="text-gold size-5" />
              <h3 className="flex items-center gap-1.5 font-semibold">
                {r.title}
                <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {r.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
