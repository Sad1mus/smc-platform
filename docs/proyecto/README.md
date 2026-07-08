# Documentación del proyecto — SMC Markets

> **Handbook del proyecto.** Vista cohesiva y legible de qué es SMC, cómo está construido,
> qué features existen y en qué estado. Complementa (no reemplaza) las specs técnicas de
> `docs/specs/` — esas siguen siendo la **fuente de verdad** de cada feature.
>
> Última actualización: 2026-07-08.

## Qué es SMC Markets

Plataforma web de **visualización de mercados** (display-only): gráficos TradingView en tiempo
real + cuentas + acceso pago. **No ejecuta órdenes, no custodia fondos, no es asesoría.**

**Restricción regulatoria dura (gobierna código y copy):** la palabra **"broker" está prohibida**
en copy pública; nada puede sugerir custodia, ejecución de órdenes ni promesa de rentabilidad. La
ejecución y la custodia se atribuyen SIEMPRE a **brokers socios regulados**. Ver `docs/specs/product.md`.

## Estado general (2026-07-08)

- **En producción** en Vercel + Supabase (infra del cliente). Web + shell móvil Android (Capacitor).
- **Modelo de cobro:** pago único (Bronce/Plata 1 año, Prueba 30 días). Código listo; **el cobro en
  vivo está bloqueado por insumos del cliente** (activación de la cuenta Stripe + `price_...` + `whsec_`).
- **Tema:** light por defecto en toda la plataforma, con toggle a dark.
- **Camino crítico:** insumos del cliente (Stripe, legales, compliance). Todo lo demás es secundario.

## Índice de esta carpeta

| Doc                                              | Contenido                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| [arquitectura.md](arquitectura.md)               | Stack, estructura, capas Supabase, middleware, deploy, remotes git       |
| [modelo-datos.md](modelo-datos.md)               | Tablas, migraciones, RLS, roles                                          |
| [integraciones.md](integraciones.md)             | Stripe, Supabase, TradingView, Resend, Sentry, env vars                  |
| [features-estado.md](features-estado.md)         | **Inventario de features y su estado real (completo / stub / diferido)** |
| [deploy-operaciones.md](deploy-operaciones.md)   | Runbook: CI, preflight, deploy a prod, go-live gate                      |
| [estado-y-pendientes.md](estado-y-pendientes.md) | Estado actual, limitaciones conocidas y roadmap                          |

## Otras fuentes (ya existentes, no duplicadas acá)

- **`README.md`** (raíz del repo) — stack, comandos y estructura de carpetas.
- **`CLAUDE.md`** (raíz del repo) — arquitectura de fondo y convenciones no obvias.
- **`docs/specs/`** — spec por feature (fuente de verdad). Índice en `docs/specs/README.md`.
- **`docs/reviews/audit-2026-07-07.md`** — auditoría + registro de errores de la web.
- **`docs/handoff-*.md`** — snapshots de sesiones de trabajo.
