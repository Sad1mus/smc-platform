import Link from "next/link"

import { Logo } from "@/components/brand/logo"

export function SiteFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <Logo />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link
              href="/#caracteristicas"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Características
            </Link>
            <Link
              href="/#planes"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Planes
            </Link>
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/terminos"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacidad
            </Link>
            <Link
              href="/reembolsos"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Reembolsos
            </Link>
          </nav>
        </div>
        <div className="border-border/60 flex flex-col gap-4 border-t pt-6">
          <p className="text-muted-foreground/80 max-w-3xl text-xs leading-relaxed">
            SMC es una plataforma de visualización de datos de mercado
            únicamente. No ejecuta órdenes, no custodia fondos de clientes y no
            constituye asesoría de inversión. Los datos de mercado se muestran
            con fines informativos. Gráficos por TradingView.
          </p>
          <p className="text-muted-foreground/60 font-mono text-xs">
            © {new Date().getFullYear()} SMC
          </p>
        </div>
      </div>
    </footer>
  )
}
