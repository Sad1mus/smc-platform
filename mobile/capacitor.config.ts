import type { CapacitorConfig } from "@capacitor/cli"

/**
 * Shell nativo de SMC (ver docs/specs/mobile.md).
 *
 * `server.url` apunta a la web de PRODUCCIÓN: el shell carga la web viva y
 * cada deploy web actualiza las apps sin pasar por review de stores.
 * `www/` es solo un placeholder de arranque.
 */
const config: CapacitorConfig = {
  appId: "com.smartmoney.smc",
  appName: "SMC",
  webDir: "www",
  server: {
    url: "https://smc-platform-smart-money-s-projects.vercel.app",
    androidScheme: "https",
  },
}

export default config
