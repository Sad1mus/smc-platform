import Link from "next/link"

import { getUser } from "@/lib/auth/profile"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"

export async function SiteHeader() {
  const user = await getUser()

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#caracteristicas"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Características
            </Link>
            <Link
              href="/#planes"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              Planes
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Ir al dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/registro">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
