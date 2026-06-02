/**
 * Instrumentación de Next.js — Sentry (servidor y edge).
 *
 * Solo se inicializa si NEXT_PUBLIC_SENTRY_DSN está configurada;
 * sin DSN funciona como stub (sin overhead ni errores).
 */
export async function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return
  }

  const Sentry = await import("@sentry/nextjs")

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    // MVP: muestreo conservador para mantenerse en el plan gratuito.
    tracesSampleRate: 0.1,
    // Nunca enviar PII automáticamente.
    sendDefaultPii: false,
  })
}

export async function onRequestError(
  ...args: Parameters<(typeof import("@sentry/nextjs"))["captureRequestError"]>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return
  }
  const Sentry = await import("@sentry/nextjs")
  Sentry.captureRequestError(...args)
}
