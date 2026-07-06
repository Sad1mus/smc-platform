import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Kicker / etiqueta de dato — mono, mayúsculas, pequeña. Encabeza secciones y paneles
 * ("EN VIVO", "MERCADOS", "PLANES"...). Usa la escala tipográfica tokenizada (text-label).
 */
function DataLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="data-label"
      className={cn(
        "text-muted-foreground text-label font-mono tracking-[0.14em] uppercase",
        className
      )}
      {...props}
    />
  )
}

export { DataLabel }
