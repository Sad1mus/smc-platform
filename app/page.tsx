import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Plans } from "@/components/landing/plans"
import { SiteFooter } from "@/components/landing/site-footer"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Plans />
      </main>
      <SiteFooter />
    </>
  )
}
