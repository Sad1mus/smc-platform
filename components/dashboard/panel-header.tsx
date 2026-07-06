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
    <div className="border-border/60 bg-background/40 flex items-center justify-between gap-2 border-b border-dashed px-3 py-1.5">
      <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase">
        <span className="bg-gold/70 size-1.5 rounded-full" aria-hidden />
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
