# Deploy y operaciones (runbook)

## Remotes git — a cuál se pushea

- **`origin`** = `Sad1mus/smc-platform` (dev/personal). **No** dispara prod.
- **`client`** = `smartmoney4/smc-platform` → **dispara el Vercel de producción** al pushear a `main`.

> ⚠️ **`origin` y `client` divergieron** (2026-07-08): las notas internas (handoffs, `docs/reviews/`,
> `.claude/goal-queue-*`) se mantienen solo en `origin`; a `client` se le pushea **solo código/copy vía
> cherry-pick** sobre su tip. Por eso `git push client main` **ya no es fast-forward limpio** — para cada
> deploy a prod, cherry-pickear los commits de código sobre el tip actual de `client`.

## CI (GitHub Actions, `.github/workflows/ci.yml`)

Pipeline: **lint → format:check → test (Vitest) → build → e2e (Playwright)**. Mantener verde.
Correr `pnpm format` antes de commitear para no romper `format:check`. E2E usa
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64`.

## Go-live gate

```bash
node scripts/preflight.mjs   # exit 0 solo si TODAS las env vars están y Supabase/Stripe/Resend/Sentry responden
```

No imprime secretos. Correrlo antes de cada go-live.

## Flujo de deploy a producción

1. Trabajar en `origin` (dev), gate local verde (`pnpm lint && pnpm test && pnpm build`).
2. **Cherry-pick** los commits de código sobre el tip de `client` (ver nota de divergencia):
   ```bash
   git checkout -B promote <tip-de-client>
   git cherry-pick <commit(s) de código>
   git push client promote:main
   git checkout main && git branch -D promote
   ```
3. Vercel construye y despliega a prod (~45s). Verificar rutas públicas (`/`, `/precios` → 200; `/dashboard` → 307).
4. El deploy anterior queda como **rollback-candidate**: si algo falla, rollback de 1 clic en Vercel (o revert del commit).

> ⚠️ **Preview deploys de Vercel:** el entorno **Preview no tiene las env vars** (solo Production) → **todo da 500**
> (el middleware `proxy.ts` no puede crear el cliente Supabase). Para usar previews, cargar las env vars en el scope
> Preview del proyecto Vercel.

## Infra (cuentas del cliente)

- **Supabase:** proyecto de prod **`czpegpattyvspxjigvij`** (ACTIVE_HEALTHY, `us-east-1`). Migraciones en
  `supabase/migrations/` (fuente de verdad). ⚠️ `wtxxapniroedkmxjvvuw` INACTIVE (legacy, no usar).
- **Vercel:** team `team_2FhhLxxrmRoKhTFnKbATBOG3`, proyecto `smc-platform` (`prj_3436K4h7ygqw4d69AeEtdYsgHN9T`), región `iad1`.
- **Health check:** `GET /api/health` (200 si Supabase responde, 503 si no; reporta estado de Stripe/Sentry).

## Stripe — checklist go-live (bloqueado por insumos del cliente)

El Stripe es la cuenta del cliente; el dev no tiene acceso. **El cliente debe:**

1. Activar la cuenta para pagos en vivo (business + payout bancario, sin requisitos pendientes).
2. Crear 3 precios **one-time**: Bronce $1.500 · Plata $2.800 · Prueba $250 (VIP es custom, no lo crea el script).
3. Registrar el **webhook** LIVE en `https://<dominio-prod>/api/webhooks/stripe` (evento clave con pago único:
   `checkout.session.completed`) y pasar el **`whsec_`**.

**El dev entonces:** destraba la guarda test-only de `lib/stripe/client.ts` (flag `STRIPE_ALLOW_LIVE=1`), carga los
`price_...` en la tabla `plans` (Supabase) y el `whsec_` + claves live en Vercel → redeploy → prueba el checkout.
Detalle paso a paso en `docs/handoff-2026-07-07.md` §4 y `docs/handoff-2026-07-07-continuacion.md` §3.
