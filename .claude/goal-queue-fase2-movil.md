# Goal Queue — SMC · Fase 2 móvil (M1+M2 autocompletables)

estado: completada (4/4 done)
current: 4
turn_cap_por_item: 25
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: ejecutar la parte autocompletable de la Fase 2 (apps móviles) según la spec
aprobada docs/specs/mobile.md (commit d9f4a3e). Enfoque: Capacitor con server.url →
web de producción (https://smc-platform-smart-money-s-projects.vercel.app).

Continúa: goal-queue-fase1-web.md (completada 4/4; Fase 1 web viva en prod, merge df16887).

EXCLUIDO A PROPÓSITO (human-gated — NO meter en esta cola, NO bloquear la cola por esto):
- Push notifications end-to-end (FCM/APNs): requiere proyecto Firebase + cuentas del cliente.
  En esta cola solo se DOCUMENTA; no integrar el plugin de push si rompe el build sin
  google-services.json.
- M3 Android release: requiere keystore + Google Play Console del cliente (USD 25).
- M4 iOS: requiere Apple Developer del cliente (USD 99/año) + servicio de build en nube.
  iOS NO se compila en esta máquina (Linux); no intentarlo.
- Stripe live, legales reales, dominio, SMTP (pendientes de Fase 1, siguen su propio camino).

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).
- Todos los comandos se corren dentro de `repo`.
- Al inicio de cada turno, reimprimir el estado de la cola (X/4 done, tarea actual).
- Commits como Sad1mus (el git config del repo ya usa el email noreply correcto), sin
  Co-Authored-By ni footer. Trabajar en `develop`. NUNCA `git push`.
- SDD: la spec docs/specs/mobile.md manda; si algo la contradice, actualizar la spec primero.
- MARCO REGULATORIO: solo visualización; prohibido "broker"; atribución TradingView visible.
- Toolchain: NO usar sudo. Si falta JDK/Android SDK, instalarlos en $HOME (Temurin tarball,
  cmdline-tools + sdkmanager con licencias aceptadas por stdin). Si una descarga falla
  repetidamente -> [blocked] con motivo y seguir.
- La web debe seguir funcionando idéntica en navegador puro (degradación limpia del bridge).
- Si una tarea no avanza en 25 turnos -> [blocked] con motivo y seguir con la siguiente.
-->

## [done] 1. Scaffold Capacitor en mobile/ (M1a)
**Condición:** Existe `mobile/` con proyecto Capacitor inicializado: `@capacitor/core`,
`@capacitor/cli` y `@capacitor/android` instalados; `capacitor.config.ts` con `appId`
tipo `com.smartmoney.smc`, `appName` "SMC", y `server.url` apuntando a la web de producción
(`https://smc-platform-smart-money-s-projects.vercel.app`) con `androidScheme: "https"`;
plataforma Android agregada (`npx cap add android`); `webDir` placeholder mínimo documentado
(el contenido real vive en el server remoto). Íconos y splash con la identidad SMC (fondo
oscuro + acento dorado; generados con @capacitor/assets o SVG->PNG). `mobile/` con su propio
`package.json` (NO contaminar el package.json raíz de la web). En UN commit `feat:`.
**Check (imprimir):** `ls mobile/android/` muestra el proyecto Gradle · `cat mobile/capacitor.config.ts`
muestra server.url correcto · `cd mobile && npx cap sync android` exit 0 · `git log --oneline -1`.
**No tocar:** package.json raíz (dependencias web) salvo scripts opcionales. Nada de push
notifications todavía. No `git push`.
**Evidencia:** Commit `d7e46c6 feat:` (86 archivos). `mobile/` con package.json propio (npm,
fuera del workspace pnpm), Capacitor 8 + android platform, `capacitor.config.ts` con
appId com.smartmoney.smc y server.url→prod (androidScheme https), www/ placeholder,
íconos/splash SMC (velas doradas/fondo oscuro, 100 recursos vía @capacitor/assets+sharp).
`npx cap sync android` exit 0. Sin push.

## [done] 2. Toolchain Android + APK debug compilando (M1b)
**Condición:** JDK 17+ y Android SDK (cmdline-tools + platforms + build-tools que pida el
proyecto) disponibles SIN sudo (en $HOME si hay que instalarlos; licencias aceptadas), y
`mobile/android` compila: `./gradlew assembleDebug` exit 0 produciendo
`app/build/outputs/apk/debug/app-debug.apk`. Variables (ANDROID_HOME, JAVA_HOME) documentadas
en `mobile/README.md`. Commit `chore:` si hubo cambios de config del proyecto.
**Check (imprimir):** `java -version` (17+) · `sdkmanager --version` o `ls $ANDROID_HOME` ·
`cd mobile/android && ./gradlew assembleDebug` exit 0 · `ls -la mobile/android/app/build/outputs/apk/debug/`
muestra el APK con su tamaño · `git log --oneline -1`.
**No tocar:** No sudo. No modificar el código web. Si las descargas del SDK fallan
repetidamente (red), [blocked] con el motivo exacto y seguir. No `git push`.
**Evidencia:** Commit `7f095f5 chore:` (README). Toolchain sin sudo en `$HOME/.android-toolchain`:
Temurin JDK 21.0.11 + cmdline-tools + platform-tools + platforms;android-36 + build-tools;36.0.0
(licencias aceptadas). `./gradlew assembleDebug --no-daemon` → BUILD SUCCESSFUL en 2m44s,
`app-debug.apk` 4.6MB en outputs/apk/debug/. local.properties creado (gitignored). Sin push.

## [done] 3. Bridge nativo en la web: detección, deep links y biometría opcional (M2 parcial)
**Condición:** La web integra `@capacitor/core` con degradación limpia: (a) helper
`lib/native/platform.ts` que expone `isNativeApp()` (false en navegador puro, sin romper SSR);
(b) deep links: intent-filter `smc://` en el AndroidManifest + manejo web de la ruta de
entrada; (c) biometría OPCIONAL detrás de flag (`NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE`, default
off): al reabrir la app nativa con el flag on, pide biometría antes de mostrar el dashboard
(plugin de biometría agregado en mobile/, gate implementado en la web solo cuando
`isNativeApp()`); sin flag o en navegador, comportamiento idéntico al actual; (d) pantalla/aviso
offline amable cuando el shell no puede alcanzar el server. Tests unitarios del helper y del
gate (mockeando Capacitor). En UN commit `feat:`.
**Check (imprimir):** `pnpm vitest run` exit 0 con los tests nuevos · `pnpm build` exit 0 ·
`grep -n "smc" mobile/android/app/src/main/AndroidManifest.xml` muestra el intent-filter ·
`cd mobile && npx cap sync android` exit 0 · `git log --oneline -1`.
**No tocar:** No degradar el comportamiento web actual (sin flag todo idéntico). No push
notifications. No debilitar CSP/headers (si el bridge exige ajustar CSP, el ajuste mínimo y
documentado). No `git push`.
**Evidencia:** Commit `488985e feat:`. `lib/native/platform.ts` (bridge por window.Capacitor
inyectado, SIN dependencia @capacitor/core en la web; isNativeApp/verifyBiometric/deepLinkToPath/
onAppUrlOpen), `DeepLinkHandler` en root layout, `BiometricGate` hydration-safe en dashboard
layout tras flag NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE (default off, .env.example actualizado),
`www/error.html` + server.errorPath, intent-filter smc:// en AndroidManifest, plugins
@capacitor/app 8.1.0 + @capgo/capacitor-native-biometric 8.4.12. Checks: vitest 51/51 ·
pnpm build exit 0 · cap sync exit 0 · gradle assembleDebug BUILD SUCCESSFUL (APK 9.2MB).
CSP intacta. Sin push.

## [done] 4. Gate final: pipeline verde + docs de handoff M3/M4
**Condición:** Pipeline completo verde en `develop` con todo lo anterior: `pnpm lint`,
`pnpm format:check`, `pnpm vitest run`, `pnpm build` (web) y `./gradlew assembleDebug`
(mobile) todos exit 0. `mobile/README.md` documenta: cómo compilar debug, cómo se genera el
keystore de release y qué pasos M3 (Play Console) y M4 (iOS en nube: Codemagic/Appflow +
certificados Apple) quedan gated por cuentas del cliente, con la lista exacta de lo que el
cliente debe crear (Apple Developer, Play Console, Firebase). Working tree limpio (tracked).
Commit final si hace falta.
**Check (imprimir):** los 5 comandos con exit 0 visibles · `git status --short` sin tracked
pendientes · `sed -n '1,40p' mobile/README.md` · `git log --oneline -4`.
**No tocar:** No marcar tests skip/only. No `git push`.
**Evidencia:** Commit `d3ef14b chore:`. Fix react-hooks/set-state-in-effect en BiometricGate
(setTimeout diferido), mobile/android|www excluidos de eslint/.prettierignore. Pipeline:
eslint 0 · prettier --check 0 · vitest 51/51 · next build 0 · gradle assembleDebug BUILD
SUCCESSFUL. mobile/README.md con handoff completo M3 (keystore+Play), M4 (iOS nube+Apple,
defensa 4.2) y push (Firebase), checklist de cuentas del cliente. Tracked limpio. Sin push.

<!--
Al terminar la cola (4/4 done o [blocked] justificado), la Fase 2 queda a la espera SOLO de
lo human-gated: cuentas Apple/Play/Firebase del cliente -> M2-push, M3 y M4. El merge
develop→main y push los hace el asesor con OK del usuario (merge commit autorado por
smartmoney4 para no bloquear el auto-deploy de Vercel).
-->
