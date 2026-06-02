"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

import { Button } from "@/components/ui/button"

/**
 * Error boundary global: captura errores de render de React y los
 * reporta a Sentry (si hay DSN configurada).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error)
    } else {
      console.error(error)
    }
  }, [error])

  return (
    <html lang="es">
      <body className="bg-background text-foreground grid min-h-svh place-items-center p-6 font-sans">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <p className="text-xl font-bold tracking-tight">
            SMC<span className="text-gold">.</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Algo salió mal</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ocurrió un error inesperado. Nuestro equipo fue notificado. Puedes
            intentar de nuevo.
          </p>
          <Button onClick={() => reset()}>Reintentar</Button>
        </div>
      </body>
    </html>
  )
}
