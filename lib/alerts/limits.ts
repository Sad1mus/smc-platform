/**
 * Límite de alertas de precio por plan.
 *
 * La tabla `plans` no tiene una columna de "tope de alertas" (gap conocido del
 * seed), así que el límite se mapea acá por id de plan, documentado. Si en el
 * futuro se agrega la columna, esta lógica pasa a leerla.
 *
 * Infinity = sin límite. Función pura para poder testearla en aislamiento.
 */
const ALERT_LIMITS: Record<string, number> = {
  prueba: 3,
  bronce: 5,
  plata: Infinity,
  vip: Infinity,
}

/** Tope de alertas para un plan. null/desconocido → 3 (mínimo conservador). */
export function alertLimitForPlan(planId: string | null | undefined): number {
  if (!planId) return 3
  return ALERT_LIMITS[planId] ?? 3
}

/** ¿Puede crear una alerta más, dado su plan y cuántas tiene activas? */
export function canCreateAlert(
  planId: string | null | undefined,
  currentCount: number
): boolean {
  return currentCount < alertLimitForPlan(planId)
}
