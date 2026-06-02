"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "@/lib/auth/validation"

export type AuthActionState = {
  error?: string
  success?: string
}

function appUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return `${base}${path}`
}

/** Registro con email/contraseña. Envía correo de verificación. */
export async function signUp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: appUrl("/auth/callback"),
    },
  })

  if (error) {
    return { error: translateAuthError(error.message) }
  }

  return {
    success:
      "Revisa tu correo: te enviamos un enlace para confirmar tu cuenta.",
  }
}

/** Login con email/contraseña. */
export async function signIn(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: translateAuthError(error.message) }
  }

  const next = (formData.get("next") as string) || "/dashboard"
  revalidatePath("/", "layout")
  redirect(next.startsWith("/") ? next : "/dashboard")
}

/** Login con Google (OAuth2 / OIDC). */
export async function signInWithGoogle(): Promise<AuthActionState> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: appUrl("/auth/callback?next=/dashboard"),
    },
  })

  if (error) {
    return { error: translateAuthError(error.message) }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: "No se pudo iniciar el flujo de Google." }
}

/** Cierra la sesión y vuelve al inicio. */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

/** Envía el correo de recuperación de contraseña. */
export async function forgotPassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: appUrl("/auth/callback?next=/actualizar-password") }
  )

  if (error) {
    return { error: translateAuthError(error.message) }
  }

  return {
    success:
      "Si el correo existe, recibirás un enlace para restablecer tu contraseña.",
  }
}

/** Actualiza la contraseña (tras seguir el enlace de recuperación). */
export async function updatePassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return { error: translateAuthError(error.message) }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

/** Traduce los errores comunes de Supabase Auth al español. */
function translateAuthError(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos."
  }
  if (msg.includes("email not confirmed")) {
    return "Tu correo aún no está confirmado. Revisa tu bandeja de entrada."
  }
  if (msg.includes("already registered")) {
    return "Ya existe una cuenta con este correo."
  }
  if (msg.includes("rate limit")) {
    return "Demasiados intentos. Espera unos minutos e intenta de nuevo."
  }
  if (msg.includes("is invalid")) {
    return "El correo electrónico no es válido o no está admitido."
  }
  if (msg.includes("should be different")) {
    return "La nueva contraseña debe ser diferente a la anterior."
  }
  return "Ocurrió un error. Intenta de nuevo."
}
