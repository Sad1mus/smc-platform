# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> El `README.md` ya cubre stack, comandos y estructura de carpetas. Este archivo NO los repite:
> documenta la arquitectura de fondo y las convenciones no obvias que requieren leer varios archivos.

## Qué es (y la restricción que lo gobierna todo)

SMC es una **plataforma web de visualización de mercados** (display-only): gráficos TradingView en
tiempo real + cuentas + suscripciones Stripe. **No ejecuta órdenes, no custodia fondos, no es asesoría.**

**Restricción regulatoria dura, no estética:** la palabra **"broker" está prohibida** en toda copy
pública, y nada en el producto puede sugerir custodia, ejecución de órdenes ni promesa de rentabilidad.
Esto condiciona código _y_ texto. Ante cualquier feature o copy nueva, validar contra
`docs/specs/product.md` (sección anti-referencias y posicionamiento) antes de escribir.

## Spec-Driven Development — `docs/specs/` es la fuente de verdad

El código es salida generada a partir de la spec. **Antes de tocar una feature, leé su spec** (referenciar con `@`).
El índice vive en `docs/specs/README.md`; las que gobiernan más código:

- `docs/specs/product.md` — producto, marca, usuarios, precios exactos del dossier, restricciones regulatorias.
- `docs/specs/redesign.md` — **re-skin "Terminal editorial" (en implementación).** Texto congelado 1:1 (i18n); solo cambia lo visual. NO tocar copy/lógica/Supabase/Stripe/`proxy.ts`/rutas ni alturas de embeds TradingView. Define tokens (`--hairline`, escala tipográfica, motion) y principios rígidos (hairline como estructura, cifras mono, un solo acento dorado).
- `docs/specs/mobile.md` — shell nativo Capacitor Android (ver sección Móvil abajo).
- `docs/specs/observabilidad.md` — Sentry, logging, health endpoint; qué se difiere (APM/tracing) y por qué.
- `docs/specs/hardening.md` — headers OWASP, rate limiting, webhook firmado, RLS; qué se difiere (**KYC/AML**, caché distribuida) y por qué.
- `docs/specs/i18n.md`, `docs/specs/brand-smc-markets.md`, `docs/specs/admin.md` — i18n es/en, marca SMC Markets, y el panel `/admin` de observabilidad de pagos.

Si cambian los requisitos: **primero se actualiza la spec, después el código.** Features nuevas con lógica falsable agregan su propia `docs/specs/<feature>.md` enlazada desde `docs/specs/README.md`.

## Capas de Supabase (no mezclar — es la fuente de bugs de seguridad más probable)

Hay cuatro clientes con propósitos distintos; usar el correcto importa:

- `lib/supabase/client.ts` — navegador (componentes cliente).
- `lib/supabase/server.ts` — RSC y server actions (respeta RLS del usuario logueado).
- `lib/supabase/admin.ts` — **`service_role`, BYPASSA RLS**. `import "server-only"`. Solo webhooks/admin. Nunca exponer al cliente ni usarlo para datos pedidos por el usuario sin chequear permisos a mano.
- `lib/supabase/proxy.ts` — refresco de sesión dentro del middleware.

**RBAC / RLS:** el rol vive en `profiles.role` (`user` | `admin`); las políticas usan `public.is_admin()`.
Las escrituras a `plans`/`subscriptions`/`payment_events` están revocadas para `anon`/`authenticated`
y solo ocurren vía `service_role` (webhooks de Stripe). No intentes escribir esas tablas desde el cliente.

## Middleware: `proxy.ts` (no `middleware.ts`)

Next.js 16 renombró el middleware. El archivo raíz **`proxy.ts`** corre en cada request y hace dos cosas:
rate limiting por IP (`lib/security/rate-limit.ts`: 20/min en rutas auth, 60/min en API, ventana 60s) y
refresco de sesión Supabase. Para cambiar límites o rutas protegidas, es acá.

## Pagos (Stripe) — estado y modelo

Código completo (server actions, checkout, webhook idempotente) **pero el flujo no está verificado
end-to-end por falta de claves live**. El webhook (`app/api/webhooks/stripe/route.ts`) es **firmado e
idempotente**: cada evento se registra en `payment_events` por `stripe_event_id` único; si ya existe,
responde 200 sin reprocesar. Maneja `checkout.session.completed`, `invoice.paid`,
`customer.subscription.updated/deleted`. `scripts/setup-stripe.mjs` aprovisiona productos/precios (test mode).

**Precios inmutables del dossier** (no inventar ni redondear): Bronce $1.500 · Plata $2.800 · VIP personalizado · Prueba $250 USD.

## Modos de degradación (intencionales — no son bugs)

- **Sin `RESEND_API_KEY`** → emails en modo stub (solo log), no fallan.
- **Sin `NEXT_PUBLIC_SENTRY_DSN`** → Sentry no se instrumenta.
- **Sin `STRIPE_WEBHOOK_SECRET`** → el webhook responde 503 (no configurado).

Código nuevo que dependa de un servicio externo debería degradar igual, no romper el build/dev.

## Despliegue en la infra del cliente (Supabase + Vercel)

Esto corre en cuentas del **cliente (smartmoney4)**, no del dev. Los valores viven en `.env.local`
(gitignored) y en las env vars de Vercel; acá quedan los identificadores no obvios para no apuntar al lugar equivocado.

- **Supabase — org `asscxxyvtsefspimrmdv`.** Hay **dos** proyectos y es fácil confundirlos:
  - `czpegpattyvspxjigvij` — **"smc-platform", ACTIVE_HEALTHY, región `us-east-1`. ESTE es el de prod.**
  - `wtxxapniroedkmxjvvuw` — "smartmoney4's Project", **INACTIVE**. Legacy, **no usar**.
  - Las migraciones versionadas en `supabase/migrations/` son la fuente de verdad del schema; se aplican
    sobre el proyecto activo. No editar tablas a mano en el dashboard sin una migración que lo respalde.
- **Vercel — team `team_2FhhLxxrmRoKhTFnKbATBOG3`, proyecto `smc-platform` (`prj_3436K4h7ygqw4d69AeEtdYsgHN9T`),
  región `iad1`** (ver `.vercel/project.json` + `vercel.json`). El `hopibon-web` del mismo team es otro proyecto, ignoralo.
- **Dos remotes git — confirmá a cuál pusheás:** `origin` = `Sad1mus/smc-platform` (dev),
  `client` = `smartmoney4/smc-platform` (cliente). El deploy de Vercel del cliente sigue el remote del cliente.
- Las env vars de prod (Supabase URL/keys, Stripe, Resend, Sentry, flags) se setean en Vercel, no en el repo.
  El set completo y su semántica está en `.env.example`; `preflight.mjs` (abajo) valida que estén todas.

## Go-live gate

`node scripts/preflight.mjs` valida que todas las vars de `.env.example` estén presentes y que
Supabase/Stripe/Resend/Sentry respondan (sin imprimir secretos; exit 0 solo si todo OK). **Correrlo antes de cada go-live.**

## CI (GitHub Actions, `.github/workflows/ci.yml`)

Pipeline: **lint → format:check → test (Vitest) → build → e2e (Playwright)**. Mantener verde; correr
`pnpm format` antes de commitear para no romper `format:check`. Tests e2e usan
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64` (ver script `test:e2e`).

## Móvil — shell nativo Capacitor Android (`mobile/`)

**Existe y hay build en la Play Store** (`SMC-v1.0.0.apk` / `SMC-v1.0.0-playstore.aab` en la raíz del workspace).
Spec en `docs/specs/mobile.md`, detalle en `mobile/README.md`. Convención clave que evita malentendidos:

- **El shell NO empaqueta la web.** `capacitor.config.ts` apunta `server.url` a la web de **producción** (Vercel):
  la app carga la web viva, así **cada deploy web actualiza las apps sin pasar por review de stores**. `mobile/www/`
  es solo un placeholder de arranque + `error.html` (pantalla offline). No hay build de Next dentro del shell.
- `appId` = `com.smartmoney.smc`. Sin iOS todavía; solo `android/`.
- Plugin `@capgo/capacitor-native-biometric` para desbloqueo biométrico. Iterar el shell: `pnpm --dir mobile sync`
  (= `cap sync android`) y abrir en Android Studio.
- **iOS sigue fuera de alcance** (el dossier lo lista; el repo solo tiene Android).

## Fuera de alcance del MVP actual (no asumir que existen)

- **App iOS** — solo hay shell Android; no hay proyecto iOS.
- **KYC / AML** — diferido explícitamente en `docs/specs/hardening.md`.

Antes de "completar" el MVP del dossier, confirmar con el usuario si estos entran o se redefinen.
