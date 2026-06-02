import Link from "next/link"

import { cn } from "@/lib/utils"

/** Wordmark "SMC." con el punto dorado del dossier. */
export function Logo({
  className,
  href = "/",
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground inline-flex items-baseline text-xl font-bold tracking-tight select-none",
        className
      )}
    >
      SMC<span className="text-gold">.</span>
    </Link>
  )
}
