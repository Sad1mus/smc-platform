// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"

const h = vi.hoisted(() => ({
  getUser: vi.fn(),
  isAdmin: vi.fn(),
  getProfile: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

vi.mock("next/navigation", () => ({ redirect: h.redirect }))
vi.mock("@/lib/auth/profile", () => ({
  getUser: h.getUser,
  isAdmin: h.isAdmin,
  getProfile: h.getProfile,
}))
// Componentes cliente del header: se neutralizan para aislar el gate de acceso.
vi.mock("@/components/brand/logo", () => ({ Logo: () => null }))
vi.mock("@/components/dashboard/theme-toggle", () => ({
  ThemeToggle: () => null,
}))
vi.mock("@/components/dashboard/user-nav", () => ({ UserNav: () => null }))

import AdminLayout from "@/app/admin/layout"

beforeEach(() => vi.clearAllMocks())

describe("acceso a /admin (RBAC)", () => {
  it("no autenticado → redirige a /login?next=/admin", async () => {
    h.getUser.mockResolvedValue(null)

    await expect(AdminLayout({ children: null })).rejects.toThrow(
      "REDIRECT:/login?next=/admin"
    )
    expect(h.isAdmin).not.toHaveBeenCalled()
  })

  it("autenticado NO-admin → redirige a /dashboard (bloqueado)", async () => {
    h.getUser.mockResolvedValue({ id: "u1", email: "user@b.com" })
    h.isAdmin.mockResolvedValue(false)

    await expect(AdminLayout({ children: null })).rejects.toThrow(
      "REDIRECT:/dashboard"
    )
  })

  it("admin → NO redirige, renderiza el panel", async () => {
    h.getUser.mockResolvedValue({ id: "u1", email: "admin@b.com" })
    h.isAdmin.mockResolvedValue(true)
    h.getProfile.mockResolvedValue({ full_name: "Admin", role: "admin" })

    const el = await AdminLayout({ children: "contenido" })

    expect(el).toBeTruthy()
    expect(h.redirect).not.toHaveBeenCalled()
  })
})
