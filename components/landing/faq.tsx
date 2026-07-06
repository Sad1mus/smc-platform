import { Plus } from "lucide-react"

import { getDictionary } from "@/lib/i18n/server"

/**
 * FAQ pública (spec §Landing): acordeón accesible. Concepto introducing broker:
 * SMC Markets es la plataforma; la ejecución y la custodia las hacen brokers
 * socios regulados. Copy i18n.
 *
 * Se usa <details>/<summary> nativo: accesible por teclado y lectores de
 * pantalla sin JavaScript, y funciona aunque la hidratación falle.
 */
export async function Faq() {
  const { t } = await getDictionary()

  return (
    <section id="faq" className="scroll-mt-14">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold tracking-tight">{t.faq.heading}</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>
        <div className="glass-card mt-10 divide-y divide-[rgba(30,55,120,0.1)] overflow-hidden">
          {t.faq.items.map((faq) => (
            <details
              key={faq.q}
              className="group [&_summary]:hover:bg-white/40"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium transition-colors duration-200 marker:content-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <Plus
                  aria-hidden="true"
                  className="text-gold size-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
