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
import { SectionReveal } from "@/components/landing/section-reveal"
import { SmoothScroll } from "@/components/motion/smooth-scroll"

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="landing-editorial flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1">
          {/* El hero tiene su propia animación de carga; el resto se revela al scrollear */}
          <Hero />
          <SectionReveal>
            <TrustStrip />
          </SectionReveal>
          <SectionReveal>
            <StatsStrip />
          </SectionReveal>
          <SectionReveal>
            <ValueTrio />
          </SectionReveal>
          <SectionReveal>
            <HowItWorks moreHref="/como-funciona" />
          </SectionReveal>
          <SectionReveal>
            <MarketsCovered moreHref="/mercados" />
          </SectionReveal>
          <SectionReveal>
            <PlatformSection moreHref="/plataforma" />
          </SectionReveal>
          <SectionReveal>
            <WhyUs moreHref="/seguridad" />
          </SectionReveal>
          <SectionReveal>
            <Plans />
          </SectionReveal>
          <SectionReveal>
            <Segments />
          </SectionReveal>
          <SectionReveal>
            <Resources />
          </SectionReveal>
          <SectionReveal>
            <Faq moreHref="/faq" />
          </SectionReveal>
          <SectionReveal>
            <ClosingCta />
          </SectionReveal>
        </main>
        <SiteFooter />
      </div>
    </SmoothScroll>
  )
}
