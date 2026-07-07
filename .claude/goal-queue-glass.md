# Goal Queue — Landing glass/futurista 2026 (nivel fintechx)

current: 5
Base: docs/specs/redesign.md §10 + memoria [[glass-motion-landing]]. Trabajar SIEMPRE dentro de `smc-platform/`.
Nota: NO confundir con `.claude/goal-queue.md` (histórico MVP) ni `goal-queue-reskin.md` (editorial, done).
Objetivo: extender el idioma glass del hero a TODA la landing y pulirla hasta nivel de referencia (fintechx),
sin tocar copy ni lógica. El dashboard/terminal NO se toca.

## Restricciones GLOBALES (toda tarea — no negociables)
- **Copy congelada:** NO editar `lib/i18n/dictionaries.ts`. Check por tarea: `git diff --exit-code lib/i18n/dictionaries.ts` → exit 0.
- **Atribución + disclaimers:** "by TradingView" presente; disclaimers y el literal "brokers socios regulados" intactos. Check: `grep -rn "by TradingView\|brokers socios regulados" components/landing app/page.tsx` no baja de sus ocurrencias actuales.
- **Regulatorio:** display-only, sin "broker" (salvo el literal permitido), nada que simule ejecución/custodia/rentabilidad.
- **A11y:** `prefers-reduced-motion` respetado — toda primitiva de motion usa `useReducedMotion`. Check: `grep -rL "useReducedMotion" components/motion/*.tsx` no lista primitivas con animación.
- **Solo presentación:** no tocar server actions, Supabase, Stripe, `proxy.ts`, auth, cableado symbol/interval del cockpit ni alturas de embeds. Solo `components/landing/*`, `components/motion/*`, `app/globals.css`, `app/page.tsx`.
- **Local, sin deploy:** NUNCA `git push`/deploy/commit salvo pedido explícito. Trabajo queda en el árbol.
- **Verde siempre:** al cerrar cada tarea `pnpm build` → exit 0.
- Screenshots de revisión → `.redesign-review/` (gitignored), contra `pnpm dev` en localhost:3000.

---

### 1. [done] Propagar el idioma glass a TODAS las secciones
**Condición:** ningún componente de la landing conserva el estilo hairline viejo. Todas las grillas de cards usan `.glass-card` (no `gap-px`/`bg-card`+borde), los divisores de sección `border-dashed` se eliminan, los íconos van en badge glossy azul, y las grillas se envuelven en `RevealCascade`. Aplica a: how-it-works, why-us, segments, resources, platform-section, plans, faq, closing-cta, cta, features, trust-strip, stats-strip, site-footer (los que tengan algo que convertir).
**Check (imprimir):** `grep -rn "gap-px\|border-dashed" components/landing app/page.tsx` → 0 líneas (o justificar cada resto); `pnpm build` → exit 0; `git diff --exit-code lib/i18n/dictionaries.ts` → exit 0.
**Bound:** 20 turnos → si no, [blocked] con motivo y seguir.
**Evidencia:** 11 secciones convertidas a glass (how-it-works, why-us, resources, segments, platform-section, faq, closing-cta, trust-strip, stats-strip, site-footer, plans) + value-trio/markets ya hechas. Grillas hairline→glass-cards con badges glossy, divisores dashed eliminados, RevealCascade aplicado. Build exit 0; dictionaries.ts intacto (exit 0); "by TradingView"/disclaimers/anclas preservados. Verificado por capturas full-page desktop+móvil: página coherente en glass. Huérfanos cta.tsx/features.tsx sin tocar (no montados en page.tsx).

### 2. [done] Movimiento parejo en toda la página
**Condición:** cada sección con cards revela con stagger (`RevealCascade`) o `Reveal`; el hero conserva parallax (aurora + panel); la franja `stats-strip` anima las cifras con count-up (nuevo `components/motion/animated-number.tsx`, reduced-motion => valor final directo, sin tocar el texto del diccionario). Smooth-scroll Lenis activo solo en la landing.
**Check (imprimir):** `ls components/motion/animated-number.tsx`; `grep -rn "RevealCascade\|Reveal\|Parallax\|AnimatedNumber" components/landing | wc -l` (> secciones); `pnpm build` → 0; `git diff --exit-code lib/i18n/dictionaries.ts` → 0.
**Bound:** 15 turnos.
**Evidencia:** `components/motion/animated-number.tsx` creado (count-up en viewport; solo enteros simples, resto estático; texto final == value exacto; reduced-motion => directo). Cableado en stats-strip. Fix de bug: `m` (array regex) salía de las deps del effect y reiniciaba la animación en loop (mostraba "1" en vez de "6") → extraído a prefix/suffix strings estables. Cobertura motion en 9 secciones + SectionReveal envuelve todas en page.tsx. Ninguna primitiva sin `useReducedMotion`. Build exit 0; dict intacto (exit 0). Verificado por captura: "6" anima y termina bien, "Tiempo real"/"24/7"/"ES · EN" estáticos.

### 3. [done] Pulido de composición (taste nivel referencia)
**Condición:** ritmo vertical generoso y coherente entre secciones; headings de sección display centrados donde aplique al patrón fintechx; CTAs primarios con `.btn-glossy` + píldora; footer como card dark flotante redondeada; nav píldora sin solapar mal el contenido. Consistencia de radios/sombras/espaciado (un solo sistema). Capturar `/` desktop (1440) y móvil (390) recorriendo toda la página en `.redesign-review/landing-glass-desktop.png` y `-mobile.png`.
**Check (imprimir):** `pnpm build` → 0; `ls .redesign-review/landing-glass-*.png` (2 archivos); `git diff --exit-code lib/i18n/dictionaries.ts` → 0.
**Bound:** 20 turnos.
**Evidencia:** 6 encabezados de sección centrados (`mx-auto max-w-2xl text-center`) — markets, how-it-works, why-us, resources, faq, plans (hero NO se centró: es columna de layout 2-col). Footer → card dark flotante (`bg-[#141824]`, texto claro, Logo blanco). Build exit 0; dict intacto. 2 capturas full-page en `.redesign-review/landing-glass-desktop.png` y `-mobile.png`.

### 4. [done] Auto-crítica adversarial vs. referencia + fixes
**Condición:** revisar las capturas contra los principios del giro (glass, atmósfera, cards flotantes, tipografía display, movimiento fluido) y listar EN LA CONVERSACIÓN los 5 defectos más notorios (contraste, alineación, sombras chillonas, saltos de motion, algo que grite "template"); aplicar el fix de cada uno o justificar por qué se deja. Reejecutar capturas.
**Check (imprimir):** lista de 5 hallazgos + estado (fixed/justificado) impresa; `pnpm build` → 0; capturas regeneradas (`ls -la .redesign-review/landing-glass-*.png`).
**Bound:** 20 turnos.
**Evidencia:** 5 hallazgos: (1) titular hero tapado por nav pill → FIXED (subí pt hero); (2) fondo uniforme vs escenas fintechx → PARCIAL (glow inferior; escénico por sección DEFERIDO a decisión del dueño); (3) panel platform-section "vacío" → JUSTIFICADO (embed LazyMount no monta en scroll rápido de captura, en browser real carga); (4) banda cálida #F1EFE9 en gradiente hero → FIXED (→#EEF3FC frío); (5) barra sólida azul "Opción de prueba" → JUSTIFICADO (acento de conversión intencional). Build exit 0, dict intacto; capturas regeneradas en .redesign-review/.

### 5. [done] Gate final (sin deploy)
**Condición:** todo aplicado; gate local completo verde y guardrails confirmados.
**Check (imprimir):** `pnpm lint` → 0; `pnpm format:check` → 0 (correr `pnpm format` si hace falta); `pnpm test` → 0; `pnpm build` → 0; `git diff --exit-code lib/i18n/dictionaries.ts` → 0; `grep -rn "by TradingView" components/dashboard components/landing` (presente); `git status` (SIN commit/push); `ls .redesign-review/`.
**Bound:** 15 turnos.
**Evidencia:** GATE VERDE — `pnpm format:check` exit 0 · `pnpm lint` exit 0 · `pnpm test` 120/120 exit 0 · `pnpm build` exit 0 · `git diff lib/i18n/dictionaries.ts` exit 0 (intacto). Guardrails: "by TradingView" presente (tradingview-chart.tsx ×2, hero.tsx ×1); literal "brokers socios regulados" ×10 en el dict intacto. `git status`: solo working tree modificado, HEAD en 2eef42c (SIN commit/push). Capturas en `.redesign-review/landing-glass-{desktop,mobile}.png`.

---
Progreso: 5/5 done. Condición global CUMPLIDA — ninguna tarea [pending] ni [in-progress].
