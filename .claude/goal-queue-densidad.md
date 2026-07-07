# Goal Queue — SMC · Densidad de producto (dashboard terminal + landing narrativa)

estado: COMPLETADA (5/5 done)
current: —
turn_cap_por_item: 25
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: el producto se siente "leve" (feedback del usuario 2026-07-02). Subir la densidad
percibida SIN prosa de relleno: contenido funcional. Tres frentes: (1) dashboard tipo terminal
con más widgets TradingView display-only, (2) landing con narrativa completa, (3) /precios
argumentada. Continúa goal-queue-fase1-cierre-mvp.md (5/5 completada, mergeada a main hoy).

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).
- Todos los comandos dentro de `repo`. pnpm en ~/.local (PATH).
- Al inicio de cada turno, reimprimir el estado de la cola (X/5 done, tarea actual).
- Commits como Sad1mus, sin Co-Authored-By ni footer. Trabajar en `develop`. NUNCA `git push`.
- SDD: spec primero (tarea 1); el código de las tareas 2-4 sale de esa spec aprobada por la cola.
- MARCO REGULATORIO (línea roja absoluta): prohibido "broker" en copy pública; nada que sugiera
  custodia, ejecución de órdenes ni promesa de rentabilidad ("gana", "rentabilidad asegurada",
  "señales ganadoras" = prohibido). Atribución "by TradingView" visible donde aplique.
- PRECIOS INMUTABLES del dossier: Bronce $1.500 · Plata $2.800 · VIP personalizado · Prueba $250.
  No inventar features de planes que no estén en la tabla plans de la base.
- Widgets TradingView: SOLO widgets gratuitos display-only (ticker tape, heatmap, calendario
  económico, screener). Lazy-load / dynamic import para no degradar el LCP de la landing ni
  el dashboard. Si exigen ajustar CSP (proxy.ts / headers), ajuste MÍNIMO documentado y el
  e2e de seguridad debe seguir verde — NUNCA abrir la CSP con comodines amplios.
- Degradación limpia: si un widget de terceros no carga, la página sigue funcional (sin layout
  roto ni errores en consola que rompan tests).
- Diseño con skills impeccable + emil-design-eng + frontend-design: identidad terminal oscuro +
  dorado, Geist Mono para números. Copy en español primero, tono del product.md.
- E2E: PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64; si el webServer expira, levantar
  `pnpm dev` aparte, esperar 200 en localhost:3000 y reusar (reuseExistingServer activo).
- Si una tarea no avanza en 25 turnos -> [blocked] con motivo y seguir con la siguiente.
-->

## [done] 1. Spec (SDD): densidad de landing, dashboard terminal y /precios
**Condición:** `docs/specs/product.md` actualizada con las secciones nuevas, ANTES de tocar
código: (a) landing — orden y propósito de secciones: hero, cómo funciona (3 pasos), mercados
cubiertos (categorías + símbolos ejemplo), franja de números (afirmaciones VERIFICABLES:
mercados/clases de activos, datos en tiempo real, cobertura 24/7 en cripto — nada inventado ni
métricas de usuarios que no existen), características, planes, FAQ pública (6-8 preguntas con
respuestas alineadas al marco regulatorio), CTA final; (b) dashboard terminal — qué widgets
TradingView se integran (ticker tape, heatmap, calendario económico, screener), dónde vive cada
uno, y el principio de degradación limpia; (c) /precios — tabla comparativa (features desde la
tabla plans de la DB, no inventadas) + FAQ de facturación (cancelación, medios de pago, prueba).
La sección anti-referencias/regulatoria de la spec se mantiene y las FAQs la citan. En UN commit
`docs:`.
**Check (imprimir):** `git log --oneline -1` muestra el commit `docs:` ·
`grep -n "cómo funciona\|heatmap\|calendario\|FAQ" docs/specs/product.md` muestra las secciones ·
`grep -ci "broker" docs/specs/product.md` no aumentó respecto a main (solo usos pre-existentes
de la sección anti-referencias).
**No tocar:** Código todavía. No prometer métricas falsas en la franja de números. No `git push`.
**Evidencia:** Commit `0c3b924 docs:` (+59 líneas). Sección "Contenido y densidad de superficies"
en product.md: landing (8 secciones ordenadas, franja de números solo-verificables, FAQ canon de
8 preguntas alineadas al marco), dashboard terminal (ticker/heatmap/calendario/screener con reglas
de lazy+degradación+CSP mínima), /precios (comparativa desde DB + FAQ facturación honesta).
grep muestra las secciones; grep -ci broker = 1 (igual a baseline de main). Sin push.

## [done] 2. Dashboard terminal: ticker tape + heatmap + calendario económico (+ screener)
**Condición:** El dashboard (`/dashboard`, ruta Mercados) integra según la spec: (a) **ticker
tape** (cinta de precios) arriba del contenido; (b) una zona de pestañas o grid con **heatmap**
de mercado y **calendario económico** (y screener si la spec lo incluyó); (c) todos los widgets
son TradingView gratuitos display-only, con lazy-load (dynamic import / next/script estrategia
lazyOnload) y contenedor con altura reservada (sin layout shift); (d) degradación limpia si el
script de terceros no carga; (e) tema del widget acorde al tema de la app (dark/light);
(f) CSP ajustada mínimamente si hace falta y documentada en la spec de hardening. Tests
unitarios de los componentes wrapper (render, props, fallback). En UNO o DOS commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 con tests nuevos · `pnpm build` exit 0 ·
`npx tsc --noEmit` limpio · `grep -rn "tradingview" proxy.ts next.config.* lib/security 2>/dev/null | head`
(mostrar el estado de la CSP) ·
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 pnpm test:e2e -- --grep "seguridad|security"`
exit 0 (los tests de headers/CSP siguen verdes) · `git log --oneline -2`.
**No tocar:** No debilitar la CSP con comodines. No romper MarketView existente ni la watchlist.
No widgets de pago ni con órdenes/trading. No `git push`.
**Evidencia:** Commit `92b7fd1 feat:`. `TvWidget` genérico (patrón del chart existente: script
s3.tradingview.com + config JSON, colorTheme sigue al tema, altura reservada, onerror→fallback
amable), `TickerTape` (6 símbolos índices/cripto/forex/oro, transparente) y `TerminalPanels`
(tablist accesible Heatmap SPX500/Calendario económico/Screener, lazy real: solo el activo monta
script; atribución by TradingView). Integrados en /dashboard (ticker arriba, paneles bajo
MarketView). CSP SIN cambios (s3.tradingview.com ya permitido; grep impreso). Checks: vitest
75/75 exit 0 · tsc limpio · build exit 0 · e2e security.spec 4 passed exit 0. Sin push.

## [done] 3. Landing narrativa: cómo funciona, mercados, números y FAQ
**Condición:** La landing (`app/page.tsx` + `components/landing/`) implementa la spec: sección
**"Cómo funciona"** (3 pasos claros con iconografía), **"Mercados cubiertos"** (categorías:
acciones, cripto, forex, índices — con símbolos de ejemplo, puede reusar mini-widgets o listas
estáticas), **franja de números** (solo afirmaciones verificables de la spec, formato mono),
**FAQ pública** (acordeón accesible — details/summary o Radix — con las 6-8 preguntas de la
spec), y **CTA final** antes del footer. El hero y las secciones existentes se conservan (se
reordenan solo si la spec lo pide). Copy sin "broker" ni promesas de rentabilidad. Lighthouse
mental: imágenes/widgets lazy, sin layout shift grosero. Tests de render de las secciones
nuevas. En UNO o DOS commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 · `pnpm build` exit 0 · `npx tsc --noEmit` limpio ·
`grep -rn "Cómo funciona\|FAQ" components/landing app/page.tsx | head` ·
`grep -rci "broker" components/landing` devuelve 0 · `git log --oneline -2`.
**No tocar:** Precios (vienen de la DB). No degradar el LCP metiendo todos los widgets eager.
No `git push`.
**Evidencia:** Commit `7faaaa6 feat:`. Devuelta a develop (ff main→develop trajo tareas 1-2).
Reusé los parciales `stats-strip.tsx` (franja: 4 números verificables) y `how-it-works.tsx`
(3 pasos); creé `markets-covered.tsx` (4 categorías con símbolos TradingView reales
NASDAQ:AAPL/BINANCE:BTCUSDT/FX:EURUSD/SP:SPX), `faq.tsx` (acordeón `details/summary` accesible,
8 preguntas canon con marco regulatorio) y `cta.tsx` (CTA final →/registro). Cableado en
`app/page.tsx` en el orden de la spec. Tests `tests/unit/landing-sections.test.tsx` (render de
las 5 secciones + guard anti-"broker"). Checks: vitest 82/82 exit 0 · tsc limpio · build exit 0
(tras limpiar caché `.next` corrupta, no relacionada) · grep muestra "Cómo funciona"/"FAQ" ·
`grep -rci broker components/landing` = 0 en todos. lint+format exit 0. Sin push.

## [done] 4. /precios argumentada: comparativa + FAQ de facturación
**Condición:** `/precios` implementa la spec: además de los planes existentes, una **tabla
comparativa** de qué incluye cada plan (features leídas de la columna features de la tabla
plans — si algún plan no tiene features suficientes en la DB, la tarea documenta el gap en la
spec y usa SOLO lo que hay, sin inventar) y una **FAQ de facturación** (cancelación, medios de
pago, cómo funciona la prueba de $250, upgrade/downgrade — respuestas honestas: lo que el
sistema hace hoy). Diseño coherente (tabla con overflow-x en móvil). Test de render. En UN
commit `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 · `pnpm build` exit 0 listando `/precios` ·
`npx tsc --noEmit` limpio · `grep -rn "comparativa\|facturación\|FAQ" app/precios | head` ·
`git log --oneline -1`.
**No tocar:** Los precios del dossier. No prometer política de reembolsos distinta a la página
legal placeholder. No `git push`.
**Evidencia:** Commit `e7585fd feat:`. `components/pricing/plan-comparison.tsx` (server component:
lee plans de la DB, resuelve la herencia "Todo lo del plan X" y arma matriz features×planes con
✓/—, overflow-x en móvil) y `billing-faq.tsx` (5 preguntas canon, reembolsos →/reembolsos).
Cableados en `app/precios/page.tsx`. Gap del seed (soporte aditivo) documentado en
`docs/specs/product.md §/precios`. Test `tests/unit/pricing.test.tsx` (mock supabase con seed real:
4 columnas, resolución de herencia = 4 marcas en "Acceso a la plataforma", no inventa features;
FAQ 5 preguntas + link reembolsos). Checks: vitest 87/87 exit 0 · tsc limpio · build exit 0 lista
`/precios` · grep comparativa/facturación/FAQ presente en app/precios · lint+format exit 0. Sin push.

## [done] 5. Gate final: pipeline completo verde
**Condición:** Pipeline completo en `develop` con todo lo anterior: `pnpm lint`,
`pnpm format:check`, `pnpm vitest run`, `pnpm build`,
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 pnpm test:e2e` — todos exit 0. Los e2e de
seguridad (CSP/headers) verdes con los widgets nuevos. Working tree limpio (tracked). Commit
final si hace falta.
**Check (imprimir):** los 5 comandos con exit 0 visibles · `git status --short` sin tracked
pendientes · `git log --oneline -8`.
**No tocar:** No marcar tests skip/only para "pasar". No bajar reglas de lint. No `git push`.
**Evidencia:** Pipeline en `develop` verde: `pnpm lint` exit 0 · `pnpm format:check` exit 0 ·
`pnpm vitest run` 87/87 exit 0 · `pnpm build` exit 0 (lista `/precios`) ·
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 playwright test` 14 passed / 1 skipped / 0 failed.
Se corrigió `tests/e2e/dashboard.spec.ts` (commit `9bdc440`): la atribución "by TradingView" ahora
es múltiple (gráfico + paneles de la tarea 2), assert con `.first()` — legítimo, no skip. Los e2e de
seguridad (CSP/headers) siguen verdes con los widgets nuevos. El e2e se corrió en serie (`--workers=1`)
contra `pnpm dev` tibio porque el FS lento tumbaba el webServer efímero y generaba aborts de infra en
paralelo (no fallos de aserción). `git status --short` sin tracked pendientes (solo untracked:
goal-queues y un `.swp`). git log: 92b7fd1→0c3b924 (tareas 1-2, ff desde main) · 7faaaa6 (t3) ·
e7585fd (t4) · 9bdc440 (t5).

<!--
Al terminar (5/5 done o [blocked] justificado): el merge develop→main y push los hace el
asesor con OK del usuario (merge autorado por smartmoney4). La demo gana: dashboard tipo
terminal (heatmap + calendario + ticker) y landing que argumenta el precio.
-->
