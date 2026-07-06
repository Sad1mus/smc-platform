"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "motion/react"

/**
 * Count-up al entrar en viewport. SOLO anima si el value es un entero simple
 * (prefijo/sufijo no-dígito, sin separadores internos: "6", "+100", "24%").
 * Si no ("24/7", "Tiempo real", "10.000", "ES · EN") lo renderiza tal cual.
 * El texto FINAL siempre == value exacto (copy congelada, no se altera).
 * Respeta prefers-reduced-motion => valor final directo, sin animación.
 */
const INT_RE = /^(\D*)(\d+)(\D*)$/

export function AnimatedNumber({
  value,
  className,
  duration = 1.4,
}: {
  value: string
  className?: string
  duration?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const m = value.match(INT_RE)
  const target = m ? Number(m[2]) : null
  const prefix = m ? m[1] : ""
  const suffix = m ? m[3] : ""
  const animatable = !reduce && target !== null
  const [text, setText] = useState<string>(`${prefix}0${suffix}`)

  useEffect(() => {
    if (!animatable || !inView || target === null) return
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(`${prefix}${Math.round(v)}${suffix}`),
    })
    return () => controls.stop()
  }, [animatable, inView, target, duration, prefix, suffix])

  // Estático (reduced-motion o value no numérico) => value exacto, sin animar.
  return (
    <span ref={ref} className={className}>
      {animatable ? text : value}
    </span>
  )
}
