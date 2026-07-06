"use client"

import { useActionState } from "react"
import Link from "next/link"

import { forgotPassword, type AuthActionState } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthActionState = {}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPassword,
    initialState
  )

  return (
    <Card variant="hairline">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Recupera tu contraseña</CardTitle>
        <CardDescription>
          Te enviaremos un enlace para restablecerla
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />
          </div>
          {state.error ? (
            <p role="alert" className="text-destructive text-sm">
              {state.error}
            </p>
          ) : null}
          {state.success ? (
            <p role="status" className="text-sm text-emerald-600">
              {state.success}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Enviando…" : "Enviar enlace"}
          </Button>
        </form>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
