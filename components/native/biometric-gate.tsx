"use client"

import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { biometricGateEnabled, verifyBiometric } from "@/lib/native/platform"

const SESSION_KEY = "smc-biometric-ok"

/**
 * Gate biométrico opcional del dashboard (solo shell nativo + flag
 * NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE=true). Hydration-safe: el primer render
 * siempre muestra children (igual que SSR/navegador); el efecto bloquea
 * después si corresponde. Una verificación válida dura toda la sesión.
 */
export function BiometricGate({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false)

  const attempt = useCallback(async () => {
    const ok = await verifyBiometric("Desbloquear SMC")
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, "1")
      setLocked(false)
    }
  }, [])

  useEffect(() => {
    if (!biometricGateEnabled()) return
    if (sessionStorage.getItem(SESSION_KEY) === "1") return
    setLocked(true)
    void attempt()
  }, [attempt])

  if (locked) {
    return (
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground font-mono text-sm">
          Verificación biométrica requerida
        </p>
        <Button variant="outline" onClick={() => void attempt()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
