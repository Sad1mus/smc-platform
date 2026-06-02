import type { Metadata } from "next"

import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Crea tu cuenta — SMC",
  description: "Regístrate para acceder a la plataforma SMC.",
}

export default function RegistroPage() {
  return <RegisterForm />
}
