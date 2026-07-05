# Spec — Panel de administración (`/admin`)

> Fuente de verdad del panel interno de observabilidad. Enlaza con `product.md`,
> `hardening.md` (RLS, `service_role`) e `i18n.md` (el admin también es bilingüe).

## Qué es

Superficie **interna** para que el operador del negocio observe la plataforma y
sus usuarios. Ya existe una base (`app/admin`, admin-gated por `is_admin()`); esta
spec define su **expansión**. Es **solo lectura** (observabilidad); cualquier
acción mutadora se define aparte y con su propia justificación.

## Acceso y seguridad

- **Admin-gated:** solo `profiles.role = 'admin'`; las políticas usan
  `public.is_admin()`. Un no-admin recibe redirect/403.
- **Lecturas server-side** con el cliente correcto (ver `hardening.md`): nunca
  exponer `service_role` al cliente. Datos sensibles de otros usuarios solo se leen
  en el server, tras verificar admin.
- Sin escrituras a `plans`/`subscriptions`/`payment_events` desde el cliente
  (siguen siendo del webhook/service_role).

## Qué observa (secciones)

1. **Usuarios:** email, nombre, rol, fecha de alta (y último acceso si está
   disponible). Búsqueda/paginado.
2. **Suscripciones:** por usuario y agregadas — plan, estado (`active`/`trialing`/
   otros), vencimiento, `stripe_subscription_id`.
3. **Pagos:** `payment_events` (tipo de evento, `stripe_event_id`, fecha, monto si
   aplica) — la traza idempotente ya registrada por el webhook.
4. **Alertas:** `price_alerts` — conteos por usuario/estado (la notificación es
   stub, se refleja tal cual).
5. **Métricas agregadas:** total de usuarios, suscripciones activas, distribución
   por plan, y un **proxy de ingresos** (suma de precios de planes activos; se
   rotula como proxy, no como contabilidad).

## Reglas

- **Solo datos reales** de la DB; nada inventado. Si una métrica no se puede
  calcular con lo que hay, se omite o se marca "n/d".
- **Bilingüe** (i18n): toda la copy visible del admin sale de diccionarios.
- **Guardarraíles de marca** aplican a cualquier texto orientado a negocio: la
  ejecución/custodia se atribuye a los **socios regulados**, no a SMC Markets.
- **Read-only** en esta fase.

## Check de aceptación (para la cola)

`/admin` con sesión admin → HTTP 200 con las secciones presentes; sin sesión o
no-admin → redirect/403; `pnpm build` verde; sin `service_role` expuesto al
cliente.
