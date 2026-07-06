import { Logo } from "@/components/brand/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Logo />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
