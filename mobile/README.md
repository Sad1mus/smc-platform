# SMC Mobile — shell Capacitor (Fase 2)

Shell nativo que carga la **web de producción** (`server.url` en `capacitor.config.ts`).
Cada deploy web actualiza las apps sin pasar por review de stores.
Spec: [`docs/specs/mobile.md`](../docs/specs/mobile.md).

## Requisitos de build (Android, local en Linux)

Toolchain instalada **sin sudo** en `$HOME/.android-toolchain`:

```bash
export JAVA_HOME="$HOME/.android-toolchain/jdk-21.0.11+10"  # Temurin 21 (ajustar si cambia la versión)
export ANDROID_HOME="$HOME/.android-toolchain/android-sdk"  # cmdline-tools + platform-tools
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

Versiones requeridas (de `android/variables.gradle` / AGP):

- JDK **21** (Temurin) · AGP **8.13** · Gradle **8.14** (wrapper)
- compileSdk/targetSdk **36** · minSdk **24** · build-tools **36.0.0**

`android/local.properties` (no se commitea) debe apuntar al SDK:

```properties
sdk.dir=/home/<usuario>/.android-toolchain/android-sdk
```

## Comandos

```bash
npm install                 # deps de Capacitor (package.json propio, npm — NO pnpm del root)
npx cap sync android        # sincroniza config/plugins al proyecto Android
cd android && ./gradlew assembleDebug   # APK debug
# salida: android/app/build/outputs/apk/debug/app-debug.apk
```

Íconos/splash: fuente en `assets/` (SVG + PNG); regenerar con `npm run assets`
(`@capacitor/assets`, requiere icon.png 1024² y splash\*.png 2732²).

## Qué es cada cosa

- `capacitor.config.ts` — appId `com.smartmoney.smc`, `server.url` → producción.
- `www/` — placeholder de arranque; el contenido real vive en el server remoto.
- `android/` — proyecto Gradle generado por Capacitor (SÍ se versiona).

## Capacidades nativas ya integradas (M2)

- **Deep links** `smc://<ruta>` → abren la app en esa ruta (intent-filter en el manifest +
  `DeepLinkHandler` en la web). Probar: `adb shell am start -a android.intent.action.VIEW -d "smc://dashboard"`.
- **Biometría opcional**: gate del dashboard tras `NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE=true`
  (env de la WEB en Vercel; default off). Solo actúa dentro del shell; en navegador no cambia nada.
- **Offline**: `www/error.html` (via `server.errorPath`) cuando no hay conexión.
- Plugins: `@capacitor/app`, `@capgo/capacitor-native-biometric`.

## Handoff — lo que falta y quién lo desbloquea (M3/M4, ver spec §Dependencias)

### M3 — Android release (el AAB firmado YA se genera; falta solo Play Console)

**Estado:** el signing de release está configurado y el bundle se compila firmado:

```bash
cd android && ./gradlew bundleRelease
# salida: android/app/build/outputs/bundle/release/app-release.aab (FIRMADO)
```

- El keystore vive **fuera del repo** en `~/.android-keys/smc-release.keystore` (alias `smc`).
- Las credenciales las lee Gradle de `android/keystore.properties` (**gitignored**; plantilla en
  `keystore.properties.example`). Sin ese archivo, el build de release sale sin firmar.
- **CUSTODIA DEL KEYSTORE (crítico):** perderlo = no poder publicar actualizaciones de la app
  nunca más (Play no acepta otra firma). Hacer **backup cifrado** del keystore + del
  `keystore.properties` en un gestor de secretos/almacenamiento cifrado, y entregar copia al
  cliente al hacer el handoff. No enviarlos por canales en claro.

Lo único gated por el cliente:

1. **Cliente crea Google Play Console** (USD 25 único) — https://play.google.com/console
2. Subir el AAB a Play Console → track interno → producción.

### M4 — iOS (gated: Apple Developer del cliente; NO se compila en Linux)

1. **Cliente se enrola en Apple Developer Program** (USD 99/año) — el paso más lento (días/semanas). **Iniciar YA.**
2. Elegir servicio de build en nube: **Codemagic** (recomendado, tier gratis) o Ionic Appflow.
3. `npx cap add ios` (lo hace el pipeline en macOS de la nube), certificados/perfiles del cliente
   gestionados por el servicio, build → TestFlight → review.
4. Review de Apple: las capacidades nativas de M2 (deep links, biometría, push cuando esté)
   son la defensa contra el rechazo 4.2 "web empaquetada". Si aún así objetan, ver spec §Riesgos.

### Push notifications (gated: Firebase del cliente)

1. Cliente crea proyecto **Firebase** y registra la app `com.smartmoney.smc` → descarga `google-services.json`.
2. Colocarlo en `android/app/`, agregar `@capacitor/push-notifications` y el plugin de
   google-services al build.gradle. (APNs para iOS se configura en el paso M4 con la cuenta Apple.)
3. Alertas de precio de watchlist: requiere además un worker/cron server-side (se especifica al activarse).

**Checklist de cuentas que debe crear el cliente:** Apple Developer · Google Play Console · Firebase.
