# Estado y pendientes

> Corte 2026-07-08. Complementa `docs/handoff-*.md` (snapshots de sesión) y la memoria de pendientes.

## Camino crítico — insumos del CLIENTE (bloquean go-live comercial)

1. **Stripe en vivo** — activar la cuenta + crear los `price_...` one-time + registrar webhook y pasar el `whsec_`.
   Sin esto el checkout no cobra. Runbook en [deploy-operaciones.md](deploy-operaciones.md).
2. **Datos legales reales** — reemplazar los placeholders en `app/privacidad`, `app/terminos`, `app/reembolsos`
   (marcados con `// TODO: datos legales reales del cliente`). Bloquea también Stripe.
3. **Compliance / giro regulatorio** — 4 preguntas legales abiertas (`docs/decisiones/2026-07-04-giro-regulatorio.md`).

## Feature más visible sin terminar: disparo de alertas de precio

Hoy las alertas **se crean, guardan y listan, pero NO se disparan** (no hay motor). Para hacerlo real hace falta:

1. **Fuente de precios server-side.** Los embeds de TradingView son iframes display-only: **no dan un API de
   precio al servidor.** Hay que elegir un feed de cotizaciones consultable desde el backend (API de mercado).
2. **Columna de estado** en `price_alerts` (migración): `triggered_at` / `status`, para no re-disparar.
3. **Scheduler.** Opciones: **Vercel Cron** (`vercel.json` → pega a una API route) o **pg_cron + edge function**
   en Supabase (hoy no hay `supabase/functions/`). El worker: lee alertas `active`, trae el precio de cada símbolo,
   compara `direction`/`threshold`, marca disparadas.
4. **Notificación.** Email vía **Resend** (requiere `RESEND_API_KEY`, hoy en stub) y/o **push** (requiere Firebase FCM
   - el setup de push del shell móvil, aún pendiente). `lib/email/send.ts` ya existe como capa reutilizable.

> Es una feature de varias piezas (dato + scheduler + notificación) con implicancias de infra. No es un "arreglo"
> chico. Ver decisión de si se construye ahora en la conversación / handoff más reciente.

## Otras limitaciones conocidas (aceptadas o diferidas)

- **TradingView, límite real-time:** símbolos de bolsa restringidos (NASDAQ/índices/acciones) disparan
  "solo un activo a la vez" con 2 widgets sobre el mismo símbolo. Usar feeds CFD/forex/cripto. El navegador de
  mercados sigue ofreciendo símbolos de bolsa → **aceptado por el dueño**. Ver `docs/reviews/audit-2026-07-07.md` §3.
- **Tope de alertas hardcodeado** (`lib/alerts/limits.ts`: prueba 3, bronce 5, plata/vip ∞) — la tabla `plans` no
  tiene columna de tope ("gap conocido del seed"). Si se formaliza, agregar la columna + migración.
- **Rate limit en memoria** (`lib/security/rate-limit.ts`) — no sirve multi-instancia; migrar a Upstash Redis si escala.
- **Supabase plan free** — auto-pausa ~7 días + sin backups (guarda registros de pago). Recomendado **Pro ($25/mes)**.
- **Copy de suscripción vs pago único** — resuelto 2026-07-08 (ya dice "pago único / sin renovación").
- **RLS: policies permisivas duplicadas** en `profiles`/`subscriptions` (consolidar en una con `OR`); confirmar
  `is_admin()` ejecutable por `authenticated`; activar leaked-password protection. Ver audit §2.

## Diferido explícitamente

- **App iOS** — solo shell Android. Requiere Apple Developer ($99/año) + build en la nube.
- **KYC/AML real** — hoy stub flag-gated (`NEXT_PUBLIC_ENABLE_KYC`). Diferido en `docs/specs/hardening.md`.
- **OAuth Google** — configuración pendiente (Google Cloud + Supabase redirect URLs) + deep link nativo.
- **Play Store** — publicación pendiente (Play Console $25).
