import { NextResponse } from "next/server"

import { sendWelcomeEmail } from "@/lib/email/send"
import { safeRedirectPath } from "@/lib/auth/safe-redirect"
import { createClient } from "@/lib/supabase/server"

/**
 * Callback de OAuth (Google) y de enlaces de correo (PKCE).
 * Intercambia el código por una sesión y redirige.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const safeNext = safeRedirectPath(searchParams.get("next"))

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Bienvenida en la primera confirmación de cuenta (stub sin Resend).
      const user = data.user
      if (user?.email && user.created_at === user.last_sign_in_at) {
        await sendWelcomeEmail(
          user.email,
          (user.user_metadata?.full_name as string | undefined) ?? null
        )
      }
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=No se pudo completar la autenticación`
  )
}
