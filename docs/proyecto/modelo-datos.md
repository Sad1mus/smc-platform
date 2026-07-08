# Modelo de datos

> Fuente de verdad del schema: **`supabase/migrations/`** (SQL versionado). No editar tablas a mano en
> el dashboard sin una migración que lo respalde. **No hay edge functions** (`supabase/functions/` no existe):
> toda la lógica de servidor vive en server actions / route handlers de Next.

## Tablas (por migración)

### `20260602003000_initial_schema.sql` — esquema base (todo con RLS)

- **`profiles`** — PK = `auth.users.id`. `email`, `full_name`, `role` (`user`|`admin`), `stripe_customer_id` (unique).
  - RLS: select propio + select admin; update solo la columna `full_name`; insert/update/delete revocados a anon/authenticated.
  - Trigger `on_auth_user_created` → `handle_new_user()` (security definer) crea el perfil al registrarse. Trigger `handle_updated_at`.
  - Helper **`is_admin()`** (security definer, evita recursión en las policies).
- **`plans`** — PK text (`prueba`/`bronce`/`plata`/`vip`). `price_usd`, `is_custom`, `features` (jsonb), `stripe_product_id`, `stripe_price_id`, `sort_order`, `active`.
  - RLS: select público de los activos; **escrituras solo `service_role`**.
- **`subscriptions`** — `user_id`, `plan_id`, `stripe_subscription_id` (unique), `stripe_customer_id`, `status` (check, 8 estados), `current_period_start/end`, `cancel_at_period_end`. Índices por `user_id`, `(user, status)`, `plan`.
  - RLS: select propio + admin; **escrituras solo `service_role`** (webhooks).
- **`payment_events`** — `stripe_event_id` (unique → **idempotencia**), `event_type`, `payload` (jsonb), `user_id`, `processed_at`.
  - **Acceso exclusivo `service_role`, sin policies de usuario** (intencional; no "arreglar" agregando policy).

### `20260602003100_seed_plans.sql`

Seed de planes: **Prueba $250 · Bronce $1.500 · Plata $2.800 · VIP** (custom, `price_usd` null). Features acumulativas.

### `20260602003200_harden_function_privileges.sql`

Revoca `EXECUTE` de funciones SECURITY DEFINER vía RPC: `handle_new_user`/`handle_updated_at` a todos; `is_admin` a anon (authenticated la conserva para RLS).

### `20260602010000_watchlists.sql`

- **`watchlists`** — `user_id`, `symbol` (1–40 chars), `sort_order`, unique(`user`, `symbol`). RLS completo por dueño; anon sin acceso.

### `20260702162620_kyc_verifications.sql`

- Enum `kyc_status` (`unverified`/`pending`/`approved`/`rejected`). **`kyc_verifications`** — `user_id` (unique), `status`, `provider`, `provider_ref`. RLS: el dueño solo **lee**; escrituras solo `service_role`.

### `20260704200000_price_alerts.sql`

- **`price_alerts`** — `user_id`, `symbol` (1–40), `direction` (check `above`/`below`), `threshold` (>0), `active`. RLS completo por dueño; anon sin acceso.
  - ⚠️ **No tiene columna de estado de disparo** (`triggered_at`/`status`). Para materializar el disparo real de alertas habría que agregarla (ver [estado-y-pendientes.md](estado-y-pendientes.md)).

## Patrón de seguridad transversal

- Todas las tablas con **RLS habilitada**. Patrón "select own" + policies admin donde aplica.
- **Escrituras sensibles** (`plans`, `subscriptions`, `payment_events`, `kyc_verifications`) **solo vía `service_role`** — desde webhooks/admin, nunca desde el cliente.
- El rol vive en `profiles.role`; las policies usan `public.is_admin()`.
