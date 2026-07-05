import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
