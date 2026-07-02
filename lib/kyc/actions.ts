"use server"

import { revalidatePath } from "next/cache"

import { getUser } from "@/lib/auth/profile"
import { getKycProvider, isKycEnabled } from "@/lib/kyc/provider"
import { createAdminClient } from "@/lib/supabase/admin"

export type KycActionResult = {
  error?: string
}

/**
 * Inicia (o reintenta) la verificación de identidad del usuario actual.
 * Escribe kyc_verifications vía service_role (RLS no permite escrituras
 * de authenticated); el estado resultante lo decide el proveedor.
 */
export async function startKycVerification(): Promise<KycActionResult> {
  if (!isKycEnabled()) {
    return { error: "La verificación de identidad no está habilitada." }
  }

  const user = await getUser()
  if (!user) {
    return { error: "Tu sesión expiró. Vuelve a iniciar sesión." }
  }

  const provider = getKycProvider()
  const outcome = await provider.startVerification({
    userId: user.id,
    email: user.email ?? "",
    fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
  })

  try {
    const admin = createAdminClient()
    const { error } = await admin.from("kyc_verifications").upsert(
      {
        user_id: user.id,
        status: outcome.status,
        provider: provider.name,
        provider_ref: outcome.providerRef,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

    if (error) {
      return {
        error: "No pudimos registrar la verificación. Intenta de nuevo.",
      }
    }
  } catch {
    // Sin SUPABASE_SERVICE_ROLE_KEY el servicio degrada con error amable.
    return { error: "La verificación no está disponible en este momento." }
  }

  revalidatePath("/dashboard/plan")
  return {}
}
