"use client"

import { useState, useTransition } from "react"

import { startKycVerification } from "@/lib/kyc/actions"
import { Button } from "@/components/ui/button"

export function KycVerifyButton({ retry = false }: { retry?: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await startKycVerification()
      if (result.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleClick}
        disabled={isPending}
        variant={retry ? "outline" : "default"}
        className="self-start"
      >
        {isPending
          ? "Verificando…"
          : retry
            ? "Reintentar verificación"
            : "Verificar identidad"}
      </Button>
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  )
}
