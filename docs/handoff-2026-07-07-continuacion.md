# Handoff — 2026-07-07 (continuación) · Deploy + pago único + fix TradingView + auditoría

> Snapshot de la sesión que siguió al `handoff-2026-07-07.md`. Fuente de verdad para retomar.
> **Los commits están hechos y en `origin`, pero NO en `client` (prod del cliente no tiene estos cambios todavía).**

---

## 1. Estado actual (dónde quedó todo)

- **Rama:** `main`. **Working tree LIMPIO** (todo commiteado).
- **Remotes:** `origin` (Sad1mus, dev) = **al día** con estos commits. `client` (smartmoney4 → dispara
  Vercel prod) = **NO tiene** los 3 commits nuevos; sigue en `af320ad`.
- **Producción (Vercel):** `smc-platform-smart-money-s-projects.vercel.app`, deploy **READY**, 6 rutas
  públicas en **200**. Corre lo de `af320ad` (landing + light), **NO** el pago único ni el fix TV.
- **Supabase:** proyecto activo `czpegpattyvspxjigvij` (ACTIVE_HEALTHY, `us-east-1`), **plan `free`**.
- **Identidad git:** `smartmoney4` (así se firma todo en este repo).

### Commits nuevos de esta sesión (en `origin`, faltan en `client`)

| SHA       | Commit                                                                   |
| --------- | ------------------------------------------------------------------------ |
| `1efb47c` | `fix(dashboard): TradingView montaba dos veces por tema sin resolver`    |
| `de074c7` | `feat(pagos): planes de pago único (Bronce/Plata 1 año, Prueba 30 días)` |
| `6850bcf` | `docs: handoff §4 (webhook dominio/ruta) + auditoría 2026-07-07`         |

(Previos, ya en `origin` **y** `client`: `941aa49` landing · `1a0395f` light · `af320ad` docs.)

---

## 2. Qué se hizo esta sesión

### 2.1 Deploy inicial + light por defecto (ya en prod)

- Se levantó el proyecto y se pusheó a `origin`+`client` → deploy a prod (commits `941aa49`/`1a0395f`/`af320ad`).
- **Decisión confirmada:** tema **light por defecto** en web y dashboard, con toggle a dark. Spec
  `redesign.md` actualizada (principio 6 "Light-first, dark par"). `defaultTheme="light"` en `app/layout.tsx`.

### 2.2 Modelo de cobro → PAGO ÚNICO (commit `de074c7`, aún no en prod)

- De suscripción mensual a **pago único** sin renovación: **Bronce/Plata = 1 año**, **Prueba = 30 días**.
- Archivos: `lib/stripe/actions.ts` (checkout mode `payment`), `app/api/webhooks/stripe/route.ts`
  (vigencia por plan: prueba 30d / resto 365d), `scripts/setup-stripe.mjs` (`recurring:false`),
  `docs/specs/product.md` (modelo actualizado — SDD), `lib/i18n/dictionaries.ts` (quita "plan recurrente").
- Con pago único, el único evento Stripe que dispara es `checkout.session.completed`.

### 2.3 Fix bug TradingView (commit `1efb47c`, aún no en prod)

- **Causa raíz:** `resolvedTheme` (next-themes) arranca `undefined` → el embed montaba con tema
  equivocado y **recargaba el script al resolver** (errores intermitentes / flicker).
- **Fix:** guarda `if (!resolvedTheme) return` en `components/dashboard/tv-widget.tsx` y
  `tradingview-chart.tsx`. **No** toca alturas de embeds ni CSP (respeta `redesign.md`).
- **Test:** `tests/unit/tv-widget-theme-mount.test.tsx` — falla 2/2 contra el código previo, pasa 4/4 con el fix.
- Verificación: `pnpm test` 124/124 · `tsc --noEmit` 0 · `pnpm build` 0.

### 2.4 Auditoría del producto (commit `6850bcf`)

- `docs/reviews/audit-2026-07-07.md` con hallazgos priorizados (ver §5).

### 2.5 Goal de revisión (terminado)

- Se corrió un `/goal` con cola `.claude/goal-queue-revision-producto.md` (2 tareas: fix TV + auditoría).
  **Ambas `[done]`**, el goal se auto-limpió. No queda nada corriendo.

---

## 3. Stripe — reparto y estado (⚠️ NO tenemos acceso a su Stripe)

Las claves viven solo en Vercel; el Stripe es la cuenta del cliente. **Todo lo de Stripe lo hace el cliente.**

**Lo que puede hacer el dev:** código (hecho), escribir `price_id` en Supabase (cuando lleguen),
redeploy. **Lo que NO:** crear planes/webhook ni sacar el `whsec_` (es su cuenta).

**Pasos pendientes del cliente (en su Stripe, modo Live):**

1. Crear 3 planes **One-time**: `SMC Bronce` 1500, `SMC Plata` 2800, `SMC Prueba` 250 (USD). Copiar cada `price_...`.
2. Crear el **webhook** y mandar el `whsec_...`.
3. Enviarnos los **3 `price_...` + el `whsec_`**.

### ⚠️ Trampa del webhook (importante)

El cliente propuso `https://hopibonprocess.online/api/stripe/webhook`. **NO sirve:**

- `hopibonprocess.online` es dominio del proyecto **`hopibon-web`** (`prj_yQ6nliwxUWCQJWMnT08kMjnnjboH`),
  **otra app** — no smc-platform.
- La ruta real de smc es **`/api/webhooks/stripe`** (no `/api/stripe/webhook`).
- **URL correcta hoy:** `https://smc-platform-smart-money-s-projects.vercel.app/api/webhooks/stripe`.
- Falta que el cliente **confirme en qué dominio corre SMC**. Si quiere `hopibonprocess.online`, primero
  hay que **mover ese dominio de `hopibon-web` a `smc-platform`** y redeployar.

Cuando lleguen los datos: dev carga `price_...` en la tabla `plans` (Supabase) + `whsec_` en Vercel (`STRIPE_WEBHOOK_SECRET`) → redeploy → cobro vivo.

---

## 4. Decisiones pendientes (gates para vos)

- [ ] **¿Push a `client`?** Para que el fix TV + pago único salgan a **prod** (dispara redeploy). Hoy solo en `origin`.
- [ ] **Copy suscripción → pago único:** "Cancelá cuando quieras / Sin permanencia" y la FAQ de cancelación
      (en `/precios` y landing, es/en) todavía asumen suscripción. Decisión de marketing, después se edita.
- [ ] **Supabase → Pro ($25/mes):** por auto-pausa a los 7 días y backups (ver §5, hallazgo 🔴).
- [ ] **Dominio del webhook** (§3): confirmar con el cliente.

---

## 5. Hallazgos de la auditoría (resumen — detalle en `docs/reviews/audit-2026-07-07.md`)

- 🔴 **Supabase plan free** → auto-pausa 7 días + sin backups de datos de pago. Pasar a **Pro**.
- 🔴 **Stripe no cobra en live** (bloqueado en el cliente, §3).
- 🟡 Activar **leaked-password protection** (toggle en panel Auth de Supabase).
- 🟡 Consolidar **policies RLS permisivas duplicadas** en `profiles` y `subscriptions` (una migración).
- 🟡 Confirmar `is_admin()` SECURITY DEFINER ejecutable por `authenticated` (revocar `EXECUTE` si no es a propósito).
- 🟡 Copy de suscripción vs pago único.
- 🟢 `payment_events` RLS sin policy = **intencional** (solo service_role). 5 índices sin uso = **falta data, no borrar**.
- 🟢 Vercel Hobby es no-comercial → considerar Vercel Pro.

---

## 6. Próximos pasos sugeridos (sin necesidad de otro `/goal`)

1. **Push a `client`** (si se aprueba) → TradingView + pago único a prod.
2. **Migración RLS** (consolidar policies duplicadas) → validar con `get_advisors`.
3. **Esperar datos del cliente** (Stripe) → cargar `price_...` + `whsec_` → redeploy → probar checkout.
4. Decidir Supabase Pro y la copy de pago único.

**Cómo testear local:** `pnpm dev` desde `smc-platform/` → localhost:3000. Rutas: `/`, `/mercados`,
`/como-funciona`, `/plataforma`, `/seguridad`, `/faq`, y el dashboard (detrás de login/paywall).
