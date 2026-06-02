import "server-only"

import Stripe from "stripe"

/**
 * Cliente de Stripe (solo servidor).
 *
 * Lee STRIPE_SECRET_KEY del entorno. En el MVP se usa SIEMPRE una clave
 * de test (sk_test_/rk_test_). Lanzar error claro si falta, para que el
 * fallo sea visible en lugar de silencioso.
 */
let stripeSingleton: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY no está configurada. Agrega tu clave de test (sk_test_...) a .env.local."
    )
  }
  if (!key.startsWith("sk_test_") && !key.startsWith("rk_test_")) {
    throw new Error(
      "La clave de Stripe no es de test. El MVP solo opera en test mode (sk_test_/rk_test_)."
    )
  }

  if (!stripeSingleton) {
    // El SDK fija automáticamente su versión de API más reciente
    // (2026-05-27.dahlia en stripe v22).
    stripeSingleton = new Stripe(key, { typescript: true })
  }
  return stripeSingleton
}

/** true si hay clave de Stripe configurada (para degradar la UI con gracia). */
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY
  return Boolean(
    key && (key.startsWith("sk_test_") || key.startsWith("rk_test_"))
  )
}
