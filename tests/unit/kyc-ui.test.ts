import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const h = vi.hoisted(() => ({
  getUser: vi.fn(),
  getCurrentUserKycVerification: vi.fn(),
  upsert: vi.fn(),
  revalidatePath: vi.fn(),
}))

vi.mock("@/lib/auth/profile", () => ({ getUser: h.getUser }))
vi.mock("@/lib/kyc/queries", () => ({
  getCurrentUserKycVerification: h.getCurrentUserKycVerification,
}))
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({ upsert: h.upsert }),
  }),
}))
vi.mock("next/cache", () => ({ revalidatePath: h.revalidatePath }))

import { KycCard } from "@/components/dashboard/kyc-card"
import { startKycVerification } from "@/lib/kyc/actions"

/** Busca un texto en el árbol de elementos React devuelto por el RSC. */
function treeIncludes(node: unknown, text: string): boolean {
  if (typeof node === "string") return node.includes(text)
  if (Array.isArray(node))
    return node.some((child) => treeIncludes(child, text))
  if (node && typeof node === "object") {
    const props = (node as { props?: Record<string, unknown> }).props
    return props ? treeIncludes(Object.values(props), text) : false
  }
  return false
}

beforeEach(() => vi.clearAllMocks())
afterEach(() => vi.unstubAllEnvs())

describe("KycCard (flag-gated)", () => {
  it("flag off (default) → NO renderiza nada, la plataforma queda idéntica", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "")
    expect(await KycCard()).toBeNull()
    expect(h.getCurrentUserKycVerification).not.toHaveBeenCalled()
  })

  it("flag on sin fila → estado 'No verificado' con CTA", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "true")
    h.getCurrentUserKycVerification.mockResolvedValue(null)

    const el = await KycCard()
    expect(el).toBeTruthy()
    expect(treeIncludes(el, "No verificado")).toBe(true)
  })

  it("flag on con verificación aprobada → estado 'Verificada'", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "true")
    h.getCurrentUserKycVerification.mockResolvedValue({ status: "approved" })

    const el = await KycCard()
    expect(treeIncludes(el, "Verificada")).toBe(true)
  })
})

describe("startKycVerification (server action, escribe via service_role)", () => {
  it("flag off → error amable, sin tocar la base", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "")
    const result = await startKycVerification()
    expect(result.error).toBeTruthy()
    expect(h.upsert).not.toHaveBeenCalled()
  })

  it("sin sesión → error de sesión", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "true")
    h.getUser.mockResolvedValue(null)
    const result = await startKycVerification()
    expect(result.error).toMatch(/sesión/i)
  })

  it("usuario normal → el stub aprueba y se upsertea con onConflict user_id", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "true")
    h.getUser.mockResolvedValue({
      id: "u1",
      email: "cliente@correo.com",
      user_metadata: {},
    })
    h.upsert.mockResolvedValue({ error: null })

    const result = await startKycVerification()

    expect(result.error).toBeUndefined()
    expect(h.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "u1",
        status: "approved",
        provider: "stub",
        provider_ref: "stub:u1",
      }),
      { onConflict: "user_id" }
    )
    expect(h.revalidatePath).toHaveBeenCalledWith("/dashboard/plan")
  })

  it("email +kyc-reject → el stub rechaza y queda registrado como rejected", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "true")
    h.getUser.mockResolvedValue({
      id: "u2",
      email: "cliente+kyc-reject@correo.com",
      user_metadata: {},
    })
    h.upsert.mockResolvedValue({ error: null })

    await startKycVerification()

    expect(h.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ status: "rejected" }),
      { onConflict: "user_id" }
    )
  })

  it("fallo de escritura → error amable (degradación limpia)", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_KYC", "true")
    h.getUser.mockResolvedValue({
      id: "u3",
      email: "cliente@correo.com",
      user_metadata: {},
    })
    h.upsert.mockResolvedValue({ error: { message: "boom" } })

    const result = await startKycVerification()
    expect(result.error).toBeTruthy()
    expect(h.revalidatePath).not.toHaveBeenCalled()
  })
})
