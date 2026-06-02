/**
 * Sanitiza rutas de redirección controladas por el usuario.
 *
 * Bloquea open redirects: solo se aceptan rutas internas absolutas
 * ("/algo"), nunca protocolo-relativas ("//evil.com", "/\\evil.com")
 * ni URLs externas.
 */
export function safeRedirectPath(
  path: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.startsWith("/\\")
  ) {
    return fallback
  }
  return path
}
