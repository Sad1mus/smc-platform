"use server"

import { revalidatePath } from "next/cache"

import { getUser } from "@/lib/auth/profile"
import { getActiveSubscription } from "@/lib/subscription/queries"
import { createClient } from "@/lib/supabase/server"
import { canCreateAlert } from "@/lib/alerts/limits"

export type AlertActionResult = { error?: string; ok?: boolean }

/**
 * Crea una alerta de precio para el usuario actual.
 * - Valida entrada, aplica el tope por plan (canCreateAlert).
 * - La escritura respeta RLS (el usuario solo puede insertar filas suyas).
 * NO ejecuta nada en el mercado: es un umbral de aviso (disparo = stub, ver más
 * abajo). Es análisis, no una orden.
 */
export async function createAlert(
  _prev: AlertActionResult,
  formData: FormData
): Promise<AlertActionResult> {
  const user = await getUser()
  if (!user) return { error: "Necesitás iniciar sesión." }

  const symbol = String(formData.get("symbol") ?? "")
    .trim()
    .toUpperCase()
  const direction = String(formData.get("direction") ?? "")
  const threshold = Number(formData.get("threshold"))

  if (symbol.length < 1 || symbol.length > 40) {
    return { error: "Símbolo inválido." }
  }
  if (direction !== "above" && direction !== "below") {
    return { error: "Elegí una condición válida." }
  }
  if (!Number.isFinite(threshold) || threshold <= 0) {
    return { error: "El umbral debe ser un número mayor que cero." }
  }

  const supabase = await createClient()
  const [{ count }, subscription] = await Promise.all([
    supabase
      .from("price_alerts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    getActiveSubscription(),
  ])

  if (!canCreateAlert(subscription?.plan_id ?? null, count ?? 0)) {
    return {
      error:
        "Alcanzaste el límite de alertas de tu plan. Mejorá tu plan para crear más.",
    }
  }

  const { error } = await supabase.from("price_alerts").insert({
    user_id: user.id,
    symbol,
    direction,
    threshold,
  })

  if (error) return { error: "No se pudo crear la alerta. Intentá de nuevo." }

  revalidatePath("/dashboard/alertas")
  return { ok: true }
}

/** Elimina una alerta del usuario (RLS impide borrar las de otros). */
export async function deleteAlert(
  _prev: AlertActionResult,
  formData: FormData
): Promise<AlertActionResult> {
  const user = await getUser()
  if (!user) return { error: "Necesitás iniciar sesión." }

  const id = String(formData.get("id") ?? "")
  if (!id) return { error: "Alerta inválida." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("price_alerts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: "No se pudo eliminar la alerta." }

  revalidatePath("/dashboard/alertas")
  return { ok: true }
}
