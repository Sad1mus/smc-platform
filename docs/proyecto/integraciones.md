# Integraciones

## Supabase — 4 clientes (`lib/supabase/`)

| Cliente     | Fn                                      | Uso                                                                                      |
| ----------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `client.ts` | `createBrowserClient` (anon key)        | Componentes cliente                                                                      |
| `server.ts` | `createServerClient` (cookies httpOnly) | RSC / server actions / route handlers (respeta RLS)                                      |
| `admin.ts`  | `createAdminClient` (`service_role`)    | **Bypassa RLS.** `import "server-only"`. Webhooks/admin/KYC. Lanza error si falta la key |
| `proxy.ts`  | `updateSession()`                       | Middleware: refresca sesión + protege rutas (`/dashboard`, `/cuenta`)                    |

## Stripe (`lib/stripe/`)

- **`client.ts`** — singleton `getStripe()`, `import "server-only"`. **Hoy exige clave de test** (`sk_test_`/`rk_test_`)
  y lanza error si es live → **destrabar esta guarda (idealmente tras un flag `STRIPE_ALLOW_LIVE=1`) es requisito
  para aprovisionar en vivo.** `isStripeConfigured()` alimenta el paywall.
- **`actions.ts`** — `createCheckoutSession(planId)` en **modo `payment` (pago único)** para Prueba/Bronce/Plata
  (deja rama subscription para VIP futuro); crea/reutiliza el customer y persiste `stripe_customer_id` (vía admin).
  `createPortalSession()` (billing portal).
- **Webhook** `app/api/webhooks/stripe/route.ts` — **firmado** (`constructEventAsync`) e **idempotente** (insert en
  `payment_events` por `stripe_event_id`; código 23505 = duplicado → responde 200 sin reprocesar). Maneja
  `checkout.session.completed` (vigencia: Prueba 30 días / resto 365), `invoice.paid`, `customer.subscription.updated/.deleted`.
  Dispara el email de confirmación. **Sin `STRIPE_WEBHOOK_SECRET` responde 503** (degradación intencional).

**Precios inmutables del dossier:** Bronce $1.500 · Plata $2.800 · VIP personalizado · Prueba $250 USD.

## Resend — emails (`lib/email/send.ts`)

`sendEmail()` + plantillas `sendWelcomeEmail`, `sendPaymentConfirmationEmail`. **Modo stub sin `RESEND_API_KEY`**
(solo loguea, no falla). `import "server-only"`, escapa HTML. Hoy lo consumen: welcome (auth callback) y confirmación
de pago (webhook). **Las alertas de precio NO lo usan todavía** (ver [features-estado.md](features-estado.md)).

## Sentry — observabilidad

`instrumentation.ts` (server/edge) + `instrumentation-client.ts` (browser, replays on-error). **Solo inicializa con
`NEXT_PUBLIC_SENTRY_DSN`** (stub sin DSN). `tracesSampleRate 0.1`, `sendDefaultPii:false`. `lib/observability/logger.ts`
importa Sentry dinámicamente solo si hay DSN.

## TradingView — datos de mercado

Embeds oficiales (`components/dashboard/`): `tradingview-chart.tsx` (Advanced Real-Time Chart), `tv-widget.tsx`
(wrapper de embeds gratuitos: heatmaps, events, screener, ticker), `ticker-tape.tsx`, `market-navigator.tsx`. El dato
llega por WebSocket **dentro del iframe**; la CSP (`next.config.ts`) permite explícitamente los orígenes de TradingView.
Atribución "by TradingView" requerida. ⚠️ **Límite real-time** en feeds de bolsa (ver features/audit).

## Env vars (`.env.example`)

| Grupo          | Variables                                                                                |
| -------------- | ---------------------------------------------------------------------------------------- |
| **Supabase**   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Stripe**     | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`       |
| **App**        | `NEXT_PUBLIC_APP_URL`                                                                    |
| **Flags**      | `NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE` (def. false), `NEXT_PUBLIC_ENABLE_KYC` (def. false)  |
| **Opcionales** | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM`            |

`scripts/preflight.mjs` valida que estén todas y que los servicios respondan (sin imprimir secretos). En prod se
setean en **Vercel** (no en el repo). ⚠️ **Si faltan las de Supabase, el middleware falla y toda la app da 500**
— por eso los preview deploys sin env vars caen enteros.

## Modos de degradación (intencionales, no bugs)

- Sin `RESEND_API_KEY` → emails en modo stub (solo log).
- Sin `NEXT_PUBLIC_SENTRY_DSN` → Sentry no se instrumenta.
- Sin `STRIPE_WEBHOOK_SECRET` → el webhook responde 503.
