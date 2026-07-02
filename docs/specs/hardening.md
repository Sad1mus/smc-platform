# Spec — Hardening de seguridad (Fase 1)

> Derivada del dossier `SMC_s.pdf` (Fase 1 · "WAF dedicado y hardening") y del bloque
> "Seguridad y cumplimiento" (TLS 1.3, OWASP Top 10, RLS, SCA/3-D Secure, GDPR-aware).

## Objetivo

Postura de seguridad adecuada para un sistema que maneja **autenticación + pagos + datos
de usuarios europeos** (GDPR-aware), sin sobre-construir antes de tener carga real.

## Criterios de aceptación

1. **Headers OWASP** presentes y verificables por `curl -I`: CSP, HSTS, X-Frame-Options,
   X-Content-Type-Options, Referrer-Policy, Permissions-Policy. (Ya implementados en Fase 0;
   esta spec los fija como invariante: no debilitarlos.)
2. **Rate limiting** en rutas de auth y API (presente). El rate limiting **distribuido**
   (multi-instancia) queda fuera de alcance hasta que haya más de una instancia.
3. **Webhook de pagos**: verificación de firma + idempotencia (`stripe_event_id` único).
   Invariante: rechazar firma inválida siempre.
4. **RLS** activa en todas las tablas; `service_role` solo en servidor, jamás en el cliente.
5. **Gestión de secretos**: ningún secreto en el repo; `.env.example` solo placeholders;
   política de rotación documentada. Un **pre-flight** valida presencia de claves antes del go-live.
6. **WAF (Vercel Firewall)**: reglas declaradas y activadas en el dashboard de Vercel
   (paso operativo, no de código) — documentado para ejecución manual.

## Fuera de alcance (diferido, con motivo)

- **Caché distribuida (Redis/Upstash)**: diferida hasta presión real de carga/costo;
  Next.js nativo (`revalidate`/`unstable_cache`) + edge de Vercel alcanzan a escala MVP.
- **KYC/AML**: ya no diferido — es **flag-gated** (`NEXT_PUBLIC_ENABLE_KYC`, default off)
  con proveedor stub y capa provider-agnostic; ver [`kyc.md`](./kyc.md). Siguen diferidos
  el proveedor real de pago-por-verificación (decisión del cliente) y el AML screening
  continuo (aplica recién con transaccionalidad).
- **WAF dedicado self-hosted**: el Vercel Firewall cubre la necesidad en esta etapa.

## Verificación

`curl -I` del deploy muestra los headers · revisión de seguridad sobre el diff con
0 críticos sin resolver · `node scripts/preflight.mjs` reporta el estado de claves.
