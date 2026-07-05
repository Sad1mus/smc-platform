import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { TrustStrip } from "@/components/landing/trust-strip"
import { StatsStrip } from "@/components/landing/stats-strip"
import { ValueTrio } from "@/components/landing/value-trio"
import { HowItWorks } from "@/components/landing/how-it-works"
import { MarketsCovered } from "@/components/landing/markets-covered"
import { PlatformSection } from "@/components/landing/platform-section"
import { WhyUs } from "@/components/landing/why-us"
import { Plans } from "@/components/landing/plans"
import { Segments } from "@/components/landing/segments"
import { Resources } from "@/components/landing/resources"
import { Faq } from "@/components/landing/faq"
import { ClosingCta } from "@/components/landing/closing-cta"
import { SiteFooter } from "@/components/landing/site-footer"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <StatsStrip />
        <ValueTrio />
        <HowItWorks />
        <MarketsCovered />
        <PlatformSection />
        <WhyUs />
        <Plans />
        <Segments />
        <Resources />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}
