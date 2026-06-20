import "server-only"

/**
 * Logging estructurado (JSON) para los caminos críticos del servidor.
 * Salida a stdout/stderr (los recoge Vercel). NO incluir PII en `fields`.
 */
export type LogFields = Record<string, unknown>

function emit(level: "info" | "warn" | "error", message: string, fields: LogFields) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    ...fields,
  })
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else console.log(line)
}

export const log = {
  info: (message: string, fields: LogFields = {}) => emit("info", message, fields),
  warn: (message: string, fields: LogFields = {}) => emit("warn", message, fields),
  error: (message: string, fields: LogFields = {}) => emit("error", message, fields),
}

/**
 * Loguea estructurado y, si hay DSN, captura la excepción en Sentry.
 * Sin DSN funciona como stub (solo log). No pasar PII en `fields`.
 */
export async function captureError(
  message: string,
  error: unknown,
  fields: LogFields = {}
): Promise<void> {
  log.error(message, {
    ...fields,
    error: error instanceof Error ? error.message : String(error),
  })
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = await import("@sentry/nextjs")
    Sentry.captureException(error, { extra: { event: message, ...fields } })
  }
}

/** Id de correlación para encadenar logs de un mismo request. */
export function newCorrelationId(): string {
  return crypto.randomUUID()
}
