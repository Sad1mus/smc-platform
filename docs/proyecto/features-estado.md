# Features y su estado real

> Inventario honesto de qué está **funcionando end-to-end**, qué está **a medias / stub**, y qué
> está **diferido**. "Stub" = la UI y la escritura existen, pero la lógica que lo haría útil no.

Leyenda: ✅ funcional · 🟡 parcial/stub · ⛔ diferido/bloqueado

## ✅ Funcional

- **Landing pública** (`app/page.tsx`, `components/landing/*`) — bilingüe (es/en), rediseño glass,
  animaciones (Lenis, parallax, reveal, count-up). 5 páginas de contexto: `/mercados`, `/como-funciona`,
  `/plataforma`, `/seguridad`, `/faq`. Copy desde diccionario i18n (`lib/i18n/dictionaries.ts`).
- **Auth** (Supabase) — registro/login por email, confirmación, sesión vía middleware `proxy.ts`.
- **Dashboard / terminal** (`app/dashboard/*`, `components/dashboard/*`) — gráficos TradingView en vivo,
  navegador de mercados, watchlist, análisis técnico atado al símbolo activo, status-bar (reloj/sesiones),
  paneles (heatmap, calendario, screener, etc.). Display-only. Piel "terminal light con identidad" (2026-07-08).
- **Watchlist** (`lib/watchlist/actions.ts`, `components/dashboard/watchlist-panel.tsx`) — agregar/eliminar
  símbolos, persistidos en Supabase con RLS. Valida formato `EXCHANGE:TICKER` (fix 2026-07-08).
- **Planes / precios** (`app/precios`, `app/dashboard/plan`) — comparativa, checkout Stripe (modo pago único).
  El **código** del checkout y el webhook está completo; ver bloqueo en ⛔.
- **Admin** (`app/admin/*`) — panel read-only de observabilidad (usuarios, suscripciones, pagos, alertas).
  Acceso por rol (`profiles.role = admin`, `public.is_admin()`).
- **i18n** (`lib/i18n/*`) — es/en con cookie de locale y toggle; ES por defecto.
- **Móvil** — shell Capacitor Android que carga la web de prod (`server.url`); build en Play Store.

## 🟡 Parcial / stub (¡ojo acá!)

- **Alertas de precio** (`app/dashboard/alertas`, `lib/alerts/*`) — **el disparo es un STUB.**
  - **Lo que SÍ pasa:** creás una alerta (símbolo + condición above/below + umbral), se valida el tope
    por plan y se **guarda** en la tabla `price_alerts` (RLS). La ves listada. La podés borrar.
  - **Lo que NO pasa:** **nada evalúa el precio ni dispara la alerta.** No hay motor que (1) lea el
    precio actual del símbolo, (2) lo compare contra el umbral, (3) marque la alerta como disparada,
    (4) te notifique (email/push). Por eso "creás una alerta random y no pasa nada" — es correcto, aún
    no está conectada a nada que la ejecute. El propio código lo documenta: _"disparo = stub"_
    (`lib/alerts/actions.ts`). **Qué falta para que funcione:** ver [estado-y-pendientes.md](estado-y-pendientes.md).
- **Emails (Resend)** (`lib/email/send.ts`) — funciona en **modo stub** sin `RESEND_API_KEY`: solo
  loguea, no envía. Hoy solo lo usa el email de confirmación de pago (webhook Stripe). Las alertas **no**
  lo llaman todavía.
- **Sentry** — no se instrumenta sin `NEXT_PUBLIC_SENTRY_DSN` (degradación intencional).

## ⛔ Diferido / bloqueado

- **Cobro Stripe en vivo** — código completo (checkout mode `payment`, webhook firmado e idempotente),
  pero **el cobro real está bloqueado por insumos del CLIENTE**: activación de la cuenta Stripe para pagos
  live + crear los `price_...` one-time + registrar el webhook y pasar el `whsec_`. Sin eso, el checkout
  no completa. Detalle en `docs/handoff-2026-07-07-continuacion.md` §3.
- **KYC / AML** — stub flag-gated (`NEXT_PUBLIC_ENABLE_KYC`). Diferido en `docs/specs/hardening.md`.
- **App iOS** — no existe; solo shell Android.
- **OAuth Google** — configuración pendiente (dashboard Google Cloud + Supabase redirect URLs).

## Limitaciones conocidas (no son bugs)

- **TradingView, límite real-time:** símbolos de bolsa restringidos (NASDAQ/índices `SP:`/`DJ:`, acciones)
  disparan "solo un activo a la vez" al montar 2 widgets sobre el mismo símbolo. Usar feeds CFD/forex/cripto.
  Aceptado por el dueño (el navegador de mercados sigue ofreciendo símbolos de bolsa). Ver audit §3.
- **Supabase plan free** — auto-pausa a los ~7 días de inactividad + sin backups. Recomendado pasar a Pro.
