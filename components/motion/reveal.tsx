"use client"

import * as React from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

/**
 * Primitiva de reveal única del re-skin "terminal editorial".
 * Fade + rise discreto (y:20px, 0.42s, ease-out suave), disparado al entrar en viewport
 * (whileInView, once). Respeta prefers-reduced-motion => renderiza sin animación.
 * Tokens de referencia en globals.css: --reveal-y, --reveal-dur, --ease-out-soft.
 */
const EASE_OUT_SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE_OUT_SOFT },
  },
}

type GroupProps = React.ComponentProps<typeof motion.div> & {
  once?: boolean
  amount?: number
}

function RevealGroup({
  children,
  className,
  once = true,
  amount = 0.3,
  ...props
}: GroupProps) {
  const reduce = useReducedMotion()
  if (reduce)
    return (
      <div className={className as string}>{children as React.ReactNode}</div>
    )
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function RevealItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const reduce = useReducedMotion()
  if (reduce)
    return (
      <div className={className as string}>{children as React.ReactNode}</div>
    )
  return (
    <motion.div className={className} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  )
}

export { RevealGroup, RevealItem }
