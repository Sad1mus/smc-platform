# Spec — Observabilidad (Fase 1)

> Derivada del dossier `SMC_s.pdf` (Fase 1 · "Observabilidad avanzada") y de la capa
> transversal de la arquitectura objetivo (Sentry · logs · uptime · alertas).

## Objetivo

Que el equipo **vea** qué pasa en producción —errores, performance y disponibilidad—
**antes** de que entre tráfico que paga. No operar a ciegas cuando fluye dinero real.

## Criterios de aceptación

1. **Captura de errores (Sentry)** en las tres superficies de Next 16: client, server y
   edge, vía `instrumentation.ts` y configs por runtime. Condicional a
   `NEXT_PUBLIC_SENTRY_DSN`: sin DSN, el build pasa y no se envía nada (degradación elegante).
2. **Error boundary global** que captura y reporta excepciones de render sin tumbar la app.
3. **Logging estructurado (JSON)** en los caminos críticos: webhook de Stripe, checkout,
   y callbacks de auth — con un id de correlación por request. Sin PII en el payload.
4. **Health endpoint** (`/api/health`) que reporta el estado de las dependencias
   (Supabase, Stripe configurado, etc.) para uptime checks.
5. **Reglas de alerta documentadas** (Sentry alerts: tasa de error, regresión de latencia)
   — la activación es config externa, pero las reglas quedan escritas.

## Fuera de alcance (diferido, con motivo)

- **APM / tracing distribuido avanzado** y **agregación de logs dedicada**: se difieren;
  por ahora alcanza Sentry + logs de Vercel. Se reevalúa con volumen real.
- **Dashboards de negocio** (conversión, MRR): es producto, no observabilidad; otra spec.

## Verificación

`npx tsc --noEmit` limpio · `pnpm vitest run` y `pnpm build` en verde **sin DSN**
configurado (prueba la degradación) · archivos de instrumentación presentes.
