import type { Metadata } from "next"
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google"

import { DeepLinkHandler } from "@/components/native/deep-link-handler"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { getDictionary, getLocale } from "@/lib/i18n/server"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Fuente display de la landing (Bricolage Grotesque — carácter futurista, scoped por --font-display).
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
})

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary()
  return {
    title: {
      default: t.meta.homeTitle,
      template: "%s — SMC Markets",
    },
    description: t.meta.homeDescription,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <DeepLinkHandler />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
