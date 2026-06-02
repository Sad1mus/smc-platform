"use client"

import { useActionState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { signIn, type AuthActionState } from "@/lib/auth/actions"
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

export function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/dashboard"
  const urlError = searchParams.get("error")
  const [state, formAction, pending] = useActionState(signIn, initialState)

  const error = state.error ?? urlError

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Inicia sesión</CardTitle>
        <CardDescription>
          Accede a tu cuenta para ver los mercados en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href="/recuperar"
                className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
              >
                ¿La olvidaste?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error ? (
            <p
              role="alert"
              data-testid="login-error"
              className="text-destructive text-sm"
            >
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>
        <div className="text-muted-foreground after:border-border relative my-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            o continúa con
          </span>
        </div>
        <GoogleButton />
        <p className="text-muted-foreground mt-4 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="text-foreground underline underline-offset-4"
          >
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
