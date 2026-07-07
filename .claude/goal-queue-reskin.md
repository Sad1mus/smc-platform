# Goal Queue — Reskin visual de smc-platform (local, para revisión)

current: 7
Base: docs/specs/redesign.md (graduado desde spec-redesign-smc.md). Trabajar SIEMPRE dentro de `smc-platform/`.
Nota: NO confundir con `.claude/goal-queue.md` (histórico del MVP, no tocar).

## Restricciones GLOBALES (aplican a TODA tarea — no negociables)
- **Texto congelado:** NO editar `lib/i18n/dictionaries.ts`. Check transversal en cada tarea: `git diff --exit-code lib/i18n/dictionaries.ts` sale 0.
- **Atribución obligatoria:** "by TradingView" debe seguir presente. Check: `grep -rn "TradingView" components/dashboard/tradingview-chart.tsx components/dashboard/terminal-panels.tsx`.
- **Regulatorio:** no convertir nada display-only en algo que parezca ejecución/trading; conservar disclaimers y el literal "brokers socios regulados".
- **Sin lógica:** no tocar server actions, Supabase, Stripe, `proxy.ts`, auth, ni el cableado symbol/interval del cockpit ni alturas fijas de embeds.
- **Local, sin deploy:** NUNCA `git push` ni deploy. El trabajo queda en el árbol local (sin commit salvo pedido explícito).
- **Verde siempre:** al cerrar cada tarea, `pnpm build` sale 0.
- Screenshots de revisión → `.redesign-review/` (gitignored), capturadas contra `pnpm dev` en localhost:3000.

---

### 1. [done] Fundaciones — tokens
**Condición:** extender `app/globals.css` (@theme) con: escala tipográfica tokenizada (`--text-display/h1/h2/h3/body/label`), espaciado semántico (`--space-section/block/card/inline`), `--hairline` y `--hairline-dashed`, tokens de motion (`--reveal-y`, `--reveal-dur`, `--ease-out-soft`), y unificar/documentar la dualidad `primary`/`--gold` en dark. NO remover tokens existentes. Añadir `.redesign-review/` a `.gitignore`.
**Check (imprimir):** `pnpm build` → exit 0; `grep -n "hairline-dashed\|--reveal-y\|--text-display" app/globals.css`; `git diff --exit-code lib/i18n/dictionaries.ts` → exit 0.
**Bound:** 15 turnos → si no avanza, [blocked] con motivo y seguir.
**Evidencia:** globals.css extendido — escala tipográfica `--text-display/h1/h2/h3/body/label` (con line-height/letter-spacing) y espaciado `--spacing-section/block/card/inline` en @theme; `--hairline`/`--hairline-dashed` + motion `--reveal-y/dur`/`--ease-out-soft` en :root (resuelven border por tema); dualidad gold documentada (usar `--gold` para acento de marca). `.redesign-review/` en .gitignore. Checks: build exit 0, grep OK, dictionaries.ts intacto (exit 0). Sin remover tokens previos.

### 2. [done] Primitivas + variantes
**Condición:** crear `components/motion/reveal.tsx` (RevealGroup/RevealItem con `motion`: fade+rise 20px, ease-out 0.42s, `whileInView once`, respeta `prefers-reduced-motion`), `components/ui/dashed-divider.tsx`, `components/ui/stat-pill.tsx`, `components/ui/data-label.tsx`; agregar variante `hairline` a `components/ui/card.tsx` y revisar variantes de `components/ui/button.tsx` (sólido dorado / outline hairline) sin romper las existentes.
**Check (imprimir):** `ls components/motion/reveal.tsx components/ui/dashed-divider.tsx components/ui/stat-pill.tsx components/ui/data-label.tsx`; `pnpm lint` → exit 0; `pnpm build` → exit 0.
**Bound:** 15 turnos.
**Evidencia:** 4 primitivas creadas: reveal.tsx (RevealGroup/RevealItem con motion, y:20/0.42s/ease-out-soft, whileInView once, useReducedMotion => sin anim), dashed-divider.tsx (h/v), data-label.tsx (kicker mono uppercase, text-label), stat-pill.tsx (columnas con divide-dashed, cifras mono tabular). Card +variante `hairline` (borde punteado, sin ring/bg). Button +variante `gold` (bg-gold, token canónico). Fix TS: children cast a ReactNode en branch reduced-motion. Checks: ls OK, lint exit 0, build exit 0, dictionaries intacto.

### 3. [done] Piloto — Precios / Mi Plan
**Evidencia:** reskin aplicado a `components/landing/plans.tsx` (cards dashed hairline, VIP con borde dorado+tinte y CTA `gold`, RevealGroup/RevealItem en la grilla, h2 con `text-h2`), `plan-comparison.tsx` (bordes dashed + `tabular-nums`), `precios/page.tsx` (borde de sección dashed), `plan/page.tsx` (Cards `variant="hairline"`, precio `tabular-nums`, CTA plata `gold`), `plan-checkout-button.tsx` (+tipo `gold`). Checks: build exit 0, test 120/120 passed, dictionaries.ts intacto (exit 0), 4 capturas (precios/plan × desktop/mobile) en `.redesign-review/`. Verificado visualmente: sistema hairline coherente, copy y disclaimers intactos.
**(condición original abajo)**
**Condición:** reskinnear `app/precios/page.tsx`, `app/dashboard/plan/page.tsx`, `components/pricing/*` con el sistema nuevo (cards hairline, precio mono grande + `tabular-nums`, StatPill, CTA consistente, DashedDivider). Precios/features salen igual (Supabase/diccionario). Capturar screenshots de `/precios` y `/dashboard/plan` en desktop (1440) y móvil (390) a `.redesign-review/`.
**Check (imprimir):** `pnpm build` → 0; `pnpm test` → 0; `git diff --exit-code lib/i18n/dictionaries.ts` → 0; `ls .redesign-review/precios-*.png .redesign-review/plan-*.png` (4 archivos).
**Bound:** 20 turnos.

### 4. [done] Escalar — Landing (re-skin, orden intacto)
**Evidencia:** motivo hairline uniforme — separadores de sección → `border-t border-dashed` en 13 componentes landing (sin tocar `header-chrome`/nav, que quedó sólido); headings a tokens `text-h2`/`text-h1`; `stats-strip` con dividers verticales punteados responsive + `tabular-nums`; Plans ya reskineado (task 3). Orden en `app/page.tsx` intacto. Checks: build exit 0, anclas `como-funciona/mercados/planes/faq` intactas en header-chrome, dictionaries.ts intacto, capturas `landing-desktop/mobile.png` (con scroll-through para disparar reveals). Verificado visual: cards de plan visibles, coherente.
**(condición original abajo)**
**Condición:** reskinnear las 13 secciones en `components/landing/*` SIN reordenar y SIN tocar las anclas del header (howItWorks/markets/plans/faq). Hairlines de sección, kicker mono (DataLabel), Reveal on-scroll, StatsStrip mono con dividers verticales. Screenshots de `/` desktop+móvil.
**Check (imprimir):** `pnpm build` → 0; `grep -n "howItWorks\|markets\|plans\|faq" components/landing/header-chrome.tsx` (anclas intactas); `git diff --exit-code lib/i18n/dictionaries.ts` → 0; `ls .redesign-review/landing-*.png` (2 archivos).
**Bound:** 25 turnos.

### 5. [done] Escalar — Auth + Legales + Admin + Alertas
**Evidencia:** Auth: layout usa `<Logo>` real (antes "SMC." plano) + los 4 forms con `<Card variant="hairline">` (sin doble marco). Legal: h1 → `text-h2` + divisor punteado. Admin: 6 Cards → hairline, bordes de tabla (thead+filas) → dashed, Metric con `tabular-nums`. Alertas: lista con `divide-dashed` + borde dashed, umbral con `tabular-nums`. Checks: build exit 0, lint exit 0, dictionaries.ts intacto. Capturas: login/legal/alertas-desktop. NOTA: `/admin` no capturable (el user e2e no tiene rol admin y no se mutó Supabase); reskin verificado por build + mismo patrón de tabla ya visto en la comparativa de precios.
**(condición original abajo)**
**Condición:** reskinnear `app/(auth)/*` + `components/auth/*` (wordmark `<Logo>` real, framing hairline), `components/legal/legal-page.tsx`, `app/admin/*` (tablas hairline + `tabular-nums`), `app/dashboard/alertas/*` (filas con divisor punteado, símbolo/precio mono). Screenshots de login, legal, admin, alertas (desktop).
**Check (imprimir):** `pnpm build` → 0; `pnpm lint` → 0; `git diff --exit-code lib/i18n/dictionaries.ts` → 0; `ls .redesign-review/` con las nuevas capturas.
**Bound:** 20 turnos.

### 6. [done] Escalar — Terminal / Dashboard (núcleo, cuidado)
**Evidencia:** vestido hairline sin tocar lógica — `panel-header` y `terminal-status-bar` con `border-dashed`; 7 panel wrappers (cockpit×2, terminal-panels, market-navigator, watchlist-panel, tradingview-chart, ticker-tape) → `border border-dashed` targeteando solo `overflow-hidden rounded-* border` (inputs y tabs quedaron sólidos). CONSERVADO: grilla `[210px_1fr_280px]`, store del reloj (useSyncExternalStore), cableado symbol/interval, alturas fijas de embeds, theme-sync, atribución "by TradingView" (2 ocurrencias intactas). Checks: build exit 0, test 120/120, grep atribución presente, dictionaries.ts intacto. Capturas dashboard-desktop/mobile: chart TradingView renderiza, disclaimer regulatorio intacto, coherente.
**(condición original abajo)**
**Condición:** reskinnear cockpit/paneles/statusbar (`components/dashboard/*`) con hairlines: paneles separados por líneas (no cards+sombra), `PanelHeader` con label mono mayúsculas, StatusBar tira mono, navigator/watchlist como listas mono con divisores punteados. CONSERVAR: grilla `[210px_1fr_280px]`, cableado symbol/interval, alturas fijas de embeds, theme-sync `resolvedTheme`, atribución TradingView, y la lógica de `terminal-status-bar.tsx` (solo su vestido).
**Check (imprimir):** `pnpm build` → 0; `pnpm test` → 0; `grep -rn "TradingView" components/dashboard/tradingview-chart.tsx` (atribución presente); `git diff --exit-code lib/i18n/dictionaries.ts` → 0; `ls .redesign-review/dashboard-*.png`.
**Bound:** 25 turnos.

### 7. [done] Verificación final (gate local, sin deploy)
**Evidencia:** `pnpm format` aplicado; GATE LOCAL: lint exit 0 · format:check exit 0 · test exit 0 (120/120) · build exit 0 · `git diff lib/i18n/dictionaries.ts` exit 0 (intacto). `git status`: solo working tree modificado, HEAD en 2eef42c (SIN commit/push nuevo). 11 capturas en `.redesign-review/` (precios/plan/landing/dashboard × desktop+mobile, login/legal/alertas desktop). Dev server local detenido.
**(condición original abajo)**
**Condición:** todo el reskin aplicado; recopilar TODAS las screenshots en `.redesign-review/`. Correr el gate local completo.
**Check (imprimir):** `pnpm lint` → 0; `pnpm format:check` → 0 (correr `pnpm format` si hace falta); `pnpm test` → 0; `pnpm build` → 0; `git diff --exit-code lib/i18n/dictionaries.ts` → 0; `git status` (confirmar SIN push ni commit no pedido); `ls .redesign-review/` lista capturas de todas las vistas.
**Bound:** 15 turnos.

---
Progreso: 7/7 done. COLA COMPLETA — condición global cumplida (ninguna [pending]/[in-progress], gate T7 verde).
