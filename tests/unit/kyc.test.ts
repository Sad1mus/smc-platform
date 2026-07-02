import { afterEach, describe, expect, it, vi } from "vitest"

import {
  getKycProvider,
  isKycEnabled,
  StubKycProvider,
} from "@/lib/kyc/provider"

const h = vi.hoisted(() => ({
  maybeSingle: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: h.maybeSingle }),
      }),
    }),
  }),
}))

afterEach(() => {
  vi.unstubAllEnvs()
  h.maybeSingle.mockReset()
})

describe("StubKycProvider (determinista, según spec kyc.md)", () => {
  const stub = new StubKycProvider()

  it("aprueba cualquier email normal", async () => {
    const result = await stub.startVerification({
      userId: "u1",
      email: "cliente@correo.com",
      fullName: "Cliente",
    })
    expect(result.status).toBe("approved")
    expect(result.providerRef).toBe("stub:u1")
  })

  it("rechaza emails con +kyc-reject (case-insensitive)", async () => {
    const result = await stub.startVerification({
      userId: "u2",
      email: "persona+KYC-REJECT@correo.com",
      fullName: null,
    })
    expect(result.status).toBe("rejected")
  })

  it("deja en pendiente emails con +kyc-pending", async () => {
    const result = await stub.startVerification({
      userId: "u3",
      email: "persona+kyc-pending@correo.com",
      fullName: null,
    })
    expect(result.status).toBe("pending")
  })

  it("es determinista: mismo input, mismo output", async () => {
    const request = {
      userId: "u4",
      email: "estable@correo.com",
      fullName: null,
    }
    const first = await stub.startVerification(request)
    const second = await stub.startVerification(request)
    expect(second).toEqual(first)
  })
})

describe("getKycProvider", () => {
  it("devuelve el stub en Fase 1", () => {
    expect(getKycProvider().name).toBe("stub")
  })
})

describe("isKycEnabled (flag default off)", () => {
  it("false sin flag o con valores no-true", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "")
    expect(isKycEnabled()).toBe(false)
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "1")
    expect(isKycEnabled()).toBe(false)
  })

  it("true solo con el valor exacto 'true'", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "true")
    expect(isKycEnabled()).toBe(true)
  })
})

describe("getKycStatus (mapeo de estado)", () => {
  it("sin fila registrada → unverified", async () => {
    h.maybeSingle.mockResolvedValue({ data: null })
    const { getKycStatus } = await import("@/lib/kyc/queries")
    expect(await getKycStatus("u1")).toBe("unverified")
  })

  it("con fila → devuelve el estado de la fila", async () => {
    h.maybeSingle.mockResolvedValue({ data: { status: "approved" } })
    const { getKycStatus } = await import("@/lib/kyc/queries")
    expect(await getKycStatus("u1")).toBe("approved")
  })
})
