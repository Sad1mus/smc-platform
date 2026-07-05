import { getUser } from "@/lib/auth/profile"
import { HeaderChrome } from "@/components/landing/header-chrome"

/**
 * Header del sitio. Resuelve el usuario en el server y delega el chrome
 * (sticky, sombra al scroll, nav y menú móvil) a HeaderChrome (cliente).
 */
export async function SiteHeader() {
  const user = await getUser()
  return <HeaderChrome isAuthed={Boolean(user)} />
}
