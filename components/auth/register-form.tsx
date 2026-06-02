"use client"

import { useActionState } from "react"
import Link from "next/link"

import { signUp, type AuthActionState } from "@/lib/auth/actions"
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
import { GoogleButton } from "@/components/auth/google-button"

const initialState: AuthActionState = {}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState)

  if (state.success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Confirma tu correo</CardTitle>
          <CardDescription data-testid="register-success">
            {state.success}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
        <CardDescription>
          Empieza a explorar los mercados en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </div>
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            <p className="text-muted-foreground text-xs">
              Mínimo 8 caracteres, con mayúscula, minúscula y número.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          {state.error ? (
            <p
              role="alert"
              data-testid="register-error"
              className="text-destructive text-sm"
            >
              {state.error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </form>
        <div className="text-muted-foreground after:border-border relative my-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            o continúa con
          </span>
        </div>
        <GoogleButton />
        <p className="text-muted-foreground mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
