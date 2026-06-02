import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Link
        href="/"
        className="text-foreground text-xl font-bold tracking-tight"
      >
        SMC<span className="text-primary">.</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
