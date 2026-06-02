"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import {
  createCheckoutSession,
  createPortalSession,
} from "@/lib/stripe/actions"
import { Button } from "@/components/ui/button"

/** Botón que inicia el checkout de Stripe para un plan. */
export function PlanCheckoutButton({
  planId,
  planName,
  variant = "outline",
}: {
  planId: string
  planName: string
  variant?: "default" | "outline" | "secondary"
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant={variant}
      className="w-full active:scale-[0.98]"
      disabled={pending}
      data-testid={`checkout-${planId}`}
      onClick={() =>
        startTransition(async () => {
          const result = await createCheckoutSession(planId)
          if (result?.error) {
            toast.error(result.error)
          }
        })
      }
    >
      {pending ? "Abriendo pago seguro…" : `Elegir ${planName}`}
    </Button>
  )
}

/** Botón que abre el Customer Portal de Stripe. */
export function ManageSubscriptionButton() {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      data-testid="manage-subscription"
      className="active:scale-[0.98]"
      onClick={() =>
        startTransition(async () => {
          const result = await createPortalSession()
          if (result?.error) {
            toast.error(result.error)
          }
        })
      }
    >
      {pending ? "Abriendo portal…" : "Gestionar suscripción"}
    </Button>
  )
}
