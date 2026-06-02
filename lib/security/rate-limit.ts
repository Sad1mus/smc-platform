/**
 * Rate limiter de ventana deslizante, en memoria.
 *
 * Alcance del MVP: protege contra fuerza bruta y abuso básico por
 * instancia de servidor. En producción (Vercel) se complementa con el
 * WAF y la protección DDoS del borde; para límites distribuidos
 * multi-instancia, migrar a Upstash Redis (Fase 1 del dossier).
 */

type WindowEntry = {
  timestamps: number[]
}

const store = new Map<string, WindowEntry>()

/** Limpieza perezosa para que el Map no crezca sin límite. */
const MAX_KEYS = 10_000

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * Registra un intento para `key` y devuelve si está permitido.
 *
 * @param key       Identificador (ej. `login:<ip>`)
 * @param limit     Máximo de intentos dentro de la ventana
 * @param windowMs  Tamaño de la ventana en milisegundos
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()

  if (store.size > MAX_KEYS) {
    store.clear()
  }

  const entry = store.get(key) ?? { timestamps: [] }
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)

  if (entry.timestamps.length >= limit) {
    store.set(key, entry)
    const oldest = entry.timestamps[0]
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((oldest + windowMs - now) / 1000),
    }
  }

  entry.timestamps.push(now)
  store.set(key, entry)
  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    retryAfterSeconds: 0,
  }
}

/** Resetea el estado (solo para tests). */
export function resetRateLimiter() {
  store.clear()
}
