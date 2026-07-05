"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Monta sus children solo cuando entran en viewport (IntersectionObserver, no
 * scroll listener). Úsalo para diferir embeds pesados de terceros (TradingView)
 * y no degradar el LCP. Reserva la altura para no producir layout shift.
 */
export function LazyMount({
  children,
  height,
  rootMargin = "200px",
  className,
}: {
  children: ReactNode
  height: number
  rootMargin?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (shown) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      // Sin soporte de IO: montar en el próximo tick (no setState síncrono).
      const id = setTimeout(() => setShown(true), 0)
      return () => clearTimeout(id)
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          obs.disconnect()
        }
      },
      { rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [shown, rootMargin])

  return (
    <div ref={ref} className={className} style={{ minHeight: height }}>
      {shown ? children : null}
    </div>
  )
}
