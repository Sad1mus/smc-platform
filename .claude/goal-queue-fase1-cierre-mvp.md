# Goal Queue — SMC · Cierre Fase 1 MVP (anexo 7→3, sin iOS ni Stripe)

estado: completada (5/5 done)
current: 5
turn_cap_por_item: 25
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: cerrar lo faltante autocompletable de la Fase 1 del MVP según el anexo estratégico
7→3 (Fase 1 = plataforma + apps + KYC). Continúa goal-queue-fase1-web.md (4/4) y
goal-queue-fase2-movil.md (4/4), ambas completadas.

EXCLUIDO A PROPÓSITO (human-gated — NO meter en esta cola, NO bloquear la cola por esto):
- Stripe COMPLETO (claves test/live, setup-stripe.mjs, webhook, checkout E2E): el usuario lo
  pidió explícitamente fuera. Cuando lleguen claves se hace aparte.
- iOS (build/publicación): requiere Apple Developer del cliente + build en nube. Excluido.
- Publicar en Google Play: requiere Play Console del cliente (USD 25). En esta cola solo se
  deja el AAB firmado LISTO para subir.
- Push notifications (Firebase del cliente).
- Site URL + Redirect URLs en dashboard Supabase (sin token de management; el usuario lo hace
  a mano — ya tiene los valores exactos).
- Legales con datos reales, OAuth Google en dashboard, claves RESEND/SENTRY.
- Merge develop→main y push: los hace el asesor con OK del usuario (merge autorado por
  smartmoney4 para no bloquear el auto-deploy de Vercel).

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).
- Todos los comandos se corren dentro de `repo`. pnpm está en ~/.local (PATH).
- Al inicio de cada turno, reimprimir el estado de la cola (X/5 done, tarea actual).
- Commits como Sad1mus (git config del repo ya correcto), sin Co-Authored-By ni footer.
  Trabajar en `develop`. NUNCA `git push`.
- SDD: la spec manda; si algo la contradice, actualizar docs/specs/ primero.
- MARCO REGULATORIO: solo visualización; prohibido "broker" en copy pública; atribución
  TradingView visible; nada que sugiera custodia o promesa de rentabilidad.
- No debilitar lo hecho: RLS, headers OWASP/CSP, paywall fail-closed, service_role solo server.
- NO tocar el otro proyecto Supabase de la org (wtxxapniroedkmxjvvuw). El del cliente es
  czpegpattyvspxjigvij; cambios de esquema SOLO aditivos (tabla/política nueva), jamás alterar
  tablas existentes desde esta cola.
- E2E: PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64. Si el webServer de Playwright
  expira (máquina lenta), levantar `pnpm dev` aparte, esperar 200 en localhost:3000 y reusar
  (reuseExistingServer ya está activo).
- Si una tarea no avanza en 25 turnos -> [blocked] con motivo y seguir con la siguiente.
-->

## [done] 1. Spec KYC + fundaciones (SDD): migración, RLS y capa provider-agnostic
**Condición:** Existe `docs/specs/kyc.md` (alcance Fase 1: verificación de identidad detrás de
flag `NEXT_PUBLIC_ENABLE_KYC` default off, arquitectura provider-agnostic con proveedor stub;
difiere explícitamente: proveedor real de pago-por-verificación, biometría documental) enlazada
desde `docs/specs/README.md`, y `docs/specs/hardening.md` actualizada (KYC pasa de "diferido" a
"flag-gated, stub en Fase 1"). Migración nueva ADITIVA en `supabase/migrations/` creando
`public.kyc_verifications` (id, user_id FK a profiles, status enum: unverified|pending|approved|
rejected, provider, provider_ref, created_at/updated_at) con RLS: dueño SELECT, escrituras solo
service_role (mismo patrón que payment_events). Migración APLICADA al proyecto del cliente
`czpegpattyvspxjigvij` vía MCP `apply_migration`. `lib/kyc/` con interfaz `KycProvider`,
`StubKycProvider` determinista (apto para tests) y `getKycStatus(userId)`. Tests unitarios de la
capa. En UN commit `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 con los tests nuevos · `npx tsc --noEmit` limpio ·
salida de `list_migrations`/`execute_sql` (MCP) mostrando la tabla con RLS activa ·
`git log --oneline -1` muestra el commit `feat:`.
**No tocar:** Tablas/políticas existentes. Nada de service_role en el cliente. No inventar
proveedor externo real (stub only). No `git push`.
**Evidencia:** Commit `a030fc7 feat:`. `docs/specs/kyc.md` + índice + hardening.md actualizados.
Migración `20260702162620_kyc_verifications` aplicada vía MCP (versión = archivo local) y
verificada: rls=true, 1 policy select-own, authenticated sin INSERT, anon sin SELECT. Tipos
regenerados (KycVerification, KycStatus). `lib/kyc/` (KycProvider, StubKycProvider determinista,
getKycProvider, isKycEnabled, getKycStatus). Vitest 60/60 exit 0 · tsc exit 0. Sin push.

## [done] 2. KYC UI: estado de verificación + flujo stub detrás del flag
**Condición:** En el área de usuario (perfil/dashboard) existe la sección "Verificación de
identidad" que muestra el estado (no verificado / pendiente / aprobado / rechazado) y permite
iniciar la verificación (crea fila `pending` vía server action que usa el cliente admin
server-only; el stub la resuelve según su regla determinista). Con `NEXT_PUBLIC_ENABLE_KYC`
ausente u off: la UI NO aparece y el comportamiento actual queda idéntico (mismo patrón que
BiometricGate). Diseño coherente con la identidad (terminal oscuro + dorado; usar impeccable +
emil-design-eng). `.env.example` actualizado. Tests: flag off no renderiza; flag on renderiza y
cambia estado con el stub. En UN commit `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 con los tests nuevos · `pnpm build` exit 0 ·
`npx tsc --noEmit` limpio · `grep -rn "ENABLE_KYC" .env.example` · `git log --oneline -1`.
**No tocar:** No exponer service_role al navegador. No degradar el flujo actual sin flag. No
bloquear el paywall/dashboard existente por KYC (el gate KYC NO es bloqueante en Fase 1). No `git push`.
**Evidencia:** Commit `a699938 feat:`. `KycCard` (RSC, 4 estados con badge/icono) +
`KycVerifyButton` (client, useTransition, error amable) en /dashboard/plan; `startKycVerification`
server action vía admin client (service_role server-only, degrada amable sin la key). Flag
NEXT_PUBLIC_ENABLE_KYC en .env.example (default off; sin flag KycCard → null, cero cambios).
Tests kyc-ui (8): flag off/on, estados, upsert onConflict user_id, rechazo stub, fallo escritura.
Vitest 68/68 · build exit 0 · tsc exit 0. Sin push.

## [done] 3. Android release firmado: keystore + AAB listo para Play
**Condición:** Keystore de release generado FUERA del repo en `$HOME/.android-keys/smc-release.keystore`
(keytool, alias `smc`), con `mobile/android/keystore.properties` gitignored (y un
`keystore.properties.example` versionado). `signingConfig release` en el Gradle del app module
leyendo de ese properties. `./gradlew bundleRelease` exit 0 produce `app-release.aab` FIRMADO;
`./gradlew assembleRelease` produce APK firmado. `versionCode 1` / `versionName "1.0.0"`
coherentes. `mobile/README.md` documenta la custodia del keystore (advertencia: perderlo = no
poder actualizar la app en Play; hacer backup cifrado) y el paso exacto de subida a Play Console
(human-gated). En UN commit `feat:` o `chore:`.
**Check (imprimir):** `cd mobile/android && ./gradlew bundleRelease` exit 0 ·
`ls -la mobile/android/app/build/outputs/bundle/release/` muestra el .aab con tamaño ·
verificación de firma del AAB/APK visible (jarsigner -verify o apksigner, SIN imprimir passwords) ·
`git status --short` sin el keystore ni properties reales · `git log --oneline -1`.
**No tocar:** No commitear keystore ni passwords (verificar con git status). No tocar el código
web. No subir nada a Play. No `git push`.
**Evidencia:** Commit `8bc9b8c feat:`. Keystore en `~/.android-keys/smc-release.keystore` (alias
smc, RSA 2048, 10000 días, password aleatoria chmod 600, fuera del repo). `keystore.properties`
gitignored (verificado: git status sin el archivo) + `.example` versionado. signingConfig release
condicional en app/build.gradle; versionName 1.0.0. `bundleRelease` BUILD SUCCESSFUL 2m51s →
app-release.aab 4.99MB; `jarsigner -verify` = "jar verified."; `assembleRelease` → APK 5.7MB.
README con custodia del keystore (backup cifrado, advertencia crítica). Sin push.

## [done] 4. Deseables web: /precios (ZEN-11) + vercel.json y README real (ZEN-10) + e2e registro determinista
**Condición:** (a) Decidir en `docs/specs/product.md` el destino de `/precios` (ruta propia con
los planes del dossier o redirect permanente a `/#planes`) y implementarlo acorde — SDD: spec
primero. (b) `vercel.json` mínimo versionado (framework y config real del proyecto; sin secretos)
y README con setup real del proyecto (reemplaza el boilerplate de create-next-app: requisitos,
env vars por nombre, comandos, deploy) sin datos comerciales de agencia. (c) El test e2e de
registro deja de fallar por el rechazo de dominios sintéticos del email de Supabase: detecta esa
respuesta y hace skip anotado (test.skip con razón visible) o usa una estrategia determinista;
la suite completa queda verde local. En UNO o DOS commits (`feat:`/`chore:`/`fix:`).
**Check (imprimir):** `pnpm build` exit 0 (lista `/precios` si es ruta) · `pnpm vitest run` exit 0 ·
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 pnpm test:e2e` exit 0 (0 failed; skips anotados
OK) · `cat vercel.json` · `git log --oneline -2`.
**No tocar:** Precios inmutables del dossier (no inventar ni redondear). No marcar otros tests
skip/only. No debilitar CSP/headers desde vercel.json. No `git push`.
**Evidencia:** Commit `637845e feat:`. (a) `/precios` como ruta propia (la spec product.md ya la
definía como superficie brand — sin cambio de spec): SiteHeader + hero + `<Plans/>` reutilizado +
footer; build lista `ƒ /precios`. (b) vercel.json (framework + región iad1 pareada con Supabase
us-east-1) + sección Deploy en README (el README ya era real de colas anteriores; ZEN-10 cierra
con vercel.json + deploy documentado); brand actualizado a (`/`, `/precios`). (c) e2e registro:
segundo test.skip anotado para el rechazo de dominios sintéticos del validador de Supabase.
Checks: build exit 0 · vitest 68/68 exit 0 · e2e 14 passed + 1 skipped anotado exit 0. Sin push.

## [done] 5. Gate final: pipeline completo verde + documento de entrega Fase 1
**Condición:** Pipeline completo verde en `develop` con todo lo anterior integrado: `pnpm lint`,
`pnpm format:check`, `pnpm vitest run`, `pnpm build`, e2e (con override de plataforma) — todos
exit 0 — y `./gradlew bundleRelease` exit 0 (mobile). Existe `docs/ENTREGA-FASE1.md`: estado de
cada entregable del MVP Fase 1 (hecho / human-gated) y el checklist EXACTO de lo que falta y
quién lo destraba: claves Stripe test+live, Site URL/Redirect URLs en Supabase, legales con
datos reales, OAuth Google, RESEND/SENTRY, Google Play Console (subir el .aab), Apple Developer
(iOS), Firebase (push). SIN cifras comerciales de agencia (eso vive fuera del repo). Working
tree limpio (tracked). Commit final si hace falta.
**Check (imprimir):** los 6 comandos con exit 0 visibles · `sed -n '1,50p' docs/ENTREGA-FASE1.md` ·
`git status --short` sin tracked pendientes · `git log --oneline -6`.
**No tocar:** No marcar tests skip/only para "pasar". No bajar reglas de lint. No `git push`.
**Evidencia:** Commit `b7416d2 docs:`. Pipeline completo en develop, todos exit 0: eslint ·
prettier --check · vitest 68/68 · next build · e2e Playwright 14 passed + 1 skipped anotado ·
gradle bundleRelease BUILD SUCCESSFUL. `docs/ENTREGA-FASE1.md` con tabla de entregables hechos
y checklist human-gated (Stripe, Supabase Auth URLs, legales, Play, Apple, Firebase, Resend/
Sentry, KYC proveedor real, dominio) SIN cifras de agencia. git status sin tracked pendientes.
Sin push.

<!--
Al terminar la cola (5/5 done o [blocked] justificado), la Fase 1 del anexo queda a la espera
SOLO de lo human-gated listado en docs/ENTREGA-FASE1.md. El merge develop→main y push los hace
el asesor con OK del usuario.
-->
