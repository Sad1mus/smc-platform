# Goal Queue — SMC · Cierre Fase 1 (parte WEB funcional)

estado: completada (4/4 done)
current: 4
turn_cap_por_item: 20
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: culminar la Fase 1 del MVP = TODA la parte web funcional, en lo que es
autocompletable por código y verificable en el transcript. Continúa las colas ya
completadas (goal-queue.md Fase 0, goal-queue-fase1.md readiness, goal-queue-cierre.md).

Estado actual (contexto real, jul 2026):
- Supabase del cliente (proyecto czpegpattyvspxjigvij, org smartmoney4) migrado y sano:
  esquema + RLS + planes sembrados. Ledger de migraciones reparado (versiones = archivos del repo).
- Prod VIVA en Vercel del cliente (team Smart Money's projects) vía deploy stopgap CLI sin git
  (dpl 7a6SdX...). Sirviendo el commit da97e06.
- Otro proyecto Supabase en la org (NO TOCAR): wtxxapniroedkmxjvvuw.

EXCLUIDO A PROPÓSITO (human-gated — NO meter en esta cola, NO bloquear la cola por esto):
- Stripe LIVE (ZEN-5): requiere cuenta Stripe verificada del cliente + claves live. El código ya
  está; falta provisionar. Se hace aparte con setup-stripe.mjs cuando lleguen las claves.
- Auto-deploy / transferir repo al GitHub del cliente + reconectar Vercel git: requiere admin del
  GitHub del cliente. Hoy la integración git está rota (deploys bloqueaban por autor no matcheado).
- Contenido legal REAL (razón social, jurisdicción) de las páginas legales: dato del cliente.
- Supabase/Vercel Pro: decisión comercial del cliente.
- KYC/AML y apps móviles (Fase 2): diferidos.

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).
- Todos los comandos se corren dentro de `repo`.
- Al inicio de cada turno, reimprimir el estado de la cola (X/4 done, tarea actual).
- Commits como Sad1mus, sin Co-Authored-By ni footer. Trabajar en `develop`. NUNCA `git push`.
- SDD: si cambia un requisito, actualizar docs/specs/ antes que el código.
- MARCO REGULATORIO: VISUALIZACIÓN únicamente. Prohibido "broker", ejecutar órdenes, custodiar
  fondos, prometer rentabilidad. Atribución "by TradingView" siempre visible. Stripe en test mode.
- No debilitar lo hecho: RLS, headers OWASP/CSP, paywall fail-closed, firma del webhook.
- Usar skills instaladas: impeccable + emil-design-eng (diseño/animación), next-best-practices,
  supabase, stripe-best-practices, shadcn según la tarea.
- Si una tarea no avanza en 20 turnos -> [blocked] con motivo y seguir con la siguiente.
-->

## [done] 1. Fix ZEN-8 — pago único no duplica filas en subscriptions
**Condición:** El path de pago ÚNICO del webhook (`app/api/webhooks/stripe/route.ts`) deja de
duplicar filas. Hoy hace upsert con `onConflict: stripe_subscription_id`, que es NULL en pagos
únicos (Postgres permite múltiples NULL -> una fila nueva por compra). Corregir usando una clave
de conflicto válida para one-time (p. ej. `stripe_payment_intent` / `stripe_event_id`) o separando
el path one-time del de subscription. Agregar test unitario (Stripe/Supabase mockeados) que pruebe
que **dos webhooks de pago único distintos NO crean filas duplicadas** y que uno repetido es
idempotente. En UN commit `fix:`.
**Check (imprimir):** `cd <repo> && pnpm vitest run` exits 0 mostrando el test nuevo de no-duplicado ·
`cd <repo> && npx tsc --noEmit` limpio · `git -C <repo> log --oneline -1` muestra el commit `fix:`.
**No tocar:** No debilitar la verificación de firma ni la idempotencia por `stripe_event_id`. Mock,
nada de red/claves reales. No marcar tests skip/only. No `git push`.
**Evidencia:** Commit `6ea133d fix:`. Path `payment` ahora hace select del acceso one-time
existente `(user_id, plan_id, stripe_subscription_id IS NULL)` → update si existe, insert si no
(reemplaza el upsert onConflict:stripe_subscription_id que no deduplicaba). Test table-aware
prueba insert-si-no-hay y update-si-existe (no fila nueva). Vitest 36/36, tsc exit 0. Sin push.

## [done] 2. ZEN-7 — panel /admin (ruta + UI sobre el RBAC existente)
**Condición:** Existe la ruta `app/admin/` (Server Component) protegida por `public.is_admin()` /
`profiles.role='admin'`: un usuario no-admin recibe 403/redirect, un admin ve una UI de gestión de
usuarios y suscripciones (listado read desde Supabase respetando RLS/rol). Diseño con impeccable +
emil-design-eng, coherente con la identidad (terminal oscuro + dorado). Test de control de acceso
(no-admin bloqueado / admin permitido). En UN commit `feat:`.
**Check (imprimir):** `cd <repo> && pnpm build` exits 0 y la salida lista la ruta `/admin` ·
`cd <repo> && pnpm vitest run` exits 0 con el test de acceso · `npx tsc --noEmit` limpio ·
`git -C <repo> log --oneline -1` muestra el commit `feat:`.
**No tocar:** No exponer `service_role` al cliente. No escribir tablas de cobro desde el cliente.
Respetar RLS. No `git push`.
**Evidencia:** Commit `7a70db0 feat:`. `app/admin/layout.tsx` (gate: no-auth→/login?next=/admin,
no-admin→/dashboard vía isAdmin()) + `app/admin/page.tsx` (tablas usuarios/suscripciones read-only
vía server client, RLS admin, SIN service_role). Test `admin-access.test.ts` (no-auth/no-admin
redirigen, admin renderiza). Build exit 0 lista `ƒ /admin`; vitest 39/39; tsc exit 0. Sin push.

## [done] 3. ZEN-6 — páginas legales (estructura + enlaces), contenido con placeholders
**Condición:** Existen las rutas `/terminos`, `/privacidad`, `/reembolsos` (renderizan 200) y están
enlazadas en el footer. El contenido usa plantillas con marcadores `[[RAZÓN SOCIAL]]`,
`[[JURISDICCIÓN]]`, etc., y un aviso `<!-- TODO: reemplazar con datos legales reales del cliente -->`
(el texto legal definitivo es dato del cliente = fuera de alcance de la cola). Sin usar la palabra
"broker" ni promesas de rentabilidad. En UN commit `feat:`.
**Check (imprimir):** `cd <repo> && pnpm build` exits 0 listando las 3 rutas ·
`grep -rEi "terminos|privacidad|reembolsos" <repo>/components` muestra los 3 links del footer ·
`grep -ri "broker" <repo>/app/terminos <repo>/app/privacidad <repo>/app/reembolsos` NO devuelve nada ·
`git -C <repo> log --oneline -1` muestra el commit `feat:`.
**No tocar:** No inventar cláusulas legales como si fueran reales (usar placeholders marcados). No `git push`.
**Evidencia:** Commit `c835544 feat:`. Rutas `/terminos`, `/privacidad`, `/reembolsos` (componente
compartido `LegalPage` + `LegalSection`) con contenido placeholder marcado `[[RAZÓN SOCIAL]]`,
`[[JURISDICCIÓN]]`, etc. + comentario TODO. Enlazadas en el footer (3 links). Build exit 0 lista las
3 rutas; grep "broker" vacío; tsc exit 0. Sin push.

## [done] 4. CI verde completo (gate final de la parte web)
**Condición:** El pipeline completo pasa localmente en `develop` con todo lo anterior integrado:
`lint -> format:check -> test (vitest) -> build -> e2e (playwright)`. Los tests e2e cubren el flujo
web sin Stripe live: registro, login, recuperación, acceso a dashboard y muro de pago (paywall).
Si algún commit de tareas 1-3 quedó pendiente de commitear, se cierra acá. En UN commit final si hace
falta (o ya limpio).
**Check (imprimir):** dentro de `<repo>`, correr y mostrar exit 0 de:
`pnpm lint` · `pnpm format:check` · `pnpm vitest run` · `pnpm build` ·
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 pnpm test:e2e` ·
`git -C <repo> status --short` limpio · `git -C <repo> log --oneline -3`.
**No tocar:** No marcar tests skip/only ni bajar reglas de lint para "pasar". No `git push`.
**Evidencia:** Commit `fa7dc1e style:` (prettier sobre legales + tests de T1/T2 que estaban sin
formatear). Pipeline final en `develop`: `eslint .` exit 0 · `prettier --check .` exit 0 · `vitest
run` 39/39 exit 0 · `next build` exit 0 · e2e Playwright 14 passed + 1 skipped (registro, requiere
alta Supabase real) exit 0. `git status` sin cambios tracked pendientes. Sin push.

<!--
Al terminar la cola (4/4 done o [blocked] justificado), lo que queda para el go-live de Fase 1
es SOLO lo human-gated: (a) transferir repo al GitHub del cliente + reconectar Vercel (auto-deploy),
(b) Stripe live con la cuenta del cliente (setup-stripe.mjs + preflight), (c) legales con datos
reales, (d) redeploy final + `node scripts/preflight.mjs` exit 0. Nada de eso corre en el loop.
-->
