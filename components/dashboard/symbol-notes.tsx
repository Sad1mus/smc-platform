"use client"

import { useActionState } from "react"

import { saveNote, type NoteActionResult } from "@/lib/notes/actions"
import { PanelHeader } from "@/components/dashboard/panel-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const INITIAL: NoteActionResult = {}

/**
 * Notas privadas del usuario sobre el símbolo activo (diario personal).
 *
 * Texto DEL USUARIO: SMC no opina ni recomienda, y las notas no se comparten ni
 * se agregan entre usuarios. Display-only respecto del mercado — no dispara nada.
 *
 * El padre debe montarlo con `key={symbol}` para que al cambiar de símbolo se
 * remonte: así el textarea toma la nota nueva y se limpia el estado del guardado
 * anterior (si no, quedaría "Guardado" de un símbolo colgado en otro).
 */
export function SymbolNotes({
  symbol,
  note,
}: {
  symbol: string
  note: string
}) {
  const [state, formAction, pending] = useActionState(saveNote, INITIAL)

  return (
    <form action={formAction} className="terminal-panel overflow-hidden">
      <PanelHeader
        label="Mis notas"
        hint={<span className="text-foreground">{symbol}</span>}
      />
      <input type="hidden" name="symbol" value={symbol} />

      <div className="flex flex-col gap-2 p-3">
        <Textarea
          name="body"
          defaultValue={note}
          maxLength={2000}
          rows={4}
          placeholder={`Tu análisis sobre ${symbol}: niveles que mirás, contexto, lo que esperás…`}
          aria-label={`Notas privadas sobre ${symbol}`}
          className="min-h-24 resize-y text-sm"
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-[11px]">
            Privadas: solo vos las ves. Vaciar el campo borra la nota.
          </p>
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={pending}
            className="h-7 px-3 text-xs"
          >
            {pending ? "Guardando…" : "Guardar"}
          </Button>
        </div>

        {state.error ? (
          <p role="alert" className="text-destructive text-xs">
            {state.error}
          </p>
        ) : null}
        {state.ok && !state.error ? (
          <p role="status" className="text-muted-foreground text-xs">
            Nota guardada.
          </p>
        ) : null}
      </div>
    </form>
  )
}
