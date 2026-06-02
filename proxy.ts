import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/proxy"

/**
 * Proxy de Next 16 (antes middleware): refresca la sesión de
 * Supabase y protege las rutas privadas.
 */
export async function proxy(request: NextRequest) {
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
