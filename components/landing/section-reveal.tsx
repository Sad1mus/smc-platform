"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

/**
 * Envuelve una sección de la landing y la revela al entrar en viewport
 * (sube + aparece). Movimiento notable pero de una sola vez. Respeta
 * prefers-reduced-motion => renderiza estático sin ocultar contenido.
 */
export function SectionReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
