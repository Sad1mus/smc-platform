import { cache } from "react"

import { getUser } from "@/lib/auth/profile"
import { createClient } from "@/lib/supabase/server"
import type { KycStatus, KycVerification } from "@/types/database"

/**
 * Estado KYC de un usuario. Sin fila registrada → "unverified".
 * Lee con el cliente del usuario (RLS: solo puede ver la propia).
 */
export async function getKycStatus(userId: string): Promise<KycStatus> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("kyc_verifications")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle()

  return data?.status ?? "unverified"
}

/** Verificación KYC completa del usuario actual (o null si no hay usuario/fila). */
export const getCurrentUserKycVerification = cache(
  async (): Promise<KycVerification | null> => {
    const user = await getUser()
    if (!user) return null

    const supabase = await createClient()
    const { data } = await supabase
      .from("kyc_verifications")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    return data ?? null
  }
)
