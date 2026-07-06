"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

/**
 * Parallax vertical atado al progreso de scroll del elemento por el viewport.
 * `speed` = amplitud del desplazamiento (px a cada lado del centro). Positivo =>
 * el contenido "flota" más lento que el scroll (sensación de profundidad).
 * Respeta prefers-reduced-motion => render estático, sin transform.
 */
export function Parallax({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])

  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}
