import { expect, test } from "@playwright/test"

/**
 * E2E de autenticación contra el proyecto Supabase real.
 *
 * Usuario de prueba pre-confirmado (fixture creado en la base):
 *   e2e@smc.test / SmcE2e-2026!
 */
const E2E_EMAIL = "e2e@smc.test"
const E2E_PASSWORD = "SmcE2e-2026!"

test.describe("Autenticación", () => {
  test("proxy: /dashboard sin sesión redirige a /login", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL(/\/login/, { timeout: 15_000 })
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible()
  })

  test("registro: crea cuenta y muestra confirmación de correo", async ({
    page,
  }) => {
    await page.goto("/registro")

    // Dominio con TLD real: Supabase rechaza TLDs reservados (.test).
    const uniqueEmail = `e2e-reg-${Date.now()}@smc-e2e-fixtures.com`
    await page.getByLabel("Nombre completo").fill("Usuario Nuevo E2E")
    await page.getByLabel("Correo electrónico").fill(uniqueEmail)
    await page.getByLabel("Contraseña", { exact: true }).fill("Secreta123")
    await page.getByLabel("Confirmar contraseña").fill("Secreta123")
    await page.getByRole("button", { name: "Crear cuenta" }).click()

    // Esperar la respuesta del servidor: tarjeta de éxito o error del formulario.
    const success = page.getByTestId("register-success")
    const formError = page.getByTestId("register-error")
    await expect(success.or(formError).first()).toBeVisible({
      timeout: 20_000,
    })

    if (await success.isVisible()) {
      return // Registro completo: Supabase envió el correo de confirmación.
    }

    // El free tier de Supabase limita los correos de confirmación (2/hora).
    // Si el límite se alcanzó, la petición llegó a Supabase y el flujo
    // funciona: se omite esta corrida por limitación del entorno.
    const alertText = (await formError.textContent()) ?? ""
    test.skip(
      /demasiados intentos|rate limit/i.test(alertText),
      "Rate limit de correos del free tier de Supabase alcanzado"
    )

    throw new Error(`El registro falló con un error inesperado: ${alertText}`)
  })

  test("login → dashboard → logout → dashboard vuelve a exigir login", async ({
    page,
  }) => {
    // 1. Login con el usuario confirmado
    await page.goto("/login")
    await page.getByLabel("Correo electrónico").fill(E2E_EMAIL)
    await page.getByLabel("Contraseña", { exact: true }).fill(E2E_PASSWORD)
    await page.getByRole("button", { name: "Ingresar" }).click()

    // 2. Dashboard accesible
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 })
    await expect(page.getByTestId("dashboard-title")).toBeVisible()

    // 3. Logout (desde el menú de usuario)
    await page.getByTestId("user-menu").click()
    await page.getByTestId("logout-button").click()
    await page.waitForURL(/\/login/, { timeout: 20_000 })

    // 4. /dashboard ya no es accesible
    await page.goto("/dashboard")
    await page.waitForURL(/\/login/, { timeout: 15_000 })
    await expect(page).toHaveURL(/\/login/)
  })

  test("login: credenciales inválidas muestran error", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Correo electrónico").fill(E2E_EMAIL)
    await page
      .getByLabel("Contraseña", { exact: true })
      .fill("ContraseñaIncorrecta1")
    await page.getByRole("button", { name: "Ingresar" }).click()

    await expect(page.getByTestId("login-error")).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByTestId("login-error")).toHaveText(
      "Correo o contraseña incorrectos."
    )
    await expect(page).not.toHaveURL(/\/dashboard/)
  })
})
