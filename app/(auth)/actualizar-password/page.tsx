import type { Metadata } from "next"

import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export const metadata: Metadata = {
  title: "Nueva contraseña — SMC",
  description: "Define una nueva contraseña para tu cuenta SMC.",
}

export default function ActualizarPasswordPage() {
  return <UpdatePasswordForm />
}
