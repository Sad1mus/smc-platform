import type { Page } from "@playwright/test"

/** Usuario E2E confirmado (fixture en la base de Supabase). */
export const E2E_EMAIL = "e2e@smc.test"
export const E2E_PASSWORD = "SmcE2e-2026!"

/** Inicia sesión con el usuario E2E y espera el dashboard. */
export async function login(page: Page) {
  await page.goto("/login")
  await page.getByLabel("Correo electrónico").fill(E2E_EMAIL)
  await page.getByLabel("Contraseña", { exact: true }).fill(E2E_PASSWORD)
  await page.getByRole("button", { name: "Ingresar" }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
}
