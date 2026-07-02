# SMC Platform

Plataforma web de **visualización de mercados financieros** en tiempo real:
gráficos interactivos (TradingView), cuentas de usuario y planes de suscripción
de pago vía Stripe.

> **Solo visualización.** SMC **no ejecuta órdenes, no custodia fondos y no es
> asesoría de inversión**. No es un broker. La comunicación se limita a la
> visualización de datos de mercado (restricción regulatoria del producto).

La documentación de producto, marca y decisiones es **[`docs/specs/product.md`](./docs/specs/product.md)**
(fuente de verdad). Este README cubre el stack y cómo correr el proyecto.

## Producto en una línea

Dos superficies separadas:

- **Brand** (`/`, `/precios`): landing que comunica y convierte. El diseño ES el producto.
- **Product** (`/dashboard/*`, `/(auth)`): la plataforma sirve datos de mercado.
  El diseño SIRVE al producto.

Público hispanohablante (LATAM y Europa), **español primero**, cifras en USD.

### Estética

Terminal financiero: fondo casi negro, acento dorado, tipografía Geist (Sans para
UI, Mono para precios y datos). Detalle completo de marca, colores, planes y
principios en [`docs/specs/product.md`](./docs/specs/product.md).

## Stack

- **[Next.js 16](https://nextjs.org)** (App Router) + **React 19** + **TypeScript**
- **[Tailwind CSS 4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)** (Radix) + `motion`
- **[Supabase](https://supabase.com)** — Auth + PostgreSQL (con RLS), vía `@supabase/ssr`
- **[Stripe](https://stripe.com)** — suscripciones y webhooks (ver estado abajo)
- **[TradingView](https://www.tradingview.com)** — gráficos de mercado en el dashboard
- **[Resend](https://resend.com)** — emails transaccionales (modo stub sin API key)
- **[Sentry](https://sentry.io)** — observabilidad (condicional al DSN)
- **Tooling:** ESLint, Prettier, Vitest (unit), Playwright (e2e), GitHub Actions

El gestor de paquetes del repo es **pnpm** (`pnpm-lock.yaml`).

## Cómo correr el proyecto

### 1. Requisitos

- Node.js 20+
- pnpm

### 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores:

```bash
cp .env.example .env.local
```

Mínimo para desarrollo:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (test mode)
- `NEXT_PUBLIC_APP_URL`

Opcionales en desarrollo: `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_AUTH_TOKEN` (sin
DSN no se instrumenta Sentry) y `RESEND_API_KEY` / `EMAIL_FROM` (sin API key los
emails corren en modo stub y solo se loguean).

### 3. Base de datos

Las migraciones de Supabase viven en `supabase/migrations/`:

- `*_initial_schema.sql` — `profiles`, `plans`, `subscriptions`, `payment_events` (con RLS)
- `*_seed_plans.sql` — catálogo de planes
- `*_harden_function_privileges.sql` — endurecimiento de funciones `SECURITY DEFINER`
- `*_watchlists.sql` — watchlist por usuario (con RLS)

Aplicalas sobre tu proyecto Supabase (Supabase CLI o el editor SQL).

### 4. Scripts

```bash
pnpm dev            # servidor de desarrollo (http://localhost:3000)
pnpm build          # build de producción
pnpm start          # servir el build
pnpm lint           # ESLint
pnpm format         # Prettier --write
pnpm format:check   # Prettier --check
pnpm test           # Vitest (unit, una corrida)
pnpm test:watch     # Vitest en watch
pnpm test:e2e       # Playwright (e2e)
```

Scripts operativos (Node):

```bash
node scripts/setup-stripe.mjs   # aprovisiona productos/precios en Stripe (test mode)
node scripts/preflight.mjs      # pre-flight de go-live: valida claves + salud de integraciones
```

El **pre-flight** verifica que todas las variables de `.env.example` estén presentes y que
Supabase/Stripe/Resend/Sentry respondan. No imprime secretos (solo presente/ausente). Sale con
código `0` solo si todo está listo; de lo contrario lista lo que falta. Corrélo antes de
cada go-live.

## Estructura

```
app/
  page.tsx              # landing (Brand)
  (auth)/               # login, registro, recuperar, actualizar-password
  auth/                 # callback y confirm de Supabase Auth
  dashboard/            # dashboard, /dashboard/plan
  api/webhooks/stripe/  # webhook de Stripe
  layout.tsx, globals.css, global-error.tsx
components/
  landing/   brand/     # superficie Brand (hero, planes, header/footer, logo)
  auth/                 # formularios de autenticación
  dashboard/            # market-view, tradingview-chart, watchlist, nav, checkout
  ui/                   # primitivos shadcn/ui
lib/
  supabase/  auth/      # clientes Supabase y acciones/validación de auth
  stripe/               # cliente y server actions de Stripe
  subscription/         # queries de suscripción
  watchlist/            # acciones de watchlist
  email/  security/      # envío de emails y rate limiting
supabase/migrations/    # esquema SQL + RLS
tests/
  unit/                 # Vitest
  e2e/                  # Playwright
```

## Deploy (Vercel)

Auto-deploy desde `main` del repo del cliente (github.com/smartmoney4/smc-platform);
la config versionada vive en [`vercel.json`](./vercel.json) (framework + región `iad1`,
pareada con Supabase us-east-1). Las variables de entorno se cargan por nombre según
[`.env.example`](./.env.example) en el dashboard de Vercel (nunca valores en el repo).
Antes de cada go-live: `node scripts/preflight.mjs` (valida presencia de vars y que los
servicios respondan; exit 0 = OK).

## Estado actual

MVP Fase 0: plataforma completa y desplegada en Vercel.

- **Hecho:** scaffold Next.js 16 + tooling, esquema Supabase con RLS,
  autenticación completa (Supabase Auth), landing + shell del dashboard con
  identidad SMC, gráficos TradingView en tiempo real + watchlist, headers OWASP /
  rate limiting / emails, tests + CI/CD (GitHub Actions: lint → format → test →
  build → e2e) y deploy a producción.

- **[blocked] Stripe — flujo de pago no validado end-to-end.** El código de la
  integración (server actions, checkout, webhook) está implementado, pero faltan
  las **claves de Stripe en modo test**, por lo que el flujo de pago **no se pudo
  verificar de extremo a extremo**. Con las claves cargadas en `.env.local`, el
  código está listo para probarse.

Detalle de producto, planes y marca: **[`docs/specs/product.md`](./docs/specs/product.md)**.
