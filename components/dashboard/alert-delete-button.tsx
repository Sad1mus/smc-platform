"use client"

import { useActionState } from "react"
import { Trash2 } from "lucide-react"

import { deleteAlert, type AlertActionResult } from "@/lib/alerts/actions"
import { Button } from "@/components/ui/button"

const INITIAL: AlertActionResult = {}

export function AlertDeleteButton({ id }: { id: string }) {
  const [, formAction, pending] = useActionState(deleteAlert, INITIAL)
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={pending}
        aria-label="Eliminar alerta"
        className="text-muted-foreground hover:text-market-down size-8 p-0"
      >
        <Trash2 className="size-4" />
      </Button>
    </form>
  )
}
