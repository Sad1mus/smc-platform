import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { StatsStrip } from "@/components/landing/stats-strip"
import { HowItWorks } from "@/components/landing/how-it-works"
import { MarketsCovered } from "@/components/landing/markets-covered"
import { Features } from "@/components/landing/features"
import { Plans } from "@/components/landing/plans"
import { Faq } from "@/components/landing/faq"
import { Cta } from "@/components/landing/cta"
import { SiteFooter } from "@/components/landing/site-footer"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StatsStrip />
        <HowItWorks />
        <MarketsCovered />
        <Features />
        <Plans />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
    </>
  )
}
