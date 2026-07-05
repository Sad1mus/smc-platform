"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * Barra de estado del terminal (spec §Terminal display [A]): estado de sesión,
 * reloj en vivo y horario de mercados. NO muestra fondos, equidad, margen ni
 * P&L, ni botón de depósito — la ejecución vive en el broker socio, no en SMC.
 *
 * El reloj y las sesiones son display-only: horas programadas de cada plaza
 * (aproximadas; los feriados no se contemplan). Cripto cotiza 24/7.
 */

// Horario regular de cada plaza en horas UTC (aprox., días hábiles).
const SESSIONS = [
  { code: "TOK", open: 0, close: 6 },
  { code: "LON", open: 7, close: 16 },
  { code: "NY", open: 13, close: 21 },
] as const

// ── Reloj como store externo (patrón React para valores mutables externos) ──
let clockSnapshot = 0
const listeners = new Set<() => void>()
let tickId: number | null = null

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (tickId === null) {
    clockSnapshot = Date.now()
    tickId = window.setInterval(() => {
      clockSnapshot = Date.now()
      listeners.forEach((l) => l())
    }, 1000)
  }
  listener()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && tickId !== null) {
      window.clearInterval(tickId)
      tickId = null
    }
  }
}

function useClock() {
  return useSyncExternalStore(
    subscribe,
    () => clockSnapshot,
    () => 0
  )
}

function sessionOpen(
  utcHour: number,
  weekday: number,
  open: number,
  close: number
) {
  const isWeekday = weekday >= 1 && weekday <= 5
  return isWeekday && utcHour >= open && utcHour < close
}

export function TerminalStatusBar({ planName }: { planName: string | null }) {
  const nowMs = useClock()
  const now = nowMs ? new Date(nowMs) : null

  const utcHour = now?.getUTCHours() ?? 0
  const weekday = now?.getUTCDay() ?? 0
  const clock = now
    ? now.toLocaleTimeString("es", { hour12: false })
    : "--:--:--"

  return (
    <div className="border-border/60 bg-card/40 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border px-3 py-2 font-mono text-xs">
      {/* Indicador de feed en vivo */}
      <span className="flex items-center gap-1.5">
        <span className="relative flex size-2">
          <span className="bg-market-up absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden" />
          <span className="bg-market-up relative inline-flex size-2 rounded-full" />
        </span>
        <span className="text-foreground font-semibold tracking-wide">
          EN VIVO
        </span>
      </span>

      <span className="bg-border/70 hidden h-3 w-px sm:block" aria-hidden />

      {/* Sesiones de mercado */}
      <div
        className="flex items-center gap-3"
        aria-label="Horario de sesiones de mercado"
      >
        {SESSIONS.map((s) => {
          const open = now
            ? sessionOpen(utcHour, weekday, s.open, s.close)
            : false
          return (
            <span key={s.code} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  open ? "bg-market-up" : "bg-muted-foreground/40"
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "tracking-wide",
                  open ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.code}
              </span>
            </span>
          )
        })}
        <span className="flex items-center gap-1.5">
          <span className="bg-gold size-1.5 rounded-full" aria-hidden />
          <span className="text-foreground tracking-wide">CRIPTO 24/7</span>
        </span>
      </div>

      <span className="bg-border/70 hidden h-3 w-px lg:block" aria-hidden />

      <span className="text-muted-foreground hidden lg:inline">
        Plan{" "}
        <span className="text-foreground font-semibold">{planName ?? "—"}</span>
      </span>

      {/* Reloj en vivo + acceso a plan */}
      <div className="ml-auto flex items-center gap-4">
        <span
          className="text-muted-foreground tabular"
          aria-label="Hora local"
          suppressHydrationWarning
        >
          {clock}
        </span>
        <Link href="/dashboard/plan" className="text-gold hover:text-gold/80">
          Mi plan
        </Link>
      </div>
    </div>
  )
}
