import { getUser } from "@/lib/auth/profile"
import { getDictionary } from "@/lib/i18n/server"
import { HeaderChrome } from "@/components/landing/header-chrome"

/**
 * Header del sitio. Resuelve el usuario y el idioma en el server y delega el
 * chrome (sticky, sombra al scroll, nav, menú móvil, toggle de idioma) a
 * HeaderChrome (cliente).
 */
export async function SiteHeader() {
  const [user, { locale, t }] = await Promise.all([getUser(), getDictionary()])
  return (
    <HeaderChrome
      isAuthed={Boolean(user)}
      locale={locale}
      nav={t.nav}
      cta={t.cta}
    />
  )
}
