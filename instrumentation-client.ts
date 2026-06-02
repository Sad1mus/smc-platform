/**
 * Instrumentación de Sentry en el cliente (navegador).
 *
 * Solo se inicializa si NEXT_PUBLIC_SENTRY_DSN está configurada;
 * sin DSN funciona como stub.
 */
import * as Sentry from "@sentry/nextjs"

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    // Replays solo en errores, para no consumir cuota.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.5,
  })
}

/** Hook de navegación para trazas de router (no-op sin DSN). */
export const onRouterTransitionStart = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? Sentry.captureRouterTransitionStart
  : () => {}
