import { Check, Minus } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import type { Plan } from "@/types/database"

/**
 * Tabla comparativa (spec §/precios #2): filas = features REALES de la columna
 * `features` de la tabla plans; columnas = los planes. No se inventan features.
 *
 * Las features de la DB son acumulativas ("Todo lo del plan X"): se resuelve esa
 * herencia para saber qué incluye realmente cada plan, pero SOLO con strings que
 * ya existen en la DB. Gap conocido documentado en docs/specs/product.md
 * (§/precios): los niveles de soporte están modelados como aditivos, no
 * exclusivos, así que un plan superior puede mostrar el soporte del inferior
 * además del suyo — se refleja tal cual la DB, sin corregir a mano.
 */
function planFeatures(plan: Plan): string[] {
  return Array.isArray(plan.features) ? (plan.features as string[]) : []
}

const INHERITS = /^Todo lo del plan (.+)$/i

/** Expande "Todo lo del plan X" al set real de features de ese plan. */
function resolveFeatures(plan: Plan, byName: Map<string, Plan>): string[] {
  const out: string[] = []
  for (const feature of planFeatures(plan)) {
    const match = feature.match(INHERITS)
    if (match) {
      const parent = byName.get(match[1].trim().toLowerCase())
      if (parent) {
        for (const inherited of resolveFeatures(parent, byName)) {
          if (!out.includes(inherited)) out.push(inherited)
        }
      }
    } else if (!out.includes(feature)) {
      out.push(feature)
    }
  }
  return out
}

function formatPrice(plan: Plan): string {
  if (plan.is_custom || plan.price_usd === null) return "Personalizado"
  return `$${Number(plan.price_usd).toLocaleString("en-US")}`
}

export async function PlanComparison() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("sort_order")

  const plans = (data ?? []) as Plan[]
  if (plans.length === 0) return null

  const byName = new Map(plans.map((p) => [p.name.toLowerCase(), p]))
  const resolved = new Map(plans.map((p) => [p.id, resolveFeatures(p, byName)]))

  // Filas = todas las features atómicas, en orden de aparición por sort_order.
  const rows: string[] = []
  for (const plan of plans) {
    for (const feature of resolved.get(plan.id) ?? []) {
      if (!rows.includes(feature)) rows.push(feature)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <h2 className="text-h2 font-bold tracking-tight">Tabla comparativa</h2>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Qué incluye cada plan, en detalle.
      </p>
      <div className="border-border mt-8 overflow-x-auto rounded-lg border border-dashed">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-border/70 border-b border-dashed">
              <th
                scope="col"
                className="text-muted-foreground p-4 text-left font-medium"
              >
                Característica
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className="p-4 text-center font-semibold"
                >
                  <span className="block">{plan.name}</span>
                  <span className="text-gold block font-mono text-xs font-normal tabular-nums">
                    {formatPrice(plan)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((feature) => (
              <tr
                key={feature}
                className="border-border/60 border-b border-dashed last:border-b-0"
              >
                <th
                  scope="row"
                  className="text-foreground p-4 text-left font-normal"
                >
                  {feature}
                </th>
                {plans.map((plan) => {
                  const has = (resolved.get(plan.id) ?? []).includes(feature)
                  return (
                    <td key={plan.id} className="p-4 text-center">
                      {has ? (
                        <Check
                          aria-label="Incluido"
                          className="text-gold mx-auto size-4"
                        />
                      ) : (
                        <Minus
                          aria-label="No incluido"
                          className="text-muted-foreground/40 mx-auto size-4"
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
