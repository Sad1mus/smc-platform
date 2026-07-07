# Goal Queue — Arreglos Taste (landing) + expansión de widgets TradingView (dashboard)

estado: COMPLETADA (5/5 done)
current: —
turn_cap_por_item: 25
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: (A) aplicar los arreglos "sin discusión" del audit de Taste a la LANDING —solo los que
son tells de LLM, NO los estructurales— y (B) anexar al DASHBOARD el set completo de widgets
gratuitos display-only de TradingView, lazy y en pestañas, dentro del marco.

DECISIÓN ya tomada (choque playbook vs Taste): se CONSERVAN el embudo numerado (01/02/03) y el trío
de valor porque fueron decisión de negocio del playbook de conversión. Taste solo se aplica a los
tells puros: em-dash, mockup fake con <div>, labels de CTA inconsistentes, trust-strip en el hero.

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación (el evaluador de /goal no
  lee este archivo, solo ve el transcript).
- Al inicio de cada turno, reimprimir el estado de la cola (X/5 done, tarea actual).
- Comandos en `repo`. pnpm en ~/.local (PATH). Commits como Sad1mus, sin footer. Trabajar en
  `develop`. NUNCA `git push`.
- SDD: spec primero (tarea 1); el código sale de esa spec.
- MARCO REGULATORIO VIGENTE: los widgets TradingView son SOLO display (muestran datos, no operan).
  Prohibido cualquier ticket/orden/depósito. Sin promesas de rentabilidad.
- TradingView: SOLO widgets gratuitos oficiales de s3.tradingview.com. **CSP sin comodines nuevos**
  (s3.tradingview.com ya está permitido; NO ampliar la CSP). Lazy: solo el panel/pestaña activo monta
  su script (patrón ya usado en TerminalPanels). Degradación limpia si un widget no carga. Atribución
  TradingView visible.
- Em-dash (—): reemplazar por guión normal (-) o reescribir; aplica a copy renderizada y comentarios.
- Tests de render por componente nuevo/cambiado. Si una tarea no avanza en 25 turnos -> [blocked].
-->

## [done] 1. Spec (SDD): arreglos Taste + catálogo de widgets TradingView
**Condición:** `docs/specs/product.md` actualizada ANTES de tocar código: (a) sección corta
"Ajustes de taste (landing)" que liste los 4 arreglos a aplicar (purga de em-dash; un solo label de
signup; trust-strip fuera del hero; reemplazo del mockup fake por un embed REAL de TradingView) y
declare que el embudo numerado y el trío SE CONSERVAN por decisión del playbook; (b) ampliar la
sección "Dashboard — terminal" con el **catálogo de widgets** display-only a integrar (además de los
actuales chart/ticker/heatmap-acciones/calendario/screener): heatmap **cripto**, heatmap **ETF**,
heatmap/cross-rates **forex**, **market overview**, **technical analysis** (atado al símbolo activo),
**noticias (timeline)**, **symbol info/overview**; con las reglas de lazy + CSP-sin-ampliar +
degradación. En UN commit `docs:`.
**Check (imprimir):** `git log --oneline -1` = `docs:` · `grep -n "taste\|technical analysis\|cripto\|market overview\|timeline" docs/specs/product.md | head` · `grep -ci "broker" docs/specs/product.md` no aumenta.
**No tocar:** Código todavía. No especificar ejecución/orden. No `git push`.
**Evidencia:** Commit `68416b7 docs:`. Agregado a product.md: "### Catálogo de widgets TradingView
(display-only)" (lista los 7 a anexar con sus nombres de embed + reglas lazy/CSP-sin-ampliar) y
"## Ajustes de taste (landing)" (4 tells a arreglar; declara que trío y embudo numerado SE CONSERVAN).
`grep broker` = 1 (baseline, sin aumento). Sin push.

## [done] 2. Taste: purga de em-dash + un label de signup + trust-strip fuera del hero
**Condición:** (a) reemplazar TODOS los em-dash (—) por guión normal o reescribir, en
`components/landing/**` y `app/page.tsx` (copy renderida y comentarios); (b) unificar el label de
signup a UNO solo en toda la landing (elegir "Crear cuenta" y usarlo en hero, header, segments y CTA
de cierre — hoy hay 4 variantes); (c) mover el trust-strip del hero (`TRUST_ITEMS`) a una sección/
franja propia debajo del hero. Tests de que el hero ya no contiene el trust-strip y de que el label
de signup es único. En 1-2 commits `feat:`/`refactor:`.
**Check (imprimir):** `grep -rn "—" components/landing app/page.tsx` = 0 (o solo en strings no
renderizados justificados) · `grep -rhoE ">(Comienza ahora|Crear cuenta|Crear mi cuenta|Empezar con Prueba)<" components/landing | sort | uniq -c` (un solo label de signup) · `pnpm vitest run` exit 0 · `pnpm build` exit 0 · `npx tsc --noEmit` limpio · `git log --oneline -2`.
**No tocar:** No cambiar el trío ni el embudo numerado. No romper la navegación. No `git push`.
**Evidencia:** Commit `a730e1e refactor:`. (a) em-dash purgado: hero H1 "fiat y cripto" con comas,
how-it-works, y comentarios de header-chrome/why-us/platform-section → `grep "—" components/landing
app/page.tsx` = 0. (b) signup unificado a "Crear cuenta" (hero "Comienza ahora"→, closing "Crear mi
cuenta"→, cta.tsx→; se conservan CTAs plan-específicos "Empezar con Prueba"/"Probar la plataforma").
(c) `trust-strip.tsx` nuevo, cableado tras el hero en page.tsx; TRUST_ITEMS fuera del hero. Tests
`taste-fixes.test.tsx` (hero sin trust-strip, CTA "Crear cuenta", sin em-dash) + tests de labels
actualizados. Checks: tsc limpio · vitest 108/108 · build exit 0 · lint 0. Trío y embudo numerado
intactos. Sin push.

## [done] 3. Taste: reemplazar el mockup fake por un embed REAL de TradingView (lazy)
**Condición:** En `platform-section.tsx`, reemplazar el `TerminalMock` dibujado con `<div>`/SVG por un
**widget REAL** de TradingView display-only (p. ej. `symbol-overview` o `mini-symbol-overview`),
montado **lazy** (solo cuando entra en viewport / dynamic import) para no degradar el LCP de la
landing, con altura reservada (sin layout shift), atribución visible y degradación limpia si el script
no carga. Reusar el wrapper `TvWidget` si aplica. CSP sin cambios (s3.tradingview.com ya permitido).
Test del wrapper (render + fallback). En 1-2 commits `feat:`.
**Check (imprimir):** `grep -rn "TerminalMock" components/landing` = 0 (mockup fake eliminado) ·
`grep -rn "tradingview\|TvWidget\|symbol-overview" components/landing/platform-section.tsx | head` ·
`grep -rn "s3.tradingview.com" proxy.ts next.config.* lib/security 2>/dev/null | head` (CSP sin
comodines nuevos) · `pnpm vitest run` exit 0 · `pnpm build` exit 0 · `git log --oneline -2`.
**No tocar:** No ampliar la CSP. No cargar el widget eager (mata el LCP). No `git push`.
**Evidencia:** Commit `95cc7cb feat:`. `TerminalMock` eliminado (grep=0). `platform-section.tsx` ahora
usa `TvWidget widget="symbol-overview"` (BTC/AAPL/EURUSD, display-only, atribución "Datos en vivo por
TradingView") envuelto en nuevo `lazy-mount.tsx` (IntersectionObserver, rootMargin 200px, altura
reservada → cero layout shift, no scroll listener). CSP sin cambios (next.config.ts ya permite
s3./*.tradingview.com en script/img/frame/connect-src). Fix de lint react-hooks/set-state-in-effect
(fallback sin IO diferido con setTimeout). Test de PlatformSection actualizado. Checks: tsc limpio ·
vitest 108/108 · build exit 0 · lint 0. Sin push.

## [done] 4. TradingView: anexar el set completo de widgets display-only al dashboard
**Condición:** Ampliar los paneles del dashboard (sobre `TerminalPanels`/`TvWidget`) con las pestañas/
paneles del catálogo de la spec, TODOS gratuitos display-only y con **lazy real** (solo la pestaña
activa monta su script): heatmap **cripto** (`crypto-coins-heatmap`), heatmap **ETF** (`etf-heatmap`),
**forex** (`forex-heat-map` y/o `forex-cross-rates`), **market overview** (`market-overview`),
**noticias/timeline** (`timeline`), y **technical analysis** (`technical-analysis`). Además, en el
panel de análisis [D] del cockpit, atar un **Technical Analysis** y/o **Symbol Info** al símbolo
activo (cuando el usuario elige un símbolo en el navegador, el panel muestra su análisis técnico).
Atribución TradingView, degradación limpia, altura reservada. Tests de los wrappers nuevos. En 1-3
commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 con tests nuevos · `pnpm build` exit 0 ·
`npx tsc --noEmit` limpio · `grep -rn "crypto-coins-heatmap\|etf-heatmap\|market-overview\|timeline\|technical-analysis" components/dashboard | head` · `grep -rn "s3.tradingview.com" proxy.ts lib/security next.config.* 2>/dev/null` (CSP sin comodines nuevos) · `grep -rEci "comprar|vender|deposit|ticket|1-click" components/dashboard app/dashboard` = 0 · `git log --oneline -2`.
**No tocar:** No widgets de pago ni con trading/órdenes. No ampliar la CSP. No cargar todos eager. No
`git push`.
**Evidencia:** Commit `765d9a3 feat:`. `TerminalPanels` pasó de 3 a **8 pestañas** (agregadas: cripto
`crypto-coins-heatmap`, ETF `etf-heatmap`, forex `forex-cross-rates`, mercados `market-overview`,
noticias `timeline`), lazy real (solo la activa monta su script — test lo verifica). En el cockpit,
columna [D]: `technical-analysis` atado a `activeSymbol` (se remonta al cambiar de símbolo). Tests:
`tradingview-expansion.test.tsx` (pestañas nuevas + lazy + technical-analysis) y ajuste del test de 3→8
pestañas. Checks: tsc limpio · vitest 111/111 · build exit 0 · lint 0 · CSP sin ampliar (todos de
*.tradingview.com ya permitido) · guard comprar/vender/deposit/ticket/1-click = 0. Sin push.

## [done] 5. Gate final: pipeline verde + guardrails
**Condición:** Pipeline en `develop`: `pnpm lint`, `pnpm format:check`, `pnpm vitest run`,
`pnpm build`, `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 pnpm test:e2e` — todos exit 0 (e2e en
serie contra `pnpm dev` tibio si el FS tumba el webServer; seguridad/CSP verde con los widgets nuevos).
Guards: `grep -rn "—" components/landing app/page.tsx` = 0 (em-dash purgado) ·
`grep -rEi "broker|operá|operar|depositá|depósito|custodia|comprar/vender|1-click|rentabilidad asegurada" components/landing components/dashboard app/page.tsx app/dashboard` sin coincidencias de la capa
estacionada (solo disclaimers de negación permitidos) · working tree sin tracked pendientes.
**Check (imprimir):** los 5 comandos exit 0 · los dos greps de guard · `git status --short` sin tracked
· `git log --oneline -10`.
**No tocar:** No skip/only para "pasar". No bajar lint. No ampliar la CSP. No `git push`.
**Evidencia:** Pipeline en `develop` verde: lint exit 0 · format:check exit 0 · vitest 111/111 exit 0 ·
build exit 0 (lista /precios y /dashboard/alertas) · `playwright test --workers=1` 14 passed / 1 skipped
/ 0 failed (serial contra dev tibio; seguridad/CSP verde con los widgets nuevos). Guards: em-dash en
components/landing+app/page.tsx = 0; capa estacionada = solo disclaimers en negación (faq/footer "no
custodia fondos", status-bar comment). `git status` sin tracked pendientes. Sin push.

<!--
Al terminar (5/5 done o [blocked]): el merge develop→main + push los hace el asesor con OK del usuario.
Taste: solo se aplicaron los tells puros; el trío y el embudo numerado se conservaron por decisión del
playbook. TradingView: todo display-only, lazy, CSP sin ampliar.
-->
