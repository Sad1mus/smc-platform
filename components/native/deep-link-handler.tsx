"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { isNativeApp, onAppUrlOpen } from "@/lib/native/platform"

/**
 * Enruta deep links (`smc://…` / universal links) cuando la web corre dentro
 * del shell nativo. En navegador puro no hace nada y no renderiza nada.
 */
export function DeepLinkHandler() {
  const router = useRouter()

  useEffect(() => {
    if (!isNativeApp()) return
    return onAppUrlOpen((path) => router.push(path))
  }, [router])

  return null
}
