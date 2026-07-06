import * as React from "react"

import { cn } from "@/lib/utils"

type StatItem = { label: React.ReactNode; value: React.ReactNode }

/**
 * Pill de estadísticas / info — contenedor redondeado con N columnas separadas por
 * divisores punteados (patrón donado de la referencia). Cifras en mono + tabular-nums.
 * Reutilizable para KPIs descriptivos y bloques de contacto. NO usar para prometer rendimiento.
 */
function StatPill({
  items,
  className,
  ...props
}: React.ComponentProps<"div"> & { items: StatItem[] }) {
  return (
    <div
      data-slot="stat-pill"
      className={cn(
        "border-border divide-border flex flex-col divide-y divide-dashed rounded-3xl border border-dashed px-2 py-4",
        "sm:flex-row sm:divide-x sm:divide-y-0",
        className
      )}
      {...props}
    >
      {items.map((it, i) => (
        <div
          key={i}
          className="flex flex-1 flex-col items-center gap-1 px-6 py-2 text-center"
        >
          <span className="font-mono text-lg font-semibold tabular-nums">
            {it.value}
          </span>
          <span className="text-muted-foreground text-sm">{it.label}</span>
        </div>
      ))}
    </div>
  )
}

export { StatPill }
