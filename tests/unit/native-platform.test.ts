// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  biometricGateEnabled,
  deepLinkToPath,
  isNativeApp,
  onAppUrlOpen,
  verifyBiometric,
} from "@/lib/native/platform"

type MutableGlobal = { window?: unknown }
const g = globalThis as MutableGlobal

function mockBridge(capacitor: unknown) {
  g.window = { Capacitor: capacitor }
}

afterEach(() => {
  delete g.window
  vi.unstubAllEnvs()
})

describe("isNativeApp", () => {
  it("false sin window (SSR) y en navegador puro", () => {
    expect(isNativeApp()).toBe(false)
    g.window = {}
    expect(isNativeApp()).toBe(false)
  })

  it("true solo cuando el bridge nativo lo confirma", () => {
    mockBridge({ isNativePlatform: () => true })
    expect(isNativeApp()).toBe(true)
    mockBridge({ isNativePlatform: () => false })
    expect(isNativeApp()).toBe(false)
  })
})

describe("biometricGateEnabled", () => {
  it("false por defecto (sin flag), incluso en nativo", () => {
    mockBridge({ isNativePlatform: () => true })
    expect(biometricGateEnabled()).toBe(false)
  })

  it("true solo con flag=true Y shell nativo", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE", "true")
    expect(biometricGateEnabled()).toBe(false) // sin bridge
    mockBridge({ isNativePlatform: () => true })
    expect(biometricGateEnabled()).toBe(true)
  })
})

describe("verifyBiometric", () => {
  it("sin bridge/plugin → true (la biometría no es un muro)", async () => {
    await expect(verifyBiometric("x")).resolves.toBe(true)
  })

  it("sin hardware disponible → true", async () => {
    mockBridge({
      isNativePlatform: () => true,
      Plugins: {
        NativeBiometric: {
          isAvailable: async () => ({ isAvailable: false }),
          verifyIdentity: vi.fn(),
        },
      },
    })
    await expect(verifyBiometric("x")).resolves.toBe(true)
  })

  it("verificación aprobada → true; cancelada/fallida → false", async () => {
    const verifyIdentity = vi.fn().mockResolvedValueOnce(undefined)
    mockBridge({
      Plugins: {
        NativeBiometric: {
          isAvailable: async () => ({ isAvailable: true }),
          verifyIdentity,
        },
      },
    })
    await expect(verifyBiometric("x")).resolves.toBe(true)

    verifyIdentity.mockRejectedValueOnce(new Error("cancelado"))
    await expect(verifyBiometric("x")).resolves.toBe(false)
  })
})

describe("deepLinkToPath", () => {
  it("smc:// → ruta interna", () => {
    expect(deepLinkToPath("smc://dashboard")).toBe("/dashboard")
    expect(deepLinkToPath("smc://dashboard/plan")).toBe("/dashboard/plan")
  })

  it("universal link https → pathname", () => {
    expect(deepLinkToPath("https://smc.example.com/dashboard")).toBe(
      "/dashboard"
    )
  })

  it("URL inválida → null", () => {
    expect(deepLinkToPath("no-es-una-url")).toBe(null)
  })
})

describe("onAppUrlOpen", () => {
  it("navegador puro: no registra nada y el unsubscribe es no-op", () => {
    const cb = vi.fn()
    const unsub = onAppUrlOpen(cb)
    expect(cb).not.toHaveBeenCalled()
    expect(() => unsub()).not.toThrow()
  })

  it("shell nativo: traduce la URL y notifica; unsubscribe remueve el listener", async () => {
    const remove = vi.fn()
    let listener: ((data: { url: string }) => void) | null = null
    mockBridge({
      isNativePlatform: () => true,
      Plugins: {
        App: {
          addListener: (_e: string, cb: (data: { url: string }) => void) => {
            listener = cb
            return { remove }
          },
        },
      },
    })

    const paths: string[] = []
    const unsub = onAppUrlOpen((p) => paths.push(p))
    listener!({ url: "smc://dashboard/plan" })
    listener!({ url: "::invalida::" })
    expect(paths).toEqual(["/dashboard/plan"])

    unsub()
    await new Promise((r) => setTimeout(r, 0))
    expect(remove).toHaveBeenCalled()
  })
})
