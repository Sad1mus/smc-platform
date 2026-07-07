# Goal Queue — Landing páginas de contexto, Fase 2

estado: completada (3/3 done)
current: 3
turn_cap_por_item: 15

<!--
Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez.
- No empezar la siguiente hasta que la actual esté [done] o [blocked].
- "Check" debe correrse y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).

Patrón de referencia (YA implementado para /mercados, /como-funciona, /plataforma):
- Spec: docs/specs/landing-pages.md  (fase 2 = /faq y /seguridad).
- Página: app/<ruta>/page.tsx → SiteHeader + <ContextPage content={t.pages.<key>}>{<Seccion/>}</ContextPage> + SiteFooter,
  con generateMetadata() usando pages.<key>.metaTitle/metaDescription.
- Copy: lib/i18n/dictionaries.ts → extender el tipo `pages` y agregar la clave en `es` y en `en` (tipo PageDetail).
- Link desde el home: la sección reusada acepta prop opcional `moreHref`; el home la pasa, la página de detalle NO.
  El link se renderiza con <SectionMore href={moreHref}/> (components/landing/section-more.tsx).
- Guardarraíl regulatorio (product.md): SMC NO ejecuta, NO custodia, NO está regulado por sí mismo
  (lo hacen "brokers socios regulados") y NUNCA promete rentabilidad. Aplica a todo copy nuevo, es y en.
-->

## [done] 1. Página /seguridad (expande WhyUs)

**Condición:** Existe `app/seguridad/page.tsx` que renderiza `<ContextPage content={t.pages.security}>` reutilizando la sección `WhyUs`. Se agregó `pages.security` (tipo `PageDetail`) al tipo `pages` en `dictionaries.ts` y su contenido en **es y en** (4+ bloques que profundizan los 4 pilares: datos en tiempo real vía TradingView, pagos cifrados por Stripe, RLS/aislamiento por usuario, bilingüe — solo señales REALES, sin sellos de regulador inventados). `WhyUs` acepta prop opcional `{ moreHref?: string }` y renderiza `<SectionMore href={moreHref}/>`; el home (`app/page.tsx`) pasa `moreHref="/seguridad"`. El build lista la ruta `/seguridad`.
**Check (dejar VISIBLE):** `npx tsc --noEmit` exit 0 · `pnpm lint` exit 0 · `pnpm build 2>&1 | grep -E "/seguridad|error"` muestra la ruta y ningún error · `grep -rniE "\bbroker\b|rentabilidad|garantiz" app/seguridad lib/i18n/dictionaries.ts` — verificar a mano que "broker" solo aparece como "brokers socios regulados" y que no hay promesa de retorno.
**No tocar:** no modificar entradas i18n existentes (solo AGREGAR `pages.security`); no reemplazar ni reescribir la sección WhyUs del home (solo sumar el link opcional); no tocar Supabase/Stripe/auth/`proxy.ts`/rutas existentes.
**Evidencia:** `npx tsc --noEmit` exit 0; `pnpm lint` limpio; `pnpm build` compiló y listó `ƒ /seguridad`; grep regulatorio solo con usos aprobados (introducing broker / brokers socios regulados / heading "Sin promesas de rentabilidad"). Archivos: `app/seguridad/page.tsx`, `pages.security` (es/en), `WhyUs` con `moreHref`, home pasa `moreHref="/seguridad"`.

## [done] 2. Página /faq (expande Faq)

**Condición:** Existe `app/faq/page.tsx` que renderiza `<ContextPage content={t.pages.faq}>` reutilizando la sección `Faq` (el acordeón completo se mantiene como resumen). Se agregó `pages.faq` (tipo `PageDetail`) al tipo `pages` y su contenido en **es y en**; los `blocks` dan contexto agrupado (p. ej. "El modelo introducing broker", "Pagos y cancelación", "Tus datos") SIN repetir textualmente las respuestas del acordeón. `Faq` acepta prop opcional `{ moreHref?: string }` con `<SectionMore/>`; el home pasa `moreHref="/faq"`. Repuntar a `/faq` las referencias existentes a `/#faq` en `Resources` (item 3) y en el nav del header (`header-chrome.tsx`). El build lista la ruta `/faq`.
**Check (dejar VISIBLE):** `npx tsc --noEmit` exit 0 · `pnpm lint` exit 0 · `pnpm build 2>&1 | grep -E "/faq|error"` muestra la ruta y ningún error · `grep -rniE "\bbroker\b|rentabilidad|garantiz" app/faq` — verificación regulatoria manual OK.
**No tocar:** no modificar entradas i18n existentes (solo AGREGAR `pages.faq`); no alterar las preguntas/respuestas del diccionario `faq`; no tocar Supabase/Stripe/auth/`proxy.ts`.
**Evidencia:** `npx tsc --noEmit` exit 0; `pnpm lint` limpio; `pnpm build` listó `ƒ /faq`; grep regulatorio limpio. Archivos: `app/faq/page.tsx`, `pages.faq` (es/en), `Faq` con `moreHref`, home pasa `moreHref="/faq"`, `/#faq` repunteado a `/faq` en `Resources` y `header-chrome.tsx`.

## [done] 3. Cierre: spec + build integral verde

**Condición:** `docs/specs/landing-pages.md` refleja que la Fase 2 (`/faq`, `/seguridad`) quedó **implementada** (mover de "fase posterior" a la tabla de páginas y actualizar la sección "Fuera de alcance"). Formato aplicado y build completo verde con las 5 rutas de contexto (`/mercados`, `/como-funciona`, `/plataforma`, `/faq`, `/seguridad`).
**Check (dejar VISIBLE):** `pnpm format` aplicado · `pnpm format:check` exit 0 · `npx tsc --noEmit` exit 0 · `pnpm lint` exit 0 · `pnpm build 2>&1 | grep -E "/mercados|/como-funciona|/plataforma|/faq|/seguridad|✓ Compiled|error"` muestra las 5 rutas y "Compiled successfully", sin errores.
**No tocar:** no commitear ni pushear (gate duro del usuario: espera su OK y confirmar remote origin vs client).
**Evidencia:** `pnpm format:check` → "All matched files use Prettier code style!"; `npx tsc --noEmit` exit 0; `pnpm lint` limpio; `pnpm build` compiló con las 5 rutas (`/mercados`, `/como-funciona`, `/plataforma`, `/faq`, `/seguridad`). Spec `landing-pages.md` actualizada (Estado: IMPLEMENTADO fases 1 y 2; tabla con 5 rutas; "Fuera de alcance" sin FAQ/seguridad).
