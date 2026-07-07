# Goal Queue — SMC · Landing de alta conversión + Terminal display (patrón playbook, dentro del marco)

estado: COMPLETADA (7/7 done)
current: —
turn_cap_por_item: 25
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: llevar la LANDING (Parte 1 del playbook) al patrón de conversión, y construir la
capa DISPLAY/ANÁLISIS de la TERMINAL post-login (Parte 2 del playbook), TODO dentro del marco
regulatorio actual. Playbooks: ~/Documentos/Agencia/orvex/playbook-landing-conversion.md y
playbook-landing-conversion1.md (Parte 2).

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación (el evaluador de /goal
  no lee este archivo, solo ve el transcript).
- Al inicio de cada turno, reimprimir el estado de la cola (X/7 done, tarea actual).
- Comandos dentro de `repo`. pnpm en ~/.local (PATH). Commits como Sad1mus, sin Co-Authored-By ni
  footer. Trabajar en `develop`. NUNCA `git push` (merge lo hace el asesor con OK del usuario).
- SDD: spec primero (tarea 1); el código sale de esa spec.

- MARCO REGULATORIO — SIGUE VIGENTE (remoción BLOQUEADA hasta confirmación legal — ver
  docs/decisiones/2026-07-04-giro-regulatorio.md):
  PROHIBIDO en copy y en UI: "broker", "operá/operar", "invertí", "depositá/depósito", custodia,
  "protección de fondos", ejecución de órdenes, señales, y toda promesa de rentabilidad.

- ⛔ ESTACIONADO — NO SE CONSTRUYE en esta cola (capa de dinero/ejecución/custodia): ticket
  Comprar/Vender, botón "Depositar", barra de Fondos/Equidad/Margen/P&L real, confirmar orden,
  1-click dealing, stop-loss/take-profit de posiciones reales, bonos/referidos, y CUALQUIER patrón
  manipulativo que el playbook marca como dark-pattern (§9 + nota Parte 2): P&L-dopamina verde/rojo
  como gancho, riesgo reenmarcado como "protección", depósito omnipresente con aviso enterrado.
  Si una tarea empuja hacia esto -> [blocked] con motivo "requiere cierre legal".

- ✅ SÍ se construye de la terminal: layout display, navegador de mercados (buscador+categorías+
  watchlists★), multi-gráfico, panel de ANÁLISIS/noticias (no ticket), pestañas de VISTAS/alertas,
  alertas de precio, workspaces, tema oscuro.

- HONESTIDAD (playbook §nota responsable y §9): PROHIBIDO inventar premios/reseñas/reguladores/
  cifras de usuarios. Prueba social SOLO real y verificable (TradingView, Stripe) o se omite.
- CIFRAS: solo verificables (4 clases de activos · tiempo real vía TradingView · 24/7 cripto · ES).
- IDENTIDAD SMC: terminal oscuro + dorado, Geist Mono para números. Un ÚNICO acento (dorado) para
  CTA primarios. NO el azul/tema claro del playbook.
- Widgets TradingView: gratuitos display-only, lazy, sin abrir la CSP. Degradación limpia.
- Responsive: el CTA nunca desaparece en móvil. Tests de render por sección nueva.
- Si una tarea no avanza en 25 turnos -> [blocked] con motivo y seguir.
-->

## [done] 1. Spec (SDD): landing de conversión + terminal display, con lista de ESTACIONADOS
**Condición:** `docs/specs/product.md` actualizada ANTES de tocar código, con: (a) § Landing =
wireframe de 12 bloques adaptado al marco (header sticky+CTA persistente, hero doble-CTA+micro-copy+
visual, franja de cifras verificables, trío de valor, grid de mercados, sección plataforma, "por qué
elegirnos" con señales REALES, segmentación dual, recursos reales, prueba social verificable o
omitida, CTA de cierre numerado "Registrate → Elegí plan → Visualizá", footer denso); (b) nueva
§ Terminal display = layout 3+1 SOLO visualización/análisis (barra de estado sin dinero, navegador de
mercados, multi-gráfico, panel de análisis/noticias, pestañas de vistas/alertas) con su lista
EXPLÍCITA de features ESTACIONADAS (ejecución/depósito/custodia/dark-patterns) remitida a
`docs/decisiones/2026-07-04-giro-regulatorio.md`. En UN commit `docs:`.
**Check (imprimir):** `git log --oneline -1` = commit `docs:` · `grep -n "Terminal display\|
ESTACIONAD\|embudo\|por qué elegirnos" docs/specs/product.md` · `grep -ci "broker" docs/specs/product.md`
no aumenta respecto a baseline.
**No tocar:** Código todavía. No especificar ejecución/depósito/custodia como "a construir". No push.
**Evidencia:** Commit `b06db52 docs:`. Agregadas a `product.md` dos secciones: "Landing —
arquitectura de conversión" (12 bloques adaptados al marco, con términos prohibidos y regla de
honestidad) y "Terminal display — cockpit 3+1" (layout A-E solo visualización + lista explícita de
ESTACIONADOS remitida a docs/decisiones). `grep broker` = 1 (baseline, sin aumento). Sin push.

## [done] 2. Landing: header sticky + hero doble-CTA + franja de cifras
**Condición:** header `site-header.tsx` sticky con sombra al despegar y CTA de acento persistente
(hamburguesa móvil, CTA nunca desaparece); hero con doble CTA (primario + ghost) + micro-copy de baja
fricción + visual/mockup; StatsStrip bajo el hero con las 4 cifras verificables. Above-the-fold claro
en 5s. 1-2 commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 · `pnpm build` exit 0 · `npx tsc --noEmit` limpio ·
`grep -rn "sticky" components/landing/site-header.tsx` · `grep -rEci "operá|operar|depositá|broker"
components/landing` = 0 · `git log --oneline -2`.
**No tocar:** No romper header/nav/auth. No push.
**Evidencia:** Commit `2920408 feat:`. `site-header.tsx` (server, resuelve usuario) delega a nuevo
`header-chrome.tsx` (cliente): sticky con **sombra al scroll** (scrollY>4 → shadow-sm), nav de 4
categorías (Cómo funciona/Mercados/Planes/Preguntas, anclas reales), **CTA de acento persistente**
(Crear cuenta visible también en móvil) y **menú hamburguesa** móvil. Hero: doble CTA ya existente +
**micro-copy** "Sin permanencia · Cancelá cuando quieras"; StatsStrip (4 cifras verificables) ya bajo
el hero. Checks: tsc limpio · vitest 87/87 exit 0 · build exit 0 · `sticky top-0` en header-chrome ·
guard operá/depositá/broker = 0 · lint 0. Sin push.

## [done] 3. Landing: trío de valor + sección plataforma + "por qué elegirnos"
**Condición:** trío de 3 tarjetas (adaptado al marco: p. ej. "Datos en tiempo real · Todo en un panel
· Pagos seguros"); sección plataforma a 2 columnas (screenshot/mockup del dashboard + features con
checks + CTA "Explorá la plataforma"); "¿Por qué elegirnos?" = 4 pilares con señales REALES (datos por
TradingView · pagos cifrados por Stripe · datos con RLS · español primero), sin sellos inventados.
Tests de render. 1-2 commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 · `pnpm build` exit 0 · `npx tsc --noEmit` limpio ·
`grep -rEci "premio|galardón|regulad" components/landing` (mostrar; sin sellos inventados) ·
`grep -rEci "broker|operar|custodia" components/landing` = 0 · `git log --oneline -2`.
**No tocar:** No inventar premios/reguladores. No push.
**Evidencia:** Commit `3ebe3b7 feat:`. `value-trio.tsx` (3 tarjetas: Datos en tiempo real/Todo en un
panel/Pagos seguros), `platform-section.tsx` (2 columnas: mockup CSS/SVG del terminal marcado
"vista ilustrativa" + features con checks + CTA "Explorá la plataforma"→/registro; NO usé el
screenshot real porque mostraba los widgets vacíos sin red), `why-us.tsx` (4 pilares REALES:
TradingView/Stripe/RLS/español, sin sellos inventados). Cableados en `app/page.tsx` (reemplacé
Features por ValueTrio para no duplicar grids). Test `conversion-sections.test.tsx`. Checks: tsc
limpio · vitest 92/92 exit 0 · build exit 0 · lint 0. Greps: "custodia/operar" solo en disclaimers
de negación (footer/FAQ "no custodia fondos"); "regulad" = "socios regulados" pre-existente +
comentario de honestidad; sin premios/reguladores inventados. Sin push.

## [done] 4. Landing: segmentación dual + recursos + CTA de cierre numerado
**Condición:** segmentación dual ("¿Nuevo en los mercados?" → Prueba/cómo funciona · "¿Ya seguís los
mercados?" → dashboard/paneles), cada uno con CTA; recursos SOLO reales (FAQ, /precios, cómo funciona;
sin webinars falsos, se omite si no hay); CTA de cierre con embudo numerado "1. Registrate → 2. Elegí
tu plan → 3. Visualizá los mercados" + CTA grande centrado; prueba social solo verificable (badges
TradingView/Stripe) o se omite. Tests de render. 1-2 commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 · `pnpm build` exit 0 · `npx tsc --noEmit` limpio ·
`grep -rn "Registrate\|Elegí tu plan\|Visualizá" components/landing app/page.tsx` ·
`grep -rEci "depositá|depósito|operá" components/landing` = 0 · `git log --oneline -2`.
**No tocar:** El embudo NO dice Depositá/Operá. No inventar prueba social. No push.
**Evidencia:** Commit `44d4e90 feat:`. `segments.tsx` (dual: "¿Nuevo en los mercados?"→Prueba/cómo
funciona · "¿Ya seguís los mercados?"→planes/panel, cada uno con CTA), `resources.tsx` (3 enlaces
REALES: cómo funciona, /precios, FAQ; sin webinars falsos), `closing-cta.tsx` (embudo numerado
01 Registrate → 02 Elegí tu plan → 03 Visualizá los mercados + CTA grande →/registro + badges de
prueba social honesta: TradingView/Stripe/RLS). Cableados en page.tsx (Cta→ClosingCta). Test
`closing-sections.test.tsx` incl. assert de que el embudo NO dice depositá/operá. Checks: tsc limpio
· vitest 96/96 exit 0 · build exit 0 lista /precios · grep embudo presente · guard depositá/depósito/
operá = 0 · lint 0. Sin push.

## [done] 5. Terminal display: shell 3+1 (navegador de mercados + multi-gráfico + panel análisis)
**Condición:** El dashboard adopta el layout de terminal SOLO display (sobre lo existente): (a) barra
de estado superior con plan/sesión y accesos (Mi plan, ajustes, salir) — SIN Fondos/Equidad/Margen/
Depositar; (b) panel izquierdo = buscador instantáneo + categorías de mercado (Forex/Índices/Materias/
Acciones/Cripto) + watchlists con estrella ★; (c) centro = gráfico (idealmente multi-gráfico o layout
guardable) con la atribución TradingView; (d) panel derecho = ANÁLISIS/NOTICIAS (detalle del símbolo,
añadir a watchlist, crear alerta) — NUNCA un ticket Comprar/Vender; (e) pestañas inferiores = Vistas/
Watchlist/Alertas (NO Posiciones/Órdenes). Grid CSS responsive, tema oscuro, Geist Mono en números,
degradación limpia. Tests de render de los paneles nuevos. 1-2 commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 · `pnpm build` exit 0 · `npx tsc --noEmit` limpio ·
`grep -rEci "comprar|vender|deposit|ticket|posición abierta|1-click" components/dashboard app/dashboard`
= 0 (sin capa de ejecución/dinero) · `git log --oneline -2`.
**No tocar:** NADA de ticket/orden/depósito/margen/P&L real. No abrir la CSP. No push. Si el diseño
pide ejecución -> [blocked] "requiere cierre legal".
**Evidencia:** Commit `479f2c7 feat:`. `terminal-status-bar.tsx` [A] (plan/sesión + Mi plan, SIN
Fondos/Equidad/Margen/P&L/Depositar), `market-navigator.tsx` [B] (buscador instantáneo + 5 categorías
Forex/Índices/Materias/Acciones/Cripto con símbolos, ★→onSelect), `terminal-cockpit.tsx` que sube el
estado y arma grilla [nav | gráfico | watchlist] reusando TradingViewChart+WatchlistPanel; center [C]
con selector de intervalos + atribución; [D] watchlist. Pestañas inferiores [E]=TerminalPanels (heatmap/
calendario/screener) como Vistas. `page.tsx` cableado. Test `market-navigator.test.tsx` (categorías,
filtro, onSelect, sin acciones de operación; status bar sin dinero). Checks: tsc limpio · vitest 100/100
· build exit 0 · guard comprar/vender/deposit/ticket/1-click = 0 (los matches eran comentarios, ya
reformulados) · lint 0. Sin push.

## [done] 6. Terminal display: alertas de precio + watchlists persistentes (análisis)
**Condición:** (a) **alertas de precio** — el usuario define un umbral por símbolo y se guardan
(tabla + RLS por usuario); disparo/notificación puede ser stub (log/email stub) documentado; es
análisis, no consejo ni ejecución; (b) **watchlists persistentes** por usuario (agregar/quitar
símbolos con ★). Gating por plan si aplica (p. ej. alertas limitadas en Bronce, ilimitadas en Plata),
leído de la tabla plans. Migración SQL con RLS. Tests unitarios de la lógica. 1-2 commits `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 con tests nuevos · `pnpm build` exit 0 ·
`npx tsc --noEmit` limpio · `grep -rn "alert\|watchlist" supabase` (migración presente) ·
`git log --oneline -2`.
**No tocar:** Sin ejecución ni "copiar a la orden". No prometer notificación en tiempo real si es stub.
No push.
**Evidencia:** Commit `43f9d63 feat:`. Migración `20260704200000_price_alerts.sql` (tabla + RLS
select/insert/update/delete own, anon revocado) **aplicada al proyecto** vía MCP. `lib/alerts/limits.ts`
(pura, testeable: prueba 3/bronce 5/plata·vip ilimitado; gap del seed documentado — no hay columna de
tope), `queries.ts` (listAlerts RLS), `actions.ts` (createAlert con gating canCreateAlert + validación;
deleteAlert). UI: `/dashboard/alertas` (lista + límite + form + borrar), `alert-form.tsx`,
`alert-delete-button.tsx`, link "Alertas" en sidebar. Notificación de disparo = STUB documentado en la
UI. Watchlists ya persistían (tabla previa). Tipos regenerados (`price_alerts` + alias PriceAlert).
Checks: tsc limpio · vitest 104/104 exit 0 · build exit 0 lista /dashboard/alertas · migración presente
· lint 0. Sin ejecución ni "copiar a la orden". Sin push.

## [done] 7. Gate final: pipeline verde + guardrails de marco
**Condición:** Pipeline en `develop`: `pnpm lint`, `pnpm format:check`, `pnpm vitest run`,
`pnpm build`, `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 pnpm test:e2e` — todos exit 0 (e2e en
serie contra `pnpm dev` tibio si el FS tumba el webServer; seguridad verde). Guard de marco:
`grep -rEi "broker|operá|operar|invertí|depositá|depósito|custodia|comprar/vender|1-click|rentabilidad
asegurada|ganás" components app` acotado a landing+dashboard = 0 coincidencias de ejecución/dinero.
Working tree sin tracked pendientes. Commit final si hace falta.
**Check (imprimir):** los 5 comandos exit 0 · el grep de guardrails con 0 coincidencias de la capa
estacionada · `git status --short` sin tracked pendientes · `git log --oneline -10`.
**No tocar:** No skip/only para "pasar". No bajar lint. No push.
**Evidencia:** Pipeline en `develop` verde: `pnpm lint` exit 0 · `pnpm format:check` exit 0 ·
`pnpm vitest run` 104/104 exit 0 · `pnpm build` exit 0 (lista /precios y /dashboard/alertas) ·
`playwright test --workers=1` 14 passed / 1 skipped / 0 failed (serial contra dev tibio; seguridad
verde). Fix `tests/e2e/dashboard.spec.ts` (commit `314afc0`): la aserción global de watchlist se acotó
al panel porque el navegador de mercados ahora lista NASDAQ:TSLA legítimamente — no es skip. Guard de
marco: las únicas coincidencias de "custodia/depósito/etc." son DISCLAIMERS en negación (footer/FAQ "no
custodia fondos", status-bar "NO muestra fondos... ni depósito"); cero ofrecimientos de ejecución/
dinero. `git status` sin tracked pendientes. Sin push.

<!--
Al terminar (7/7 done o [blocked]): merge develop→main + push los hace el asesor con OK del usuario.
SEGUNDO PASE (fuera de esta cola, BLOQUEADO): la capa de ejecución/depósito/custodia y el ajuste de
copy al nuevo alcance legal, solo cuando el cliente responda por escrito las 4 preguntas de
docs/decisiones/2026-07-04-giro-regulatorio.md y compliance lo confirme.
-->
