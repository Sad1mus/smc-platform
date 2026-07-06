"use client"

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

/**
 * Cascada escalonada: envuelve una grilla/lista y revela sus hijos DIRECTOS uno
 * tras otro (stagger) al entrar en viewport. Cada hijo se envuelve en una celda
 * motion que estira (grid stretch), así el hijo con `h-full` conserva el look
 * hairline `gap-px`. Movimiento suave (opacity + y corto + micro-scale) para no
 * abrir huecos feos entre celdas. Respeta prefers-reduced-motion => estático.
 */
const EASE_OUT_SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}

const cellVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT_SOFT },
  },
}

export function RevealCascade({
  children,
  className,
  amount = 0.2,
}: {
  children: React.ReactNode
  className?: string
  amount?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={cellVariants} className="flex">
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
