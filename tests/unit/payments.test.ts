// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Handles de mock (hoisted para usarlos en las factories y en los tests).
const h = vi.hoisted(() => ({
  getHeader: vi.fn(),
  constructEventAsync: vi.fn(),
  customersCreate: vi.fn(),
  sessionsCreate: vi.fn(),
  adminInsert: vi.fn(),
  adminUpdateEq: vi.fn(),
  getProfile: vi.fn(),
  planSingle: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

vi.mock("next/headers", () => ({
  headers: async () => ({ get: h.getHeader }),
}))
vi.mock("next/navigation", () => ({ redirect: h.redirect }))
vi.mock("@/lib/stripe/client", () => ({
  getStripe: () => ({
    webhooks: { constructEventAsync: h.constructEventAsync },
    customers: { create: h.customersCreate },
    checkout: { sessions: { create: h.sessionsCreate } },
  }),
  isStripeConfigured: () => true,
}))
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      insert: h.adminInsert,
      update: () => ({ eq: h.adminUpdateEq }),
      select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }),
    }),
  }),
}))
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({
      select: () => ({ eq: () => ({ eq: () => ({ single: h.planSingle }) }) }),
    }),
  }),
}))
vi.mock("@/lib/auth/profile", () => ({ getProfile: h.getProfile }))
vi.mock("@/lib/email/send", () => ({
  sendPaymentConfirmationEmail: vi.fn(),
  sendWelcomeEmail: vi.fn(),
}))
vi.mock("@/lib/observability/logger", () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  captureError: vi.fn(),
}))

import { POST } from "@/app/api/webhooks/stripe/route"
import { createCheckoutSession } from "@/lib/stripe/actions"

function webhookRequest(body = "{}") {
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test")
})
afterEach(() => vi.unstubAllEnvs())

describe("webhook de Stripe", () => {
  it("rechaza firma inválida con 400", async () => {
    h.getHeader.mockReturnValue("sig_invalida")
    h.constructEventAsync.mockRejectedValue(new Error("bad signature"))

    const res = await POST(webhookRequest())

    expect(res.status).toBe(400)
    expect(h.adminInsert).not.toHaveBeenCalled()
  })

  it("es idempotente: evento duplicado (23505) responde 200 sin reprocesar", async () => {
    h.getHeader.mockReturnValue("sig_ok")
    h.constructEventAsync.mockResolvedValue({
      id: "evt_1",
      type: "customer.subscription.updated",
      created: 1,
      livemode: false,
      data: { object: { id: "sub_1", customer: "cus_1" } },
    })
    h.adminInsert.mockResolvedValue({ error: { code: "23505" } })

    const res = await POST(webhookRequest())
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.duplicated).toBe(true)
  })
})

describe("createCheckoutSession", () => {
  it("reutiliza el stripe_customer_id existente y NO crea un customer duplicado", async () => {
    h.getProfile.mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      full_name: "A",
      stripe_customer_id: "cus_existente",
    })
    h.planSingle.mockResolvedValue({
      data: { id: "bronce", is_custom: false, stripe_price_id: "price_1" },
    })
    h.sessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/x" })

    // redirect() lanza por diseño; lo capturamos.
    await expect(createCheckoutSession("bronce")).rejects.toThrow("NEXT_REDIRECT")

    expect(h.customersCreate).not.toHaveBeenCalled()
    expect(h.sessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_existente" })
    )
  })
})
