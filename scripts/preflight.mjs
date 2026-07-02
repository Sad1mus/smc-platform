#!/usr/bin/env node
/**
 * SMC — Pre-flight de go-live.
 *
 * Verifica que TODAS las variables de entorno requeridas estén presentes y que
 * las integraciones externas respondan. Convierte el paso manual de "pegar claves"
 * en "un comando dice OK".
 *
 *   node scripts/preflight.mjs
 *
 * Sin claves: reporta los faltantes y sale con código != 0 (sin crashear).
 * NUNCA imprime el valor de un secreto: solo presente/ausente y estado de salud.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

// ── Cargar .env.local y .env (opcionales) ─────────────────────
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), "utf8")
      for (const line of content.split("\n")) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
      }
    } catch {
      /* archivo opcional: si no existe, se ignora */
    }
  }
}
loadEnv()

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SENTRY_DSN",
  "SENTRY_AUTH_TOKEN",
  "RESEND_API_KEY",
  "EMAIL_FROM",
]

const present = (k) => Boolean(process.env[k] && process.env[k].length > 0)

// ── 1) Presencia de variables ─────────────────────────────────
const missing = []
console.log("\n== Variables de entorno ==")
for (const k of REQUIRED) {
  const ok = present(k)
  if (!ok) missing.push(k)
  console.log(`  ${ok ? "✓" : "✗"} ${k}${ok ? "" : "  (FALTA)"}`)
}

// ── 2) Salud de integraciones (solo si hay clave; con timeout) ─
async function httpOk(url, options = {}, okStatuses = [200]) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return okStatuses.includes(res.status)
  } finally {
    clearTimeout(timer)
  }
}

async function ping(name, fn) {
  try {
    const ok = await fn()
    console.log(
      `  ${ok ? "✓" : "✗"} ${name}${ok ? "" : "  (sin respuesta OK)"}`
    )
    return ok
  } catch (e) {
    console.log(`  ✗ ${name}  (error: ${e.message})`)
    return false
  }
}

console.log("\n== Salud de integraciones ==")
let healthFails = 0

if (present("NEXT_PUBLIC_SUPABASE_URL")) {
  if (
    !(await ping("Supabase", () =>
      httpOk(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`)
    ))
  )
    healthFails++
} else console.log("  – Supabase: omitido (falta URL)")

if (present("STRIPE_SECRET_KEY")) {
  if (
    !(await ping("Stripe", () =>
      httpOk("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      })
    ))
  )
    healthFails++
} else console.log("  – Stripe: omitido (falta STRIPE_SECRET_KEY)")

if (present("RESEND_API_KEY")) {
  if (
    !(await ping("Resend", () =>
      httpOk("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      })
    ))
  )
    healthFails++
} else console.log("  – Resend: omitido (falta RESEND_API_KEY)")

if (present("NEXT_PUBLIC_SENTRY_DSN")) {
  const ok = /^https:\/\/.+@.+\/\d+$/.test(process.env.NEXT_PUBLIC_SENTRY_DSN)
  console.log(`  ${ok ? "✓" : "✗"} Sentry DSN (formato)`)
  if (!ok) healthFails++
} else console.log("  – Sentry: omitido (falta DSN)")

// ── 3) Resumen ────────────────────────────────────────────────
console.log("\n== Resumen ==")
console.log(
  `  Faltan ${missing.length} variable(s); ${healthFails} chequeo(s) de salud no OK.`
)
const ready = missing.length === 0 && healthFails === 0
console.log(
  ready ? "  ✅ LISTO para go-live.\n" : "  ⚠️  AÚN NO listo (ver arriba).\n"
)
process.exit(ready ? 0 : 1)
