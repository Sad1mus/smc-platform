# Entrega Fase 1 — MVP · estado y checklist de cierre

> Fase 1 del roadmap consolidado: **plataforma en producción + apps + KYC**.
> Este documento separa lo que está HECHO (verificable en el repo/CI) de lo que
> queda **human-gated**: pasos que requieren cuentas, claves o datos que solo
> el cliente puede proveer. Actualizado: 2026-07-02.

## Hecho (verificable)

| Entregable                                                                 | Estado    | Evidencia                                 |
| -------------------------------------------------------------------------- | --------- | ----------------------------------------- |
| Frontend web responsive (Next.js 16 / React 19 / Tailwind 4, SSR)          | ✅        | Producción en Vercel                      |
| Gráficos TradingView en tiempo real (display-only, atribución visible)     | ✅        | `/dashboard`                              |
| Autenticación: registro, login, recuperación                               | ✅        | e2e verdes                                |
| RBAC (user/admin) + sesiones seguras + panel `/admin`                      | ✅        | `is_admin()`, tests de acceso             |
| Pasarela Stripe: checkout, suscripciones, webhook firmado e idempotente    | ✅ código | Gated por claves (abajo)                  |
| KYC flag-gated: tabla con RLS, capa provider-agnostic, UI de estado        | ✅        | `docs/specs/kyc.md`, flag off por defecto |
| App Android: shell Capacitor + bridge nativo + **AAB firmado**             | ✅        | `mobile/`, keystore fuera del repo        |
| Páginas legales (estructura con placeholders)                              | ✅        | `/terminos`, `/privacidad`, `/reembolsos` |
| Seguridad: RLS en todas las tablas, headers OWASP/CSP, rate limiting       | ✅        | e2e de seguridad                          |
| CI/CD (lint → format → test → build → e2e) + observabilidad (Sentry-ready) | ✅        | GitHub Actions verde                      |
| PostgreSQL (Supabase) con backups del proveedor                            | ✅        | Proyecto del cliente                      |

## Human-gated — checklist de cierre (quién destraba qué)

### 1. Stripe (bloqueante para cobrar)

- [ ] **Cliente:** cuenta Stripe con negocio verificado + claves (test primero, live después).
- [ ] Cargar `STRIPE_SECRET_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en Vercel (Production).
- [ ] Correr `node scripts/setup-stripe.mjs` (aprovisiona productos/precios del dossier).
- [ ] Crear webhook endpoint → cargar `STRIPE_WEBHOOK_SECRET` en Vercel.
- [ ] Abrir el candado test-mode en `lib/stripe/client.ts` (solo al pasar a live).
- [ ] Checkout end-to-end verificado (tarjeta de prueba → suscripción activa).

### 2. Supabase Auth (bloqueante para registros nuevos)

- [ ] Dashboard → Authentication → URL Configuration: **Site URL** =
      `https://smc-platform-smart-money-s-projects.vercel.app` y **Redirect URLs** con
      `https://smc-platform-smart-money-s-projects.vercel.app/**` (hoy apunta a localhost).
- [ ] **Cliente (opcional):** credenciales OAuth de Google para login social.

### 3. Legales (bloqueante para Stripe live y GDPR)

- [ ] **Cliente:** razón social, jurisdicción y política de reembolsos reales →
      reemplazar los marcadores `[[RAZÓN SOCIAL]]` / `[[JURISDICCIÓN]]` en
      `app/terminos`, `app/privacidad`, `app/reembolsos`.

### 4. Google Play (Android ya compilado y firmado)

- [ ] **Cliente:** crear Google Play Console (USD 25 único).
- [ ] Subir `mobile/android/app/build/outputs/bundle/release/app-release.aab`
      → track interno → producción.
- [ ] Custodia del keystore: ver `mobile/README.md` (crítico — backup cifrado).

### 5. iOS (fuera de esta entrega; siguiente hito)

- [ ] **Cliente:** Apple Developer Program (USD 99/año) — trámite lento, iniciarlo ya.
- [ ] Build en nube (Codemagic/Appflow) — iOS no se compila en el entorno actual (Linux).

### 6. Push notifications (opcional Fase 1)

- [ ] **Cliente:** proyecto Firebase → `google-services.json` → integrar plugin push.

### 7. Servicios operativos (opcionales, degradan limpio)

- [ ] `RESEND_API_KEY` real (emails transaccionales propios; sin ella, modo stub).
- [ ] `SENTRY_DSN` real (observabilidad de errores en producción).
- [ ] **KYC proveedor real** (Didit/Sumsub/etc., costo por verificación): decisión del
      cliente; la plataforma ya tiene la capa lista (`docs/specs/kyc.md`) y el flag
      `NEXT_PUBLIC_ENABLE_KYC` para prenderla.
- [ ] Dominio propio (~USD 12/año) → actualizar `NEXT_PUBLIC_APP_URL`, Site URL de
      Supabase y dominios en Vercel.

## Verificación de cierre

Antes del go-live definitivo: `node scripts/preflight.mjs` exit 0 (valida presencia de
variables y que Supabase/Stripe/Resend/Sentry respondan) + pipeline CI verde.
