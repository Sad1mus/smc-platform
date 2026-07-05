import { ShieldCheck, Lock, Eye } from "lucide-react"

/**
 * Franja de confianza (Taste §hero): las señales de confianza NO van dentro del
 * hero; viven en su propia franja debajo. Solo afirmaciones verificables.
 */
const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    label: "Conversiones y pagos procesados por socios licenciados",
  },
  { icon: Lock, label: "Tus datos, cifrados" },
  { icon: Eye, label: "Sin comisiones ocultas" },
] as const

export function TrustStrip() {
  return (
    <section
      aria-label="Señales de confianza"
      className="border-border/60 border-t"
    >
      <ul className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-x-8 gap-y-3 px-4 py-6 text-sm sm:flex-row sm:flex-wrap sm:justify-center md:px-6">
        {TRUST_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <item.icon aria-hidden="true" className="text-gold/80 size-4" />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  )
}
