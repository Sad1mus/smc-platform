# Spec — Fase 2: Apps móviles (Android + iOS)

> Estado: **borrador para aprobación**. Decisión de enfoque tomada el 2026-07-02: **Capacitor**
> envolviendo la web de producción. Móvil es Fase 2 por definición canónica del proyecto
> (Fase 1 = web completa con cobros + admin, ya en producción).

## Objetivo

Entregar **apps instalables en App Store y Google Play** para SMC reutilizando la plataforma
web ya construida (Fase 1), con el mínimo costo/tiempo incremental y sin duplicar el frontend.
Las apps consumen el mismo backend (Supabase + Stripe) y la misma UI web; agregan capacidades
nativas que la web no puede dar.

## Decisión de enfoque: Capacitor (shell nativo sobre la web de producción)

- **Elegido:** Capacitor con `server.url` apuntando a la web de producción. El shell nativo
  carga la web viva; las actualizaciones de producto llegan con cada deploy web, **sin pasar
  por review de las stores**.
- **Descartado — Expo/React Native:** exigiría reescribir el frontend completo. Solo se
  reconsiderará si el cliente exige UX nativa premium (existe camino: 9 skills de Expo en
  autoskills.sh + mismo backend).
- **Descartado — PWA sola:** no entrega apps en stores, y el presupuesto del anexo incluye
  Apple Developer + Play Console → el cliente espera apps en stores.

## Restricciones que condicionan el diseño

1. **Apple Guideline 4.2 (minimum functionality):** Apple rechaza "webs empaquetadas". El
   shell DEBE incluir capacidades nativas reales (ver Alcance). Google Play es laxo; Apple no.
2. **Entorno de build Linux:** iOS **no se compila localmente** (Xcode requiere macOS). Los
   builds iOS se hacen en nube (Codemagic / Ionic Appflow / GitHub Actions con runner macOS).
   Android se compila local (Android SDK + Gradle).
3. **Next.js 16 con SSR/server actions:** no hay static export viable del dashboard → el
   shell usa `server.url` remoto (patrón soportado por Capacitor). El bridge nativo
   (`@capacitor/core`) se integra en la web para que los plugins funcionen dentro del shell.
4. **Regulatorio (hereda de `product.md`):** solo visualización; prohibido "broker";
   atribución "by TradingView" visible también en las apps.
5. **Cuentas de stores a nombre del cliente** (consistente con todo el proyecto): Apple
   Developer Program (USD 99/año, verificación tarda días/semanas) y Google Play Console
   (USD 25 único). **Iniciar el enrolamiento de Apple es el lead time más largo de la fase.**

## Alcance

### M1 — Shell Capacitor + Android debug
- Proyecto Capacitor en `mobile/` dentro de este repo (vive en el repo del cliente).
- Config `server.url` → producción; splash + íconos con la identidad SMC (terminal oscuro + dorado).
- APK debug compilando local y cargando la web de producción.

### M2 — Capacidades nativas (mitigación 4.2 + valor real)
- **Push notifications** (FCM + APNs): alertas de precio sobre la watchlist existente.
- **Biometría** (Face ID / huella) como gate opcional de la sesión.
- Deep links (`smc://` + universal links) hacia rutas del dashboard.
- Integración del bridge Capacitor en la web (detección `Capacitor.isNativePlatform()`).

### M3 — Android release
- AAB firmado (keystore del cliente), subido a Play Console (cuenta del cliente), track interno → producción.

### M4 — iOS release
- Build en nube (pipeline reproducible y versionado), firma con certificados del cliente,
  TestFlight → review de App Store con las capacidades nativas de M2 activas.

## Criterios de aceptación (verificables)

- `mobile/` compila Android local: `./gradlew assembleDebug` exit 0; el APK abre y renderiza
  el dashboard de producción en un emulador/dispositivo.
- Push: el dispositivo registra token FCM/APNs y recibe una notificación de prueba end-to-end.
- Biometría: con el flag activo, la app exige biometría al reabrir; sin hardware, degrada a sesión normal.
- Deep link `smc://dashboard` abre la app en el dashboard.
- La atribución TradingView es visible en las vistas de mercado dentro de la app.
- iOS: pipeline de build en nube en verde + build instalable vía TestFlight.
- Publicación: app aprobada en Play (M3) y en App Store (M4) en las cuentas del cliente.

## Fuera de alcance (Fase 2)

- **KYC/AML** — sigue diferido (hereda de `hardening.md`).
- **Ejecución de órdenes / trading** — prohibido por posicionamiento regulatorio.
- **UI nativa por pantalla (RN/SwiftUI/Compose)** — solo si el cliente lo pide y se cotiza aparte.
- **Notificaciones de marketing masivas** — solo alertas funcionales de watchlist en esta fase.
- Tablets/iPad como target optimizado (funciona, pero no se optimiza el layout en esta fase).

## Dependencias externas (human-gated — fuera de cualquier goal-queue)

| Dependencia | Dueño | Lead time |
|---|---|---|
| Apple Developer Program (cuenta del cliente) | cliente | días–semanas ← **iniciar YA** |
| Google Play Console (cuenta del cliente) | cliente | ~1 día |
| Proyecto Firebase (FCM) en cuenta del cliente | cliente + nosotros | horas |
| Keystore Android / certificados iOS | generamos, custodia el cliente | horas |
| Servicio de build iOS en nube (Codemagic/Appflow) | decidir + cuenta | horas |

## Riesgos

1. **Rechazo Apple 4.2** pese a M2 → mitigación adicional: mover navegación principal a
   tabs nativos y/o sumar widget de cotizaciones. Se evalúa solo si hay rechazo.
2. **`server.url` remoto requiere conectividad** → aceptable: SMC es datos en tiempo real,
   sin conexión no hay producto; se agrega pantalla offline nativa amable.
3. **Stripe dentro del shell iOS:** los planes se venden como acceso al servicio web; si
   Apple objeta compras dentro de la app (guideline 3.1), se degrada a "login-only" en iOS
   (patrón Netflix/Spotify: comprar en la web, consumir en la app). No construir IAP en esta fase.
