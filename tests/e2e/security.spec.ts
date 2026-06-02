import { expect, test } from "@playwright/test"

/**
 * Tests de seguridad (Check de la tarea 8 del goal-queue).
 *
 * NOTA: este archivo corre al final de la suite (orden alfabético con
 * workers=1) porque el test de rate limiting agota el cupo de POSTs a
 * /login para la IP local.
 */

test.describe("Headers de seguridad", () => {
  test("la landing responde con todos los headers OWASP", async ({
    request,
  }) => {
    const response = await request.get("/")
    expect(response.status()).toBe(200)

    const headers = response.headers()

    expect(headers["content-security-policy"]).toBeTruthy()
    expect(headers["content-security-policy"]).toContain("default-src 'self'")
    expect(headers["content-security-policy"]).toContain(
      "frame-ancestors 'none'"
    )
    expect(headers["x-content-type-options"]).toBe("nosniff")
    expect(headers["x-frame-options"]).toBe("DENY")
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin")
    expect(headers["strict-transport-security"]).toContain("max-age=")
    expect(headers["permissions-policy"]).toContain("camera=()")
  })

  test("la CSP permite TradingView, Stripe y Supabase", async ({ request }) => {
    const response = await request.get("/")
    const csp = response.headers()["content-security-policy"]

    expect(csp).toContain("s3.tradingview.com")
    expect(csp).toContain("checkout.stripe.com")
    expect(csp).toContain("supabase.co")
  })
})

test.describe("Rate limiting", () => {
  test("exceso de POSTs a /login devuelve 429 con Retry-After", async ({
    request,
  }) => {
    let got429 = false
    let retryAfter: string | undefined

    // El límite de auth es 20/min por IP; la suite ya consumió parte.
    for (let i = 0; i < 25; i++) {
      const response = await request.post("/login", {
        failOnStatusCode: false,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: "email=rate@limit.test&password=x",
      })
      if (response.status() === 429) {
        got429 = true
        retryAfter = response.headers()["retry-after"]
        break
      }
    }

    expect(got429).toBe(true)
    expect(Number(retryAfter)).toBeGreaterThan(0)
  })

  test("las páginas GET no se ven afectadas por el límite de auth", async ({
    request,
  }) => {
    // Tras agotar el límite de POST, los GET siguen funcionando.
    const response = await request.get("/login")
    expect(response.status()).toBe(200)
  })
})
