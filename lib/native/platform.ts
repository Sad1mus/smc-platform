/**
 * Puente con el shell nativo Capacitor (Fase 2 — docs/specs/mobile.md).
 *
 * La web se carga DENTRO del shell vía `server.url`; el runtime nativo inyecta
 * `window.Capacitor` en la página remota, así que acá NO se importa
 * `@capacitor/core`: se detecta el bridge en runtime. En navegador puro nada
 * de esto existe y todos los helpers degradan a false/no-op — la web sigue
 * comportándose idéntica.
 */

type BiometricPlugin = {
  isAvailable?: () => Promise<{ isAvailable: boolean }>
  verifyIdentity?: (opts: Record<string, string>) => Promise<void>
}

type AppUrlOpenData = { url: string }
type PluginListenerHandle = { remove?: () => void }

type AppPlugin = {
  addListener?: (
    event: "appUrlOpen",
    cb: (data: AppUrlOpenData) => void
  ) => PluginListenerHandle | Promise<PluginListenerHandle>
}

type CapacitorBridge = {
  isNativePlatform?: () => boolean
  getPlatform?: () => string
  Plugins?: {
    App?: AppPlugin
    NativeBiometric?: BiometricPlugin
  }
}

function bridge(): CapacitorBridge | null {
  if (typeof window === "undefined") return null
  return (window as { Capacitor?: CapacitorBridge }).Capacitor ?? null
}

/** true solo cuando la web corre dentro del shell nativo (Android/iOS). */
export function isNativeApp(): boolean {
  return bridge()?.isNativePlatform?.() === true
}

/** Gate biométrico activo: requiere flag explícito Y estar en el shell nativo. */
export function biometricGateEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_ENABLE_BIOMETRIC_GATE === "true" && isNativeApp()
  )
}

/**
 * Pide verificación biométrica. Devuelve true si pasa o si NO corresponde
 * bloquear (sin plugin, sin hardware): la biometría es un extra, no un muro.
 * Devuelve false solo ante una verificación fallida o cancelada.
 */
export async function verifyBiometric(reason: string): Promise<boolean> {
  const bio = bridge()?.Plugins?.NativeBiometric
  if (!bio?.isAvailable || !bio.verifyIdentity) return true
  try {
    const { isAvailable } = await bio.isAvailable()
    if (!isAvailable) return true
    await bio.verifyIdentity({ reason, title: "SMC" })
    return true
  } catch {
    return false
  }
}

/**
 * Traduce un deep link a ruta interna: `smc://dashboard/plan` → `/dashboard/plan`;
 * universal links (https) → su pathname. null si la URL no es interpretable.
 */
export function deepLinkToPath(url: string): string | null {
  try {
    const u = new URL(url)
    const path =
      u.protocol === "smc:" ? `/${u.host}${u.pathname}` : u.pathname
    const clean = path.replace(/\/+$/, "")
    return clean === "" ? "/" : clean
  } catch {
    return null
  }
}

/**
 * Escucha aperturas por deep link dentro del shell. Devuelve el unsubscribe.
 * En navegador puro no registra nada (no-op).
 */
export function onAppUrlOpen(cb: (path: string) => void): () => void {
  const app = bridge()?.Plugins?.App
  if (!app?.addListener) return () => {}
  const sub = app.addListener("appUrlOpen", ({ url }) => {
    const path = deepLinkToPath(url)
    if (path) cb(path)
  })
  return () => {
    void Promise.resolve(sub).then((s) => s?.remove?.())
  }
}
