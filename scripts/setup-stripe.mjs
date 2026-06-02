#!/usr/bin/env node
/**
 * SMC — Aprovisionamiento de productos y precios en Stripe (TEST mode).
 *
 * Crea los productos/precios del dossier y guarda sus IDs en la tabla
 * plans de Supabase. Ejecutar UNA vez cuando existan las claves:
 *
 *   node scripts/setup-stripe.mjs
 *
 * Requiere en .env.local:
 *   STRIPE_SECRET_KEY=sk_test_...        (test mode obligatorio)
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...        (para escribir stripe_price_id)
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

// ── Cargar .env.local ─────────────────────────────────────────
function loadEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim()
      }
    }
  } catch {
    // .env.local puede no existir si las vars vienen del entorno
  }
}
loadEnv()

const stripeKey = process.env.STRIPE_SECRET_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (
  !stripeKey ||
  (!stripeKey.startsWith("sk_test_") && !stripeKey.startsWith("rk_test_"))
) {
  console.error(
    "✗ STRIPE_SECRET_KEY falta o no es de test (sk_test_/rk_test_)."
  )
  process.exit(1)
}
if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "✗ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY."
  )
  process.exit(1)
}

const stripe = new Stripe(stripeKey)
const supabase = createClient(supabaseUrl, serviceRoleKey)

/** Planes del dossier: bronce/plata recurrentes mensuales, prueba pago único. */
const PLANS = [
  { id: "bronce", name: "SMC Bronce", amountUsd: 1500_00, recurring: true },
  { id: "plata", name: "SMC Plata", amountUsd: 2800_00, recurring: true },
  { id: "prueba", name: "SMC Prueba", amountUsd: 250_00, recurring: false },
]

async function main() {
  console.log("Aprovisionando productos en Stripe (test mode)…\n")

  for (const plan of PLANS) {
    // Producto idempotente: buscar por metadata.plan_id antes de crear.
    const existing = await stripe.products.search({
      query: `metadata["plan_id"]:"${plan.id}" AND active:"true"`,
    })

    let product = existing.data[0]
    if (!product) {
      product = await stripe.products.create({
        name: plan.name,
        metadata: { plan_id: plan.id },
      })
      console.log(`✓ Producto creado: ${plan.name} (${product.id})`)
    } else {
      console.log(`= Producto existente: ${plan.name} (${product.id})`)
    }

    // Precio: crear si el producto no tiene uno activo equivalente.
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    })
    let price = prices.data.find(
      (p) =>
        p.unit_amount === plan.amountUsd &&
        (plan.recurring ? p.recurring?.interval === "month" : !p.recurring)
    )

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: plan.amountUsd,
        ...(plan.recurring ? { recurring: { interval: "month" } } : {}),
      })
      console.log(`✓ Precio creado: $${plan.amountUsd / 100} USD (${price.id})`)
    } else {
      console.log(
        `= Precio existente: $${plan.amountUsd / 100} USD (${price.id})`
      )
    }

    // Guardar IDs en Supabase.
    const { error } = await supabase
      .from("plans")
      .update({ stripe_product_id: product.id, stripe_price_id: price.id })
      .eq("id", plan.id)

    if (error) {
      console.error(
        `✗ Error guardando IDs en Supabase para ${plan.id}:`,
        error.message
      )
      process.exit(1)
    }
    console.log(`✓ Supabase actualizado: plans.${plan.id}\n`)
  }

  console.log(
    "Listo. Verifica con: stripe prices list --limit 10 (o el Dashboard)."
  )
}

main().catch((error) => {
  console.error("✗ Error:", error.message)
  process.exit(1)
})
