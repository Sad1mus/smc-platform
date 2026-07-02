# Spec — Verificación de identidad (KYC) · Fase 1

> Estado: **flag-gated, proveedor stub**. La verificación existe como capacidad de la
> plataforma pero está apagada por defecto (`NEXT_PUBLIC_ENABLE_KYC`, default off) y no
> condiciona el acceso a ninguna funcionalidad existente.

## Por qué ahora (y por qué así)

La reestructuración del roadmap (7→3 fases) incorpora KYC/AML a la Fase 1 del MVP con la
salvedad del dossier: **"donde el modelo lo requiera"**. Para una plataforma de visualización
únicamente (no custodia fondos, no ejecuta órdenes, no es asesoría) ningún regulador lo exige
hoy; puede exigirlo un procesador de pagos o un cambio de modelo (Fase 3, ejecución vía socios
licenciados).

La respuesta de ingeniería: construir la **capacidad** completa (datos, RLS, capa de
proveedor, UI de estado) sin contratar un proveedor real todavía. Cuando el negocio lo
requiera, se enchufa el proveedor y se prende el flag — sin re-arquitectura.

## Alcance Fase 1

- **Tabla `public.kyc_verifications`** (migración `20260702162620`): una fila por usuario
  (`unique (user_id)`), estado `kyc_status` (`unverified | pending | approved | rejected`),
  `provider` y `provider_ref` para trazar la verificación externa.
- **RLS (mismo patrón que `payment_events`):** el dueño solo **lee** su verificación
  (`kyc_select_own`); `anon` sin acceso; INSERT/UPDATE/DELETE revocados para `authenticated` —
  las escrituras ocurren únicamente vía `service_role` desde código server-only.
- **Capa provider-agnostic (`lib/kyc/`):** interfaz `KycProvider` con un único punto de
  swap (`getKycProvider()`). Fase 1 usa `StubKycProvider`, determinista y sin red.
- **Flag `NEXT_PUBLIC_ENABLE_KYC`** (default off): sin flag, la UI de verificación no se
  renderiza y el comportamiento de la plataforma es idéntico al actual. Mismo patrón que
  `NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE` de la spec móvil.
- **KYC NO es bloqueante en Fase 1:** el estado se muestra y gestiona, pero no condiciona
  paywall, dashboard ni ninguna ruta. Convertirlo en gate es una decisión de producto futura
  (requiere actualizar esta spec primero).

## Comportamiento del stub (determinista, apto para tests)

`StubKycProvider.startVerification()` resuelve según el email del usuario:

| Email contiene | Resultado                                             |
| -------------- | ----------------------------------------------------- |
| `+kyc-reject`  | `rejected`                                            |
| `+kyc-pending` | `pending` (queda a la espera; simula revisión manual) |
| cualquier otro | `approved`                                            |

`provider_ref` es estable: `stub:<userId>`. Sin timers, sin red, sin aleatoriedad.

## Qué se difiere (y por qué)

- **Proveedor real** (Didit, Sumsub, Onfido, etc.): costo por verificación y contrato son
  decisión del cliente. La interfaz `KycProvider` es el único punto a implementar.
- **Biometría documental / liveness:** la aporta el proveedor real; no se especula.
- **AML screening continuo (listas de sanciones):** aplica recién con transaccionalidad
  (Fase 3); documentado para no perderlo.
- **KYC como gate de acceso:** decisión de producto; hoy expresamente NO bloqueante.

## Verificación

`pnpm vitest run` verde con los tests de `tests/unit/kyc.test.ts` (determinismo del stub,
parsing del flag, mapeo de estado) · `npx tsc --noEmit` limpio · RLS visible en el esquema
(políticas de `kyc_verifications`) · con el flag off, ningún cambio visible en la UI.
