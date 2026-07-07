# Goal Queue — Dashboard/terminal: light + dark, LIGHT por defecto

current: 5
Base: docs/specs/redesign.md + memoria [[glass-motion-landing]]. Trabajar SIEMPRE dentro de `smc-platform/`.
Nota: NO confundir con `goal-queue-glass.md` (landing, done) ni `goal-queue.md` (MVP, no tocar).
Objetivo: el dashboard/terminal soporta tema CLARO y OSCURO con **light por defecto**, pulido y consistente,
sin romper la densidad ni el cableado del cockpit. La landing ya está en glass; el dashboard NO se vuelve
glass pesado (sigue siendo un terminal denso), solo gana light-first + coherencia visual.

Estado de partida (ya existe): `components/dashboard/theme-toggle.tsx` (toggle next-themes), tokens `:root`
(light) y `.dark` en `globals.css`, y theme-sync TradingView (`resolvedTheme` → `colorTheme`) en
`tv-widget.tsx` y `tradingview-chart.tsx`. Falta: default light + pulido del tema light + verificación.

## Restricciones GLOBALES (toda tarea — no negociables)
- **Copy congelada:** NO editar `lib/i18n/dictionaries.ts`. Check: `git diff --exit-code lib/i18n/dictionaries.ts` → 0.
- **Estructura del cockpit intacta:** conservar grid `[210px_1fr_280px]`, alturas fijas de embeds, cableado symbol/interval, `useSyncExternalStore` del reloj, theme-sync. Solo presentación/tokens.
- **TradingView:** "by TradingView" presente; embeds cambian `colorTheme` con el toggle en vivo. Display-only, sin "broker", nada que simule ejecución/custodia.
- **A11y:** contraste AA en AMBOS temas; `prefers-reduced-motion` respetado.
- **Solo dashboard:** tocar `app/dashboard/*`, `components/dashboard/*`, `app/layout.tsx` (default), `app/globals.css` (tokens). NO tocar landing, Supabase, Stripe, `proxy.ts`, auth.
- **Local, sin deploy:** NUNCA push/commit salvo pedido explícito.
- **Verde siempre:** al cerrar cada tarea `pnpm build` → 0.
- Screenshots del dashboard → `.redesign-review/` (gitignored). Requieren login: usar el usuario e2e de Playwright (ver `tests/e2e` / `.env`); si no hay credenciales disponibles, verificar por build + auditoría de tokens y DEJARLO CONSTANTE en la evidencia.

---

### 1. [done] Light por defecto + toggle visible
**Condición:** `app/layout.tsx` con `defaultTheme="light"` (mantener `attribute="class"`, `enableSystem={false}`, `suppressHydrationWarning`). El `ThemeToggle` debe estar MONTADO y visible en el chrome del dashboard (user-nav / sidebar). Dark sigue disponible por el toggle.
**Check (imprimir):** `grep -n 'defaultTheme="light"' app/layout.tsx`; `grep -rn "ThemeToggle" app/dashboard components/dashboard` (montado); `pnpm build` → 0; `git diff --exit-code lib/i18n/dictionaries.ts` → 0.
**Bound:** 10 turnos.
**Evidencia:** `defaultTheme="light"` en app/layout.tsx:55 (attribute/enableSystem/suppressHydrationWarning intactos). ThemeToggle YA montado en app/dashboard/layout.tsx:44 (import línea 8). Build exit 0; dict intacto (exit 0).

### 2. [done] Pulir el tema LIGHT en todo el cockpit
**Condición:** revisar cada componente del dashboard (`terminal-cockpit`, `terminal-panels`, `panel-header`, `terminal-status-bar`, `market-navigator`, `watchlist-panel`, `ticker-tape`, `tradingview-chart`, `sidebar-nav`, `user-nav`, `app/dashboard/*`) y arreglar todo color hardcodeado que asuma dark (hex/oklch fijos, `text-white`, `bg-black`, etc.) para que use tokens semánticos y se vea bien en light: contraste AA, jerarquía legible, hairlines visibles. PRESERVAR grid/alturas/cableado.
**Check (imprimir):** `grep -rnE "text-white|bg-black|#fff|#000|text-\[#|bg-\[#" components/dashboard app/dashboard` (justificar cada resto o que sean intencionales por tema); `grep -rn "210px_1fr_280px" components/dashboard` (grid intacto); `pnpm build` → 0; captura `dashboard-light-*.png` (o constancia de por qué no se pudo loguear).
**Bound:** 25 turnos.
**Evidencia:** Auditoría: **0 colores hardcodeados** que asuman dark en `components/dashboard`/`app/dashboard` — ya usan tokens semánticos, así que el tema light funciona vía `:root`. NO hizo falta editar componentes. Grid `[210px_1fr_280px]` intacto (terminal-cockpit.tsx:41). Build exit 0. Captura `dashboard-light-desktop.png` (logueado con usuario e2e): render limpio y legible, sidebar/status/navigator/watchlist/cockpit OK, "by TradingView" presente.

### 3. [done] Regresión DARK + sync TradingView en ambos temas
**Condición:** confirmar que el tema dark sigue impecable (no se rompió al tokenizar) y que los embeds TradingView cambian de `colorTheme` al togglear (remonta por `resolvedTheme`). "by TradingView" presente.
**Check (imprimir):** `grep -rn "resolvedTheme" components/dashboard/tv-widget.tsx components/dashboard/tradingview-chart.tsx`; `grep -rn "by TradingView" components/dashboard`; `pnpm build` → 0; captura `dashboard-dark-*.png` (o constancia).
**Bound:** 15 turnos.
**Evidencia:** Embeds atados a `resolvedTheme`: `tradingview-chart.tsx` (`theme: light|dark`, dep resolvedTheme → remonta) y `tv-widget.tsx` (`colorTheme: light|dark`, dep resolvedTheme). "by TradingView" presente (terminal-panels ×1, tradingview-chart ×2). Captura `dashboard-dark-desktop.png`: cockpit dark completo (chart, ticker con precios, análisis técnico) impecable, toggle en luna. Build 0.

### 4. [done] Coherencia visual (sutil, sin romper densidad)
**Condición:** alinear el look del dashboard al lenguaje nuevo SIN volverlo glass pesado: radios/hairlines/acento coherentes, superficies de panel limpias en light, densidad del terminal preservada (nada de cards gigantes flotantes ni blur que estorbe la lectura de datos). El acento del producto sigue siendo el dorado (`--gold`), no el azul de la landing.
**Check (imprimir):** `pnpm build` → 0; `grep -rn "210px_1fr_280px" components/dashboard` (grid intacto); alturas de embeds sin cambios (grep de `height`/`h-\[` en los wrappers); capturas actualizadas.
**Bound:** 20 turnos.
**Evidencia:** Decisión de diseño (guardrail): el dashboard NO se vuelve glass pesado — sigue siendo terminal denso con hairlines editoriales. Verificado: **0 filtraciones** del azul/glass de la landing (`3E72F7`/`glass-card`/`btn-glossy`/`landing-editorial` = 0 en dashboard); acento **dorado** presente en 7 componentes; grid `[210px_1fr_280px]` y alturas de embeds (`PANEL_HEIGHT`, `min-h-[480px]`) intactas; build 0. Coherencia interna + densidad preservada en ambos temas (capturas light/dark).

### 5. [done] Gate final (sin deploy)
**Condición:** todo aplicado; gate local verde y guardrails confirmados en AMBOS temas.
**Check (imprimir):** `pnpm lint` → 0; `pnpm format:check` → 0 (correr `pnpm format` si hace falta); `pnpm test` → 0; `pnpm build` → 0; `git diff --exit-code lib/i18n/dictionaries.ts` → 0; `grep -rn "by TradingView" components/dashboard` (presente); `git status` (SIN commit/push); `ls .redesign-review/dashboard-*.png` (light + dark, o constancia de por qué no).
**Bound:** 15 turnos.
**Evidencia:** GATE VERDE — `format:check` 0 · `lint` 0 · `test` 120/120 · `build` 0 · `git diff dictionaries.ts` 0 (intacto) · "by TradingView" presente. `git status`: HEAD en `e39eff8`, solo `app/layout.tsx` modificado (SIN commit/push). Capturas `dashboard-light-desktop.png` + `dashboard-dark-desktop.png` en `.redesign-review/`. Nota: la adaptación fue 1 línea (defaultTheme→light) porque el theming (toggle + tokens + sync TV) YA existía.

---
Progreso: 5/5 done. Condición global CUMPLIDA — ninguna tarea [pending] ni [in-progress].
