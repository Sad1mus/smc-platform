import { expect, test } from "@playwright/test"

import { login } from "./helpers"

test.describe("Dashboard — TradingView y watchlist", () => {
  test("muestra el widget de TradingView con su atribución", async ({
    page,
  }) => {
    await login(page)

    // El embed oficial de TradingView inyecta un iframe con los datos
    // en tiempo real (WebSocket interno del widget).
    const container = page.getByTestId("tradingview-container")
    await expect(container).toBeVisible()
    await expect(container.locator("iframe")).toHaveCount(1, {
      timeout: 30_000,
    })

    const iframeSrc = await container.locator("iframe").getAttribute("src")
    expect(iframeSrc).toContain("tradingview")

    // Atribución exigida por los términos de TradingView. El dashboard tiene
    // varios widgets (gráfico principal + paneles terminal), cada uno con su
    // propia atribución; basta con verificar que al menos una esté visible.
    await expect(
      page.getByRole("link", { name: "by TradingView" }).first()
    ).toBeVisible()
  })

  test("selector de intervalos cambia el gráfico", async ({ page }) => {
    await login(page)

    const container = page.getByTestId("tradingview-container")
    await expect(container.locator("iframe")).toHaveCount(1, {
      timeout: 30_000,
    })

    // Cambiar a 1h: el widget se reconstruye (nuevo iframe).
    await page.getByRole("button", { name: "1h", exact: true }).click()
    await expect(container.locator("iframe")).toHaveCount(1, {
      timeout: 30_000,
    })
    const src = await container.locator("iframe").getAttribute("src")
    expect(src).toContain("interval%22%3A%2260")
  })

  test("watchlist: guardar símbolo → recargar → persiste → eliminar", async ({
    page,
  }) => {
    await login(page)

    const testSymbol = "NASDAQ:TSLA"

    // 1. Agregar el símbolo
    await page.getByTestId("watchlist-input").fill(testSymbol)
    await page.getByTestId("watchlist-add").click()
    await expect(
      page.getByTestId("watchlist-items").getByText(testSymbol)
    ).toBeVisible({ timeout: 15_000 })

    // 2. Recargar: el símbolo persiste (viene de Supabase con RLS)
    await page.reload()
    await expect(
      page.getByTestId("watchlist-items").getByText(testSymbol)
    ).toBeVisible({ timeout: 15_000 })

    // 3. Seleccionarlo cambia el gráfico activo
    await page.getByTestId("watchlist-items").getByText(testSymbol).click()
    await expect(
      page.locator("span", { hasText: testSymbol }).first()
    ).toBeVisible()

    // 4. Limpieza: eliminarlo y verificar que desaparece tras recargar
    await page
      .getByRole("button", { name: `Eliminar ${testSymbol} de la lista` })
      .click()
    await expect(
      page.getByTestId("watchlist-items").getByText(testSymbol)
    ).toHaveCount(0, { timeout: 15_000 })

    await page.reload()
    await expect(page.getByTestId("dashboard-title")).toBeVisible()
    await expect(page.getByText(testSymbol)).toHaveCount(0)
  })
})
