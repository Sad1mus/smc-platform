"use client"

import { useActionState, useEffect, useRef } from "react"

import { createAlert, type AlertActionResult } from "@/lib/alerts/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const INITIAL: AlertActionResult = {}

/**
 * Formulario para crear una alerta de precio (umbral por símbolo).
 * Es un aviso de análisis: no dispara ninguna operación.
 */
export function AlertForm() {
  const [state, formAction, pending] = useActionState(createAlert, INITIAL)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) formRef.current?.reset()
  }, [state.ok])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="terminal-panel flex flex-col gap-4 p-5"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_140px_140px_auto] sm:items-end">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="alert-symbol">Símbolo</Label>
          <Input
            id="alert-symbol"
            name="symbol"
            placeholder="NASDAQ:AAPL"
            required
            className="font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="alert-direction">Condición</Label>
          <select
            id="alert-direction"
            name="direction"
            defaultValue="above"
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          >
            <option value="above">Sube de</option>
            <option value="below">Baja de</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="alert-threshold">Umbral</Label>
          <Input
            id="alert-threshold"
            name="threshold"
            type="number"
            step="any"
            min="0"
            placeholder="150.00"
            required
            className="font-mono"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creando…" : "Crear alerta"}
        </Button>
      </div>

      {state.error ? (
        <p role="alert" className="text-market-down text-sm">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-market-up text-sm">Alerta creada.</p>
      ) : null}
    </form>
  )
}
