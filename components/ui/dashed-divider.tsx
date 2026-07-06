import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Divisor punteado — la firma estructural del re-skin.
 * Horizontal (border-t) o vertical (border-l, para separar columnas dentro de pills/paneles).
 */
function DashedDivider({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      data-slot="dashed-divider"
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "border-border border-dashed",
        orientation === "horizontal"
          ? "w-full border-t"
          : "h-full self-stretch border-l",
        className
      )}
      {...props}
    />
  )
}

export { DashedDivider }
