import "server-only"

import { getUser } from "@/lib/auth/profile"
import { createClient } from "@/lib/supabase/server"
import type { PriceAlert } from "@/types/database"

/** Alertas de precio del usuario actual, más recientes primero (RLS: solo suyas). */
export async function listAlerts(): Promise<PriceAlert[]> {
  const user = await getUser()
  if (!user) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from("price_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (data as PriceAlert[] | null) ?? []
}
