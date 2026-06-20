import { NextResponse } from "next/server"

import { isStripeTestKeyConfigured } from "@/lib/subscription/paywall"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/**
 * Health check para uptime monitoring. No expone secretos: solo estados
 * (ok / error / configured / not_configured). 200 si la app puede servir;
 * 503 si una dependencia esencial (Supabase) no responde.
 */
export async function GET() {
  const checks: Record<string, string> = {}

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("plans").select("id").limit(1)
    checks.supabase = error ? "error" : "ok"
  } catch {
    checks.supabase = "error"
  }

  checks.stripe = isStripeTestKeyConfigured() ? "configured" : "not_configured"
  checks.sentry = process.env.NEXT_PUBLIC_SENTRY_DSN
    ? "configured"
    : "not_configured"

  const healthy = checks.supabase === "ok"
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  )
}
