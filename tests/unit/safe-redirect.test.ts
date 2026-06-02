import { describe, expect, it } from "vitest"

import { safeRedirectPath } from "@/lib/auth/safe-redirect"

describe("safeRedirectPath (mitigación de open redirect)", () => {
  it("acepta rutas internas válidas", () => {
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard")
    expect(safeRedirectPath("/dashboard/plan?estado=exitoso")).toBe(
      "/dashboard/plan?estado=exitoso"
    )
  })

  it("bloquea URLs protocolo-relativas (//evil.com)", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/dashboard")
    expect(safeRedirectPath("//evil.com/phishing")).toBe("/dashboard")
  })

  it("bloquea rutas con backslash (/\\evil.com)", () => {
    expect(safeRedirectPath("/\\evil.com")).toBe("/dashboard")
  })

  it("bloquea URLs absolutas externas", () => {
    expect(safeRedirectPath("https://evil.com")).toBe("/dashboard")
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/dashboard")
  })

  it("usa el fallback ante valores vacíos o nulos", () => {
    expect(safeRedirectPath(null)).toBe("/dashboard")
    expect(safeRedirectPath(undefined)).toBe("/dashboard")
    expect(safeRedirectPath("")).toBe("/dashboard")
  })

  it("respeta un fallback personalizado", () => {
    expect(safeRedirectPath("//evil.com", "/login")).toBe("/login")
  })
})
