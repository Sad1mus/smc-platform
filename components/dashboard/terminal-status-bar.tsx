import Link from "next/link"
import { Circle } from "lucide-react"

/**
 * Barra de estado del terminal (spec §Terminal display [A]): plan y sesión.
 * NO muestra fondos, equidad, margen ni P&L, ni botón de depósito — SMC es
 * display-only. Solo estado de la cuenta y accesos.
 */
export function TerminalStatusBar({ planName }: { planName: string | null }) {
  return (
    <div className="border-border/60 bg-card/40 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-xl border px-4 py-2.5 font-mono text-xs">
      <span className="flex items-center gap-1.5">
        <Circle
          className="fill-market-up text-market-up size-2"
          aria-hidden="true"
        />
        <span className="text-muted-foreground">Sesión activa</span>
      </span>
      <span className="text-muted-foreground">
        Plan:{" "}
        <span className="text-foreground font-semibold">{planName ?? "—"}</span>
      </span>
      <span className="text-muted-foreground hidden sm:inline">
        Datos en tiempo real
      </span>
      <Link
        href="/dashboard/plan"
        className="text-gold hover:text-gold/80 ml-auto"
      >
        Mi plan
      </Link>
    </div>
  )
}
