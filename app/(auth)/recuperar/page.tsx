import type { Metadata } from "next"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar contraseña — SMC",
  description: "Restablece la contraseña de tu cuenta SMC.",
}

export default function RecuperarPage() {
  return <ForgotPasswordForm />
}
