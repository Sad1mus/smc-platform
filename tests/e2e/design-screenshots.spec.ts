import { expect, test } from "@playwright/test"

/**
 * Capturas de diseño (Check de la tarea 4 del goal-queue):
 * landing y dashboard en mobile (375px) y desktop (1440px).
 * Las imágenes quedan en screenshots/.
 */
const E2E_EMAIL = "e2e@smc.test"
const E2E_PASSWORD = "SmcE2e-2026!"

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1440, height: 900 },
} as const

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test(`landing — ${name} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    // Esperar a que los planes (desde Supabase) rendericen
    await expect(page.getByText("Planes de acceso")).toBeVisible({
      timeout: 15_000,
    })
    await page.screenshot({
      path: `screenshots/landing-${name}.png`,
      fullPage: true,
    })
  })

  test(`dashboard — ${name} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/login")
    await page.getByLabel("Correo electrónico").fill(E2E_EMAIL)
    await page.getByLabel("Contraseña", { exact: true }).fill(E2E_PASSWORD)
    await page.getByRole("button", { name: "Ingresar" }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
    await expect(page.getByTestId("dashboard-title")).toBeVisible()
    await page.screenshot({
      path: `screenshots/dashboard-${name}.png`,
      fullPage: true,
    })
  })
}
