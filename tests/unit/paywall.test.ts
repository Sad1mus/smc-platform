import { afterEach, describe, expect, it, vi } from "vitest"

import {
  isStripeTestKeyConfigured,
  shouldEnforcePaywall,
} from "@/lib/subscription/paywall"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("isStripeTestKeyConfigured", () => {
  it("true con clave de test válida (sk_test_/rk_test_)", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc123")
    expect(isStripeTestKeyConfigured()).toBe(true)
    vi.stubEnv("STRIPE_SECRET_KEY", "rk_test_abc123")
    expect(isStripeTestKeyConfigured()).toBe(true)
  })

  it("false sin clave o con clave no-test", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "")
    expect(isStripeTestKeyConfigured()).toBe(false)
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_peligro")
    expect(isStripeTestKeyConfigured()).toBe(false)
  })
})

describe("shouldEnforcePaywall (falla CERRADO)", () => {
  it("CRÍTICO: en producción el muro SIEMPRE se aplica, aunque falte Stripe", () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("STRIPE_SECRET_KEY", "")
    expect(shouldEnforcePaywall()).toBe(true)
  })

  it("en producción se aplica también con Stripe configurado", () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc123")
    expect(shouldEnforcePaywall()).toBe(true)
  })

  it("en dev/test SÍ se aplica si Stripe está configurado", () => {
    vi.stubEnv("NODE_ENV", "test")
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc123")
    expect(shouldEnforcePaywall()).toBe(true)
  })

  it("en dev/test NO se aplica sin Stripe (comprar es imposible ahí)", () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("STRIPE_SECRET_KEY", "")
    expect(shouldEnforcePaywall()).toBe(false)
  })
})
