# Goal Queue — SMC · Plataforma de Visualización de Mercados (MVP Fase 0)

estado: activa
current: 8
turn_cap_por_item: 25

<!-- Supabase proyecto: czpegpattyvspxjigvij (smc-platform, us-east-1) -->
<!-- Supabase URL: https://czpegpattyvvspxjigvij.supabase.co — verificar con get_project_url -->
<!-- Otro proyecto en la org (NO TOCAR): wtxxapniroedkmxjvvuw (app legal de otro trabajo) -->

<!--
MEGAGOAL del proyecto SMC según dossier SMC_s.pdf (Fase 0 — MVP).
Proyecto: ~/Documentos/Agencia/orvex/smc-platform/

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]

Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).
- Al inicio de cada turno, imprimir el estado de la cola (X/10 done, tarea actual).
- Git: trabajar en rama `develop`, commit al cerrar cada tarea. NUNCA push directo a main.
- NO commitear node_modules, .env ni secretos. Mantener .env.example actualizado.
- Usar las skills instaladas en .claude/skills/: impeccable y emil-design-eng para todo
  el diseño/animación; next-best-practices, supabase, stripe-best-practices, shadcn,
  deploy-to-vercel según la tarea.
- MARCO REGULATORIO (dossier): la plataforma es de VISUALIZACIÓN únicamente. Prohibido:
  ejecutar órdenes, custodiar fondos, usar la palabra "broker" en cualquier texto.
  Atribución "by TradingView" siempre visible.
- Stripe SIEMPRE en test mode. Campos de tarjeta solo en Stripe (PCI-DSS SAQ-A).
- MCP disponibles: Supabase (crear proyecto/migraciones) y Vercel (deploy).
- Credenciales externas (Stripe test keys, SENTRY_DSN, RESEND_API_KEY): si falta una,
  pedirla al usuario UNA vez en el turno; si no llega, implementar con stub/variable
  documentada en .env.example, dejar nota y continuar (NO bloquear la cola por esto).
- Planes del dossier (precios exactos): Bronce USD 1.500 · Plata USD 2.800 ·
  VIP personalizado (contacto) · Prueba USD 250.
-->

## [done] 1. Scaffold Next.js + tooling + git
**Condición:** proyecto Next.js (App Router) con TypeScript estricto, Tailwind CSS y
shadcn/ui inicializado en la raíz de smc-platform/, con ESLint + Prettier, estructura
de carpetas (`app/`, `components/`, `lib/`, `types/`), `.gitignore` y `.env.example`,
y repo git inicializado con ramas `main` y `develop`.
**Check (imprimir):**
- `pnpm lint && pnpm build` exit 0
- `git branch -a` muestra main y develop; `git log --oneline -1` en develop
- `ls` de la estructura de carpetas
**No tocar:** no crear páginas de negocio todavía; no instalar dependencias que no se usen.
**Evidencia:** Next.js 16.2.7 + React 19.2.4 + TS estricto + Tailwind 4 + shadcn (radix-nova,
lib/utils.ts, theme en globals.css) + Prettier. `pnpm lint && pnpm build` exit 0 (lint limpio,
build genera / y /_not-found estáticas). Ramas main y develop creadas; HEAD develop = 22fb20c.
Estructura app/, components/ui/, lib/, types/, hooks/ + .env.example documentado. pnpm 11.5.0
instalado en ~/.local (corepack del sistema roto). .claude/ excluido de ESLint/Prettier.

## [done] 2. Supabase — proyecto, esquema y RLS
**Condición:** proyecto Supabase creado (vía MCP), con migraciones versionadas en
`supabase/migrations/` que crean `profiles`, `plans`, `subscriptions` y `payment_events`
(modelo normalizado del dossier), TODAS con Row-Level Security activa y políticas
definidas; seed con los 4 planes y precios exactos del dossier; tipos TypeScript
generados en `types/database.ts`.
**Check (imprimir):**
- Lista de tablas (MCP `list_tables`) mostrando `rls_enabled: true` en las 4 tablas
- MCP `get_advisors` (security) sin hallazgos críticos
- `pnpm build` exit 0 con los tipos generados importados
- `git log --oneline -1` en develop
**No tocar:** la service_role key jamás llega al cliente; anon key solo con RLS.
**Evidencia:** Proyecto Supabase "smc-platform" creado (czpegpattyvspxjigvij, us-east-1, $0/mes,
Postgres 17). 3 migraciones aplicadas y versionadas en supabase/migrations/ (initial_schema,
seed_plans, harden_function_privileges). list_tables: profiles/plans/subscriptions/payment_events
todas con rls_enabled=true; plans con 4 filas (Bronce 1500, Plata 2800, VIP custom, Prueba 250).
get_advisors: 0 críticos (1 INFO intencional + 1 WARN intencional de is_admin). types/database.ts
generado. pnpm build exit 0. Commit f010466 en develop. NOTA: el proyecto preexistente
wtxxapniroedkmxjvvuw es de otra app (legal) — no se tocó.

## [done] 3. Autenticación completa (Supabase Auth)
**Condición:** registro con email/contraseña + verificación, login, logout, recuperación
de contraseña y OAuth Google funcionando con `@supabase/ssr` (cookies httpOnly);
middleware que protege `/dashboard/*`; RBAC con roles `user`/`admin` en `profiles`;
páginas de auth construidas con shadcn/ui.
**Check (imprimir):**
- `pnpm test` (Vitest, helpers de auth) exit 0
- Playwright E2E: registro → login → `/dashboard` accesible → logout → `/dashboard`
  redirige a `/login` — resultado exit 0 visible
- `pnpm build` exit 0 · `git log --oneline -1`
**No tocar:** nada de tokens en localStorage; sesión solo en cookies httpOnly.
**Evidencia:** Vitest 14/14 passed (validación zod). Playwright: proxy-redirect ✓, login→dashboard→
logout→redirect ✓, credenciales inválidas ✓ (3 passed; registro skipped por rate limit de 2
emails/hora del free tier — flujo verificado contra Supabase, se resuelve con Resend en T8).
pnpm lint+build exit 0 — proxy.ts (Next 16) detectado, rutas /login /registro /recuperar
/actualizar-password /auth/callback /auth/confirm /dashboard. Sesión en cookies httpOnly vía
@supabase/ssr. RBAC con getProfile/isAdmin. OAuth Google implementado (requiere credenciales en
dashboard Supabase para activarse). Fixture e2e@smc.test confirmado en BD. Commits cf29ef7 + 8827779.

## [done] 4. Diseño base — landing + shell del dashboard (impeccable + emil-design-eng)
**Condición:** landing pública (hero, sección de planes con los 4 precios exactos del
dossier, CTA de prueba USD 250), shell del dashboard (sidebar, header, navegación),
dark mode, mobile-first responsive; animaciones y micro-interacciones aplicando la
skill emil-design-eng; auditoría de diseño con la skill impeccable ejecutada y sus
hallazgos corregidos.
**Check (imprimir):**
- Screenshots Playwright de landing y dashboard en 375px y 1440px (adjuntos/descritos)
- Resultado de la auditoría impeccable visible y hallazgos críticos = 0
- `grep -ri "broker" app/ components/` sin resultados
- `pnpm build` exit 0 · `git log --oneline -1`
**No tocar:** precios exactos del dossier; jamás la palabra "broker".
**Evidencia:** Landing completa (hero + strip de cotizaciones + características + planes desde
Supabase con precios exactos del dossier + prueba $250 + footer con disclaimer) y shell del
dashboard (sidebar, nav móvil, theme toggle, user dropdown). Tokens OKLCH oscuro+dorado del
dossier, dark default con next-themes. Detector impeccable: 0 anti-patrones (JSON []). grep
broker: 0 matches. Screenshots landing/dashboard en 375px y 1440px verificados visualmente.
E2E auth re-validado con nuevo shell: 3 passed. pnpm lint+build exit 0. PRODUCT.md creado.
Commit en develop.

## [done] 5. Dashboard TradingView (tiempo real)
**Condición:** `/dashboard` protegido muestra el widget TradingView Advanced Charts con
datos en tiempo real (WebSocket del widget), selector de símbolos e intervalos,
watchlist del usuario persistida en Supabase (con RLS), y atribución "by TradingView"
visible conforme a sus términos.
**Check (imprimir):**
- Playwright E2E autenticado: `/dashboard` contiene el iframe/script de TradingView y
  el texto de atribución — exit 0
- Test de persistencia de watchlist (guardar símbolo → recargar → sigue) exit 0
- `pnpm build` exit 0 · `git log --oneline -1`
**No tocar:** cero funcionalidad de ejecución de órdenes; solo visualización.
**Evidencia:** Widget oficial TradingView Advanced Real-Time Chart embebido (iframe con WebSocket),
tema sincronizado, locale es. Selector de 7 intervalos + selector de símbolos vía watchlist.
Migración watchlists aplicada (RLS propia por usuario) + types actualizados + server actions zod.
Atribución "Gráficos by TradingView" visible (link). E2E 3/3 passed: iframe presente con src
tradingview, cambio de intervalo regenera widget, watchlist agregar→recargar→persiste→eliminar.
Suite completa: 14 unit + 10 E2E passed. pnpm lint+build exit 0. Commit 4e71144.

## [blocked] 6. Stripe — planes, checkout y customer portal
**Condición:** productos/precios creados en Stripe TEST mode (Bronce 1500, Plata 2800,
Prueba 250 USD; VIP como "contactar"), página de pricing conectada a Stripe Checkout
(hosted), páginas success/cancel, y customer portal habilitado para gestionar la
suscripción.
**Check (imprimir):**
- Listado de precios desde la API de Stripe (SDK o CLI) mostrando los 3 precios + modo test
- Playwright E2E: usuario logueado → pricing → clic en plan → redirección a
  `checkout.stripe.com` (URL impresa)
- `pnpm build` exit 0 · `git log --oneline -1`
**No tocar:** solo test mode; ningún campo de tarjeta propio (SAQ-A); claves solo en .env.
**Evidencia:** BLOCKED — el usuario eligió continuar sin claves de Stripe (respuesta a la pregunta
del turno). CÓDIGO 100% LISTO (commit 9c1596c): checkout sessions (suscripción mensual bronce/plata
+ pago único prueba), customer portal, /dashboard/plan con UI completa y degradación sin claves,
scripts/setup-stripe.mjs idempotente. Build + suite completa pasan (14 unit + 10 E2E).
PARA DESBLOQUEAR: (1) agregar STRIPE_SECRET_KEY=sk_test_... y NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
a .env.local, (2) node scripts/setup-stripe.mjs, (3) verificar checks de esta tarea.

## [blocked] 7. Webhooks Stripe + gating de acceso por suscripción
**Condición:** endpoint `/api/webhooks/stripe` con verificación de firma e idempotencia
que maneja `checkout.session.completed`, `invoice.paid`,
`customer.subscription.updated` y `customer.subscription.deleted`, actualizando
`subscriptions` y `payment_events` en Supabase; gating real: sin suscripción activa →
paywall; con suscripción activa → dashboard completo.
**Check (imprimir):**
- Test de webhook (stripe CLI `trigger` o test unitario con firma simulada) exit 0,
  mostrando la fila actualizada en `subscriptions`
- Test E2E de gating (sin sub → paywall; con sub simulada → dashboard) exit 0
- `pnpm build` exit 0 · `git log --oneline -1`
**No tocar:** service_role solo en servidor; el webhook rechaza firmas inválidas (test incluido).
**Evidencia:** BLOCKED — mismo bloqueador que T6 (sin claves Stripe ni SUPABASE_SERVICE_ROLE_KEY).
CÓDIGO 100% LISTO (commit 9c1596c): webhook /api/webhooks/stripe con verificación de firma,
idempotencia vía payment_events (unique stripe_event_id), manejo de checkout.session.completed /
invoice.paid / customer.subscription.updated/deleted, sync a subscriptions, lib/supabase/admin.ts
(service_role), lib/subscription/queries.ts (getActiveSubscription para gating). El gating de UI
se activa cuando haya suscripciones reales. PARA DESBLOQUEAR: claves + stripe listen/trigger +
tests de gating.

## [in-progress] 8. Seguridad (OWASP) + emails transaccionales
**Condición:** headers de seguridad (CSP, HSTS, X-Frame-Options, Referrer-Policy),
rate limiting en rutas de auth y API, mitigación CSRF/XSS, `/security-review` ejecutado
con 0 hallazgos críticos sin resolver; emails transaccionales con Resend (bienvenida y
confirmación de pago) o stub documentado si no hay API key.
**Check (imprimir):**
- `curl -I` del dev server mostrando los headers de seguridad
- Resultado de `/security-review` visible: hallazgos críticos = 0
- Test de rate limiting (N requests seguidas → 429) exit 0
- `pnpm build` exit 0 · `git log --oneline -1`
**No tocar:** no debilitar políticas RLS ni desactivar verificación de firma de webhooks.
**Evidencia:**

## [pending] 9. Suite de tests completa + CI/CD (GitHub Actions)
**Condición:** suite Vitest (unitarios) + Playwright (E2E de los flujos críticos: auth,
pricing→checkout, gating, dashboard) pasa completa en local; workflow
`.github/workflows/ci.yml` con jobs lint → test → build; repo subido a GitHub con
`main` y `develop`.
**Check (imprimir):**
- `pnpm test` exit 0 y `pnpm exec playwright test` exit 0 (resumen de tests impreso)
- `gh repo view` muestra el repo; `gh run list --limit 1` muestra CI en verde
  (o, si el push del workflow está pendiente, `actionlint` exit 0 sobre ci.yml)
- `git log --oneline -1` en develop
**No tocar:** prohibido marcar tests como skip/only para que la suite pase.
**Evidencia:**

## [pending] 10. Deploy a producción (Vercel) + observabilidad
**Condición:** app deployada en Vercel en producción con variables de entorno
configuradas, Sentry integrado (o stub documentado si no hay DSN), y smoke test contra
la URL de producción: landing responde 200, login funciona, `/dashboard` exige sesión.
**Check (imprimir):**
- URL de producción + `curl -I` → 200
- Vercel MCP `get_deployment` → estado READY
- Smoke test Playwright contra producción (landing, login, gating) exit 0
- `git log --oneline -1` · tag `v0.1.0-mvp` creado
**No tocar:** claves de producción jamás en el repo; el deploy sale de la rama main vía PR.
**Evidencia:**
