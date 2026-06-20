/**
 * Política del muro de pago (función pura, sin dependencias de servidor para
 * poder testearla en aislamiento).
 */

/**
 * ¿Hay una clave de Stripe de test válida en el entorno?
 * Es la fuente única de verdad de "Stripe está configurado".
 */
export function isStripeTestKeyConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY
  return Boolean(
    key && (key.startsWith("sk_test_") || key.startsWith("rk_test_"))
  )
}

/**
 * ¿Debe aplicarse el muro de pago en este request?
 *
 * Falla CERRADO: en producción el muro SIEMPRE se aplica, aunque falte
 * STRIPE_SECRET_KEY. Una mala configuración nunca debe regalar el acceso de
 * pago en silencio.
 *
 * En desarrollo/test el muro solo se aplica si Stripe está configurado, para
 * no bloquear a quien trabaja sin claves (comprar un plan es imposible ahí).
 */
export function shouldEnforcePaywall(): boolean {
  if (process.env.NODE_ENV === "production") return true
  return isStripeTestKeyConfigured()
}
