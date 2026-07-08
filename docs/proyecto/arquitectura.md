# Arquitectura

> Vista de fondo. Para comandos y estructura de carpetas detallada, ver el `README.md` raíz;
> para convenciones no obvias, `CLAUDE.md` raíz.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4** · **shadcn** (radix-nova).
- **pnpm** como gestor. **motion** v12 (animaciones). **next-themes** (light default, toggle a dark).
- Fuentes: **Geist** (sans) · **Geist Mono** (cifras) · **Bricolage Grotesque** (display, `--font-display`).
- Datos de mercado: **embeds oficiales de TradingView** (iframes; el dato llega por WebSocket dentro del iframe).

## Estructura (top-level)

- **`app/`** — rutas (App Router): landing, auth, `dashboard/`, `admin/`, `api/`. Layout raíz con `ThemeProvider`.
- **`components/`** — `landing/`, `dashboard/`, `ui/` (shadcn), `brand/`, `motion/`, `i18n/`, `native/`.
- **`lib/`** — `supabase/`, `stripe/`, `subscription/`, `auth/`, `watchlist/`, `alerts/`, `email/`,
  `i18n/`, `security/`, `kyc/`.
- **`supabase/migrations/`** — schema versionado (fuente de verdad del modelo de datos).
- **`mobile/`** — shell Capacitor Android.
- **`docs/`** — `specs/` (fuente de verdad por feature), `reviews/`, `proyecto/` (esta doc), handoffs.

## Rutas (`app/`)

**Públicas:** `/` (landing), `/precios`, y páginas de contexto `/plataforma`, `/mercados`, `/como-funciona`,
`/faq`, `/seguridad`. Legales: `/privacidad`, `/terminos`, `/reembolsos` (con placeholders legales pendientes).

**Auth** (grupo `app/(auth)/`, layout propio): `/login`, `/registro`, `/recuperar`, `/actualizar-password`.
Handlers: `app/auth/callback/route.ts` (code→sesión, OAuth + welcome email), `app/auth/confirm/route.ts`
(verifica email / recuperación).

**Dashboard** (`app/dashboard/`, layout exige sesión + paywall): `/dashboard` (terminal), `/dashboard/plan`
(planes/checkout/KYC), `/dashboard/alertas`.

**Admin** (`app/admin/`, layout RBAC `isAdmin()`): `/admin` (observabilidad read-only).

**API** (`app/api/`): `GET /api/health` (pinguea Supabase; 200/503; reporta Stripe/Sentry),
`POST /api/webhooks/stripe` (webhook firmado e idempotente — ver [integraciones.md](integraciones.md)).

## Capas de Supabase (no mezclar — fuente de bugs de seguridad)

Cuatro clientes con propósitos distintos (`lib/supabase/`):

| Cliente     | Uso                                 | Nota                                        |
| ----------- | ----------------------------------- | ------------------------------------------- |
| `client.ts` | Navegador (componentes cliente)     | Respeta RLS del usuario                     |
| `server.ts` | RSC y server actions                | Respeta RLS del usuario logueado            |
| `admin.ts`  | **`service_role`, BYPASSA RLS**     | `import "server-only"`. Solo webhooks/admin |
| `proxy.ts`  | Refresco de sesión en el middleware | —                                           |

**RBAC/RLS:** el rol vive en `profiles.role` (`user`/`admin`); las policies usan `public.is_admin()`.
Las escrituras a `plans`/`subscriptions`/`payment_events` están revocadas para `anon`/`authenticated`
y solo ocurren vía `service_role` (webhooks de Stripe). Ver [modelo-datos.md](modelo-datos.md).

## Middleware — `proxy.ts` (no `middleware.ts`)

Next.js 16 renombró el middleware. El archivo raíz **`proxy.ts`** corre en cada request y hace:

1. **Rate limiting por IP** (`lib/security/rate-limit.ts`): 20/min en rutas auth, 60/min en API, ventana 60s.
2. **Refresco de sesión Supabase.**

> Nota operativa: el cliente Supabase se crea en cada request; **sin las env vars de Supabase el
> middleware falla y toda la app da 500** (por eso los preview deploys sin env vars caen enteros).

## Gating por suscripción (muro de pago)

`app/dashboard/*` exige suscripción activa (`lib/subscription/paywall.ts`). **Falla CERRADO** en
producción: sin acceso → redirect a `/dashboard/plan`. Solo en dev/test sin Stripe el muro se desactiva.

## Despliegue (infra del cliente)

- **Supabase** — org `asscxxyvtsefspimrmdv`. Proyecto de prod: **`czpegpattyvspxjigvij`** ("smc-platform",
  ACTIVE_HEALTHY, `us-east-1`). ⚠️ `wtxxapniroedkmxjvvuw` está INACTIVE (legacy, no usar).
- **Vercel** — team `team_2FhhLxxrmRoKhTFnKbATBOG3`, proyecto `smc-platform` (`prj_3436K4h7ygqw4d69AeEtdYsgHN9T`),
  región `iad1`.
- **Remotes git — confirmar a cuál se pushea:** `origin` = `Sad1mus/smc-platform` (dev),
  `client` = `smartmoney4/smc-platform` (**dispara el Vercel de producción**).
- Las env vars de prod se setean en Vercel (no en el repo). Semántica en `.env.example`; `preflight.mjs` valida.
  Detalle en [integraciones.md](integraciones.md) y runbook en [deploy-operaciones.md](deploy-operaciones.md).
