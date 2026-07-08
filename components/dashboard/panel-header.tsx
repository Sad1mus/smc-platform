import type { ReactNode } from "react"

/**
 * Cabecera de panel del terminal: micro-label mono en mayúsculas con un punto
 * de acento, y una pista opcional a la derecha (símbolo, contador, etc.).
 * Da a cada panel el marco denso de un cockpit, no el de una tarjeta de SaaS.
 */
export function PanelHeader({
  label,
  hint,
}: {
  label: string
  hint?: ReactNode
}) {
  return (
    <div className="border-border/70 bg-muted/40 flex items-center justify-between gap-2 border-b border-dashed px-3 py-2">
      <span className="text-foreground/75 flex items-center gap-2 font-mono text-[11px] font-medium tracking-wider uppercase">
        <span className="bg-gold h-3 w-0.5 rounded-full" aria-hidden />
        {label}
      </span>
      {hint ? (
        <span className="text-muted-foreground/70 font-mono text-[11px]">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
