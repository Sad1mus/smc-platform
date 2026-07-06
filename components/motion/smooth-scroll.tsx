"use client"

import type { ReactNode } from "react"
import { ReactLenis } from "lenis/react"
import { useReducedMotion } from "motion/react"

/**
 * Smooth-scroll con inercia (Lenis) — SOLO para la landing pública.
 * NO se monta en el dashboard/terminal: ahí romperían el scroll de los embeds
 * TradingView de altura fija y el cockpit. Como `root`, Lenis se ata a window
 * sin agregar wrapper en el DOM (no hay hydration mismatch al swappear).
 * Respeta prefers-reduced-motion => scroll nativo, sin inercia.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  )
}
