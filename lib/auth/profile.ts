import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/types/database"

/**
 * Usuario autenticado actual (o null). Validado contra Supabase.
 * Cacheado por request con React cache().
 */
export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/** Perfil (tabla profiles) del usuario actual, con su rol RBAC. */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
})

/** true si el usuario actual tiene rol admin. */
export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile()
  return profile?.role === "admin"
}
