import { cache } from "react"

import { getUser } from "@/lib/auth/profile"
import { createClient } from "@/lib/supabase/server"
import type { Plan, Subscription } from "@/types/database"

export type ActiveSubscription = Subscription & { plan: Plan | null }

/** Estados de Stripe que dan acceso a la plataforma. */
const ACTIVE_STATUSES = ["active", "trialing"] as const

/**
 * Suscripción activa del usuario actual (o null).
 * Fuente de verdad para el gating de acceso al dashboard.
 */
export const getActiveSubscription = cache(
  async (): Promise<ActiveSubscription | null> => {
    const user = await getUser()
    if (!user) return null

    const supabase = await createClient()
    const { data } = await supabase
      .from("subscriptions")
      .select("*, plan:plans(*)")
      .eq("user_id", user.id)
      .in("status", [...ACTIVE_STATUSES])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    return (data as ActiveSubscription | null) ?? null
  }
)

/** true si el usuario actual tiene acceso pago a la plataforma. */
export async function hasActiveAccess(): Promise<boolean> {
  const subscription = await getActiveSubscription()
  return subscription !== null
}
