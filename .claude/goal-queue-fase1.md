# Megagoal — Pre-go-live de SMC (readiness sin claves)

estado: completada (4/4 done)
current: 4
turn_cap_por_item: 20
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: avanzar el proyecto SIN depender de credenciales del usuario, dejándolo
listo para un go-live seguro el día que se peguen las claves (Stripe/Resend/Sentry/Google).
Fuente de verdad: dossier docs/specs/ + /home/sadimus/Documentos/broker/SMC_s.pdf (Fase 1).

EXCLUIDO A PROPÓSITO (no meter en esta cola):
- Activar Stripe/Resend/Sentry/Google OAuth → necesita claves del usuario.
- Vercel Firewall/WAF → se administra en el dashboard de Vercel (no hands-free).
- Caché distribuida (Redis) → DIFERIDA hasta presión real de carga/costo.
- KYC/AML → solo si un procesador o regulador lo exige; no construir especulativo.
- Apps móviles (Fase 2) → diferidas hasta retención + usuarios que pagan.

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).
- Todos los comandos se corren dentro de `repo`.
- Al inicio de cada turno, reimprimir el estado de la cola (X/4 done, tarea actual).
- Commits como Sad1mus, sin Co-Authored-By ni footer. NUNCA `git push`.
- No debilitar lo ya hecho: RLS, headers OWASP, paywall fail-closed, verificación de firma del webhook.
- Si una integración pide una clave para correr, el código debe DEGRADAR con gracia (no romper el build).
-->

## [done] 1. Specs de Fase 1 en docs/specs/ (observabilidad + hardening)
**Condición:** Existen `docs/specs/observabilidad.md` y `docs/specs/hardening.md`, derivadas del dossier (Fase 1), cada una con secciones **Objetivo**, **Criterios de aceptación (verificables)** y **Fuera de alcance** (declarando explícitamente que caché distribuida y KYC/AML quedan diferidas y por qué). El índice `docs/specs/README.md` los enlaza. Todo en UN commit `docs:`.
**Check (imprimir):** `ls <repo>/docs/specs/` lista ambos archivos + README · `grep -l "Criterios de aceptación" <repo>/docs/specs/observabilidad.md <repo>/docs/specs/hardening.md` (ambos) · `git -C <repo> log --oneline -1` muestra el commit `docs:`.
**No tocar:** No inventar requisitos fuera del dossier (`docs/specs/product.md` + SMC_s.pdf). No código de app. No `git push`.
**Evidencia:** Commit `fe35056 docs:`. `docs/specs/{observabilidad,hardening}.md` creados, ambos con "Criterios de aceptación" y "Fuera de alcance" (caché distribuida + KYC diferidas). Índice actualizado.

## [done] 2. Wiring de observabilidad (Sentry, condicional al DSN)
**Condición:** Sentry instrumentado de verdad (client + server + edge / `instrumentation.ts` segun Next 16), un error boundary global, y logging estructurado en los route handlers/server actions críticos (webhook Stripe, checkout, auth). TODO condicional a `NEXT_PUBLIC_SENTRY_DSN`: sin DSN el build pasa y no se envía nada (degradación elegante). En UN commit `feat:`.
**Check (imprimir):** Listar los archivos de instrumentación creados/modificados · `cd <repo> && npx tsc --noEmit` limpio · `cd <repo> && pnpm vitest run` exits 0 · `cd <repo> && pnpm build` exits 0 (sin DSN configurado) · `git -C <repo> log --oneline -1`.
**No tocar:** No requerir el DSN para que build/tests pasen. No debilitar la CSP ni los headers de seguridad (agregar dominios de Sentry a la CSP si hace falta, sin abrir de más). No `git push`.
**Evidencia:** Commit `5a2c11d feat:`. Sentry ya cubría client+server+edge (instrumentation*.ts) + global-error. Agregado: `lib/observability/logger.ts` (JSON + captureError→Sentry condicional), `/api/health`, logging en webhook/checkout/auth, y `*.sentry.io` en CSP connect-src. tsc OK · vitest 31/31 · build exit 0 sin DSN.

## [done] 3. Script pre-flight de go-live (scripts/preflight.mjs)
**Condición:** Existe `scripts/preflight.mjs` que (a) verifica la presencia de TODAS las env vars de `.env.example`, y (b) si están, hace un ping de salud a Supabase / Stripe / Resend / Sentry, imprimiendo un reporte legible OK/FALTA por integración. Sin claves, reporta los faltantes con claridad y SIN stack trace no manejado. NUNCA imprime el valor de un secreto (solo presente/ausente). Documentado en el README. En UN commit `feat:`.
**Check (imprimir):** `cd <repo> && node scripts/preflight.mjs` corre e imprime el reporte (con los faltantes marcados; exit != 0 es aceptable si faltan claves, pero la salida debe ser legible, sin excepción no controlada) · `grep -n "preflight" <repo>/README.md` · `git -C <repo> log --oneline -1`.
**No tocar:** No imprimir valores de secretos. No `git push`.
**Evidencia:** Commit `bedee3e feat:`. `node scripts/preflight.mjs` lista 8 faltantes + estado de salud (Supabase fetch-failed atrapado sin stack trace), exit 1. No imprime valores. README documenta `preflight` (línea 97).

## [done] 4. Tests de los flujos de pago (Stripe mockeado)
**Condición:** Tests unitarios nuevos que cubran, con Stripe y Supabase mockeados (sin red ni claves reales): (a) el webhook rechaza firma inválida, (b) idempotencia (mismo `stripe_event_id` no duplica), (c) `createCheckoutSession` reutiliza `stripe_customer_id` existente y NO crea customer duplicado (el fix de hoy). La suite completa pasa. En UN commit `test:`.
**Check (imprimir):** `cd <repo> && pnpm vitest run` exits 0 mostrando los nuevos tests pasando (firma inválida / idempotencia / no-duplicado) · `git -C <repo> log --oneline -1`.
**No tocar:** No usar claves ni red reales (todo mock). No marcar tests como skip/only para que pase. No `git push`.
**Evidencia:** Commit `ea15021 test:`. `tests/unit/payments.test.ts` (env node, todo mockeado) cubre firma inválida→400, idempotencia 23505→200, y reutilización de stripe_customer_id sin duplicar. Suite 34/34 · tsc OK.
