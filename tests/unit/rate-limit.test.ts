import { afterEach, describe, expect, it, vi } from "vitest"

import { rateLimit, resetRateLimiter } from "@/lib/security/rate-limit"

describe("rateLimit", () => {
  afterEach(() => {
    resetRateLimiter()
    vi.useRealTimers()
  })

  it("permite solicitudes dentro del límite", () => {
    for (let i = 0; i < 5; i++) {
      const result = rateLimit("test:1.2.3.4", 5, 60_000)
      expect(result.allowed).toBe(true)
    }
  })

  it("bloquea la solicitud que excede el límite", () => {
    for (let i = 0; i < 5; i++) {
      rateLimit("test:1.2.3.4", 5, 60_000)
    }
    const result = rateLimit("test:1.2.3.4", 5, 60_000)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("mantiene límites independientes por clave", () => {
    for (let i = 0; i < 5; i++) {
      rateLimit("auth:1.1.1.1", 5, 60_000)
    }
    expect(rateLimit("auth:1.1.1.1", 5, 60_000).allowed).toBe(false)
    expect(rateLimit("auth:2.2.2.2", 5, 60_000).allowed).toBe(true)
  })

  it("libera el cupo cuando la ventana expira", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-02T00:00:00Z"))

    for (let i = 0; i < 5; i++) {
      rateLimit("test:expira", 5, 60_000)
    }
    expect(rateLimit("test:expira", 5, 60_000).allowed).toBe(false)

    // Avanzar más allá de la ventana
    vi.advanceTimersByTime(61_000)
    expect(rateLimit("test:expira", 5, 60_000).allowed).toBe(true)
  })

  it("reporta los intentos restantes", () => {
    expect(rateLimit("test:restantes", 3, 60_000).remaining).toBe(2)
    expect(rateLimit("test:restantes", 3, 60_000).remaining).toBe(1)
    expect(rateLimit("test:restantes", 3, 60_000).remaining).toBe(0)
  })
})
