# docs/specs — Fuente de verdad (SDD)

Bajo Spec-Driven Development, la **spec es la fuente de verdad** y el código es salida
generada a partir de ella. Antes de tocar una feature, leé su spec acá (referenciala con `@`).

## Índice

- [`product.md`](./product.md) — producto, marca, usuarios, principios estratégicos y
  restricciones regulatorias (solo visualización; nunca "broker"; precios exactos del dossier).
- [`observabilidad.md`](./observabilidad.md) — Fase 1: errores (Sentry), logging estructurado,
  health endpoint y alertas. Qué se difiere (APM/tracing) y por qué.
- [`hardening.md`](./hardening.md) — Fase 1: headers OWASP, rate limiting, webhook firmado,
  RLS, secretos y WAF. Qué se difiere (caché distribuida, KYC/AML) y por qué.
- [`mobile.md`](./mobile.md) — Fase 2: apps Android + iOS con Capacitor sobre la web de
  producción. Riesgo Apple 4.2 y mitigaciones, builds iOS en nube, stores del cliente.
- [`kyc.md`](./kyc.md) — verificación de identidad flag-gated (default off) con capa
  provider-agnostic y proveedor stub; qué se difiere (proveedor real, AML) y por qué.
- [`landing-pages.md`](./landing-pages.md) — páginas de contexto que expanden secciones del
  home (`/mercados`, `/como-funciona`, `/plataforma`) sin reemplazar la landing de una sola página.

## Cómo crece esto

Cuando una feature merezca su propia spec falsable (auth, paywall, billing, market-view),
se agrega como `docs/specs/<feature>.md` y se enlaza desde acá. Hoy el producto está descrito
de forma transversal en `product.md`; la decomposición por-feature se hace a medida que cada
una evoluciona.
