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
(`@capacitor/assets`, requiere icon.png 1024² y splash*.png 2732²).

## Qué es cada cosa

- `capacitor.config.ts` — appId `com.smartmoney.smc`, `server.url` → producción.
- `www/` — placeholder de arranque; el contenido real vive en el server remoto.
- `android/` — proyecto Gradle generado por Capacitor (SÍ se versiona).

## Pendiente (gated por cuentas del cliente — ver spec §Dependencias)

Se documenta en detalle al cierre de la fase: keystore de release + Google Play Console (M3),
build iOS en nube + Apple Developer (M4), push notifications (Firebase/FCM del cliente).
