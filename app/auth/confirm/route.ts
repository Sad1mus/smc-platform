import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

import { safeRedirectPath } from "@/lib/auth/safe-redirect"
import { createClient } from "@/lib/supabase/server"

/**
 * Confirmación de correo vía token_hash (enlaces de verificación
 * y de recuperación de contraseña).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const safeNext = safeRedirectPath(searchParams.get("next"))

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    })
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=El enlace no es válido o expiró`
  )
}
