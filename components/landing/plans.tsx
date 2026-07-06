import Link from "next/link"
import { Check } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { getDictionary } from "@/lib/i18n/server"
import type { Plan } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/** Formatea el precio del plan en USD (los precios vienen del dossier). */
function formatPrice(plan: Plan): string {
  if (plan.is_custom || plan.price_usd === null) return "Personalizado"
  return `$${Number(plan.price_usd).toLocaleString("en-US")}`
}

function planFeatures(plan: Plan): string[] {
  return Array.isArray(plan.features) ? (plan.features as string[]) : []
}

export async function Plans() {
  const [supabase, { t }] = await Promise.all([createClient(), getDictionary()])
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("sort_order")

  if (!plans || plans.length === 0) return null

  const trial = plans.find((p) => p.id === "prueba")
  const mainPlans = plans.filter((p) => p.id !== "prueba")

  return (
    <section id="planes" className="scroll-mt-14">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold tracking-tight">
            {t.plans.heading}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.plans.subtitle}
          </p>
        </div>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {mainPlans.map((plan) => {
            const isVip = plan.id === "vip"
            return (
              <RevealItem key={plan.id}>
                <article
                  className={cn(
                    "glass-card relative flex h-full w-full flex-col gap-5 p-7",
                    isVip && "ring-2 ring-[#3E72F7]/60"
                  )}
                >
                  {isVip ? (
                    <Badge className="absolute -top-2.5 right-4 bg-gradient-to-b from-[#3E72F7] to-[#2350E8] text-white">
                      Premium
                    </Badge>
                  ) : null}
                  <header className="flex flex-col gap-1">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                      {plan.name}
                    </h3>
                    <p className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-bold tracking-tight">
                        {formatPrice(plan)}
                      </span>
                      {!plan.is_custom ? (
                        <span className="text-muted-foreground text-sm">
                          USD
                        </span>
                      ) : null}
                    </p>
                    {plan.description ? (
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {plan.description}
                      </p>
                    ) : null}
                  </header>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {planFeatures(plan).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check
                          aria-hidden="true"
                          className="text-gold mt-0.5 size-4 shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={isVip ? "gold" : "outline"}
                    className="w-full"
                  >
                    <Link
                      href={
                        plan.is_custom
                          ? "/registro?plan=vip"
                          : `/registro?plan=${plan.id}`
                      }
                    >
                      {plan.is_custom
                        ? t.cta.talkToUs
                        : `${t.plans.choose} ${plan.name}`}
                    </Link>
                  </Button>
                </article>
              </RevealItem>
            )
          })}
        </RevealGroup>

        {trial ? (
          <aside className="bg-primary text-primary-foreground mt-6 flex flex-col items-start justify-between gap-4 rounded-xl p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-semibold">{t.plans.trial}</h3>
              <p className="text-primary-foreground/80 mt-1 max-w-md text-sm leading-relaxed">
                {trial.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-mono text-2xl font-bold whitespace-nowrap">
                {formatPrice(trial)}{" "}
                <span className="text-primary-foreground/70 text-sm font-normal">
                  USD
                </span>
              </p>
              <Button asChild variant="secondary">
                <Link href="/registro?plan=prueba">{t.plans.trialCta}</Link>
              </Button>
            </div>
          </aside>
        ) : null}

        <p className="text-muted-foreground/80 mt-6 text-xs leading-relaxed">
          {t.plans.note}
        </p>
      </div>
    </section>
  )
}
