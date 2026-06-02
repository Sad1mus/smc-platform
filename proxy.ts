import { NextResponse, type NextRequest } from "next/server"

import { rateLimit } from "@/lib/security/rate-limit"
import { updateSession } from "@/lib/supabase/proxy"

/**
 * Límites por IP (ventana de 60s):
 *  - Rutas de autenticación (POST): mitigación de fuerza bruta.
 *  - API: abuso general.
 */
const AUTH_ROUTES = ["/login", "/registro", "/recuperar", "/actualizar-password"]
const AUTH_LIMIT = 20
const API_LIMIT = 60
const WINDOW_MS = 60_000

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

function tooManyRequests(retryAfterSeconds: number) {
  return new NextResponse(
    JSON.stringify({
      error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(retryAfterSeconds, 1)),
      },
    }
  )
}

/**
 * Proxy de Next 16 (antes middleware): rate limiting + sesión de
 * Supabase + protección de rutas privadas.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = clientIp(request)

  // ── Rate limiting ──────────────────────────────────────────
  const isAuthPost =
    request.method === "POST" &&
    AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )

  if (isAuthPost) {
    const result = rateLimit(`auth:${ip}`, AUTH_LIMIT, WINDOW_MS)
    if (!result.allowed) {
      return tooManyRequests(result.retryAfterSeconds)
    }
  }

  if (pathname.startsWith("/api/")) {
    const result = rateLimit(`api:${ip}`, API_LIMIT, WINDOW_MS)
    if (!result.allowed) {
      return tooManyRequests(result.retryAfterSeconds)
    }
  }

  // ── Sesión + protección de rutas ───────────────────────────
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto estáticos e imágenes.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
