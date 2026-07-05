import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { DeepLinkHandler } from "@/components/native/deep-link-handler"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "SMC — Trading Multi-Activo en Tiempo Real",
    template: "%s — SMC",
  },
  description:
    "Plataforma de trading multi-activo: gráficos en tiempo real, tu portafolio y tus operaciones a través de brokers socios regulados.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
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
