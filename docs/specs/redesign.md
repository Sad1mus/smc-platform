# Spec — Re-skin visual de smc-platform

**Estado:** APROBADO (dirección + decisiones), en implementación vía `.claude/goal-queue-reskin.md`.
**Alcance:** re-skin del frontend. **Texto congelado 1:1** (viene del diccionario i18n, no se toca).
**No se toca:** copy, lógica de negocio, Supabase, Stripe/webhooks, auth, `proxy.ts`, rutas/URLs, cableado de estado del terminal, atribución TradingView, alturas fijas de embeds.
**Base:** Next.js 16 · Tailwind v4 · `motion` v12 (hoy sin usar) · next-themes (**light default**, toggle a dark) · shadcn radix-nova · Geist + Geist Mono.

---

## 1. Dirección de diseño: "Terminal editorial"

Fusión de la **calma editorial** (aire, hairlines punteadas, tipografía grande, mono para cifras,
jerarquía por tamaño/espacio) con la **densidad de un terminal** de datos. Identidad **propia de SMC**;
la referencia externa (template Sanjaya) solo donó patrones, no estética.

**Principios (rígidos):**

1. **La hairline es la estructura.** Divisores de 1px (punteados/sólidos) organizan el layout en vez de cajas pesadas y sombras.
2. **Los números son mono, siempre.** Geist Mono + `tabular-nums` (ya existe `.tabular`) para precios, símbolos, %, relojes, métricas.
3. **Un solo acento: el dorado (`--gold`).** El color cromático se reserva para semántica de datos (`--market-up`/`--market-down`).
4. **Jerarquía por tamaño y espacio**, no por peso ni color.
5. **Movimiento rápido y discreto.** Reveal `y:20px`, `~0.42s`, `whileInView once`, respetando `prefers-reduced-motion`.
6. **Light-first, dark par.** Tema por defecto **light** en toda la app (landing pública **y** dashboard/terminal), con toggle manual a dark disponible (next-themes, `enableSystem={false}`). Se mantienen ambos temas; se re-palettea, no se elimina dark. _(Decisión 2026-07-07: el default pasó de dark a light; ver `app/layout.tsx` `defaultTheme="light"`.)_

## 2. Tokens (extender `app/globals.css` @theme, no reemplazar)

- `--hairline` (1px solid var(--border)) y `--hairline-dashed` (1px dashed var(--border)) — firma visual.
- Escala tipográfica tokenizada `--text-display/h1/h2/h3/body/label` (hoy ad-hoc).
- Espaciado semántico `--space-section/block/card/inline` (falta ritmo de sección).
- Motion: `--reveal-y:20px`, `--reveal-dur:0.42s`, `--ease-out-soft:cubic-bezier(0.16,1,0.3,1)`.
- Unificar/documentar la dualidad `primary`=dorado vs `--gold` en dark. No remover tokens existentes.
- Radios: mantener escala; bajar uso general a sm/md (look editorial, menos "burbuja"). Contraste AA en ambos temas.

## 3. Movimiento (introducir `motion`, hoy sin usar)

Una primitiva reusada: `components/motion/reveal.tsx` (RevealGroup/RevealItem, fade+rise 20px, ease-out
0.42s, stagger ~0.08s, `whileInView once`, reduced-motion => sin animación). Se conservan las animaciones
de carácter existentes (ticker marquee, hero-aurora, hero-grid).

## 4. Re-skin por vista (misma copy)

- **4.1 Landing** (`app/page.tsx`, `components/landing/*`): **solo re-skin, orden y anclas intactos.**
  Hairlines de sección, kicker mono, StatsStrip mono con dividers verticales, Reveal on-scroll. Riesgo bajo.
- **4.2 Terminal** (`app/dashboard/*`, núcleo): grid de hairlines, paneles separados por líneas, PanelHeader
  label mono mayúsculas, StatusBar tira mono. **Conservar** grilla `[210px_1fr_280px]`, cableado
  symbol/interval, alturas de embeds, theme-sync, atribución TradingView. Riesgo medio (vestido seguro).
- **4.3 Precios / Mi Plan** (`app/precios`, `app/dashboard/plan`, `components/pricing/*`): cards hairline,
  precio mono grande, VIP con acento dorado. Riesgo bajo. → **vista piloto.**
- **4.4 Alertas:** form hairline, lista como filas con divisor punteado, mono. Riesgo bajo.
- **4.5 Auth + Legales:** contenedor editorial minimal, `<Logo>` real, framing hairline. Riesgo bajo.
- **4.6 Admin:** tablas hairline + `tabular-nums`. Riesgo bajo.

## 5. Componentes (apalancamiento)

- `components/ui/button.tsx` (variantes al nuevo lenguaje, propaga global) · `components/ui/card.tsx`
  (variante `hairline`, default de producto).
- Primitivas nuevas: `DashedDivider`, `StatPill`, `DataLabel`, `Reveal`.
- `panel-header`, `sidebar-nav`, `header-chrome` — re-skin conservando su lógica (scroll/open/active).

## 6. Navegación / responsive (DECISIÓN)

- Header marketing: sticky + hamburguesa (lógica intacta), re-skin visual.
- **Nav inline móvil del dashboard se conserva, solo re-skin** (sin migrar a drawer).

## 7. Restricciones preservadas (innegociable)

Texto idéntico (incl. `"brokers socios regulados"` literal) · disclaimers · "by TradingView" en chart y
panels · alturas fijas + theme-sync de embeds · cableado symbol/interval · contraste AA light+dark ·
`prefers-reduced-motion` · nada display-only que parezca ejecución/trading.

## 8. Decisiones resueltas

1. Landing: solo re-skin, orden y anclas intactos. 2. Dashboard móvil: nav inline, sin drawer.
2. Intensidad: conservador primero + vista piloto (Precios/Mi Plan), luego escalar.

## 9. Implementación

Fases y checks verificables en `.claude/goal-queue-reskin.md`. Verificación local
(`lint/format:check/test/build` + screenshots desktop+móvil por vista). **Nada se pushea sin OK del dueño.**

---

## 10. Giro "glass / futurista fluido" + motion 2026 (capa sobre el editorial — SOLO LANDING)

**Contexto:** la landing quedó demasiado **estática**, sin animaciones.
Se decide un giro visual glass Apple / futurista fluido **encima** del reskin editorial,
**acotado a la landing pública** — el dashboard/terminal **conserva la piel editorial** (no recibe el giro glass;
los embeds TradingView de altura fija y el cableado del cockpit no se tocan). El tema por defecto es light en ambos
(ver principio 6). Copy sigue **congelada** (diccionario i18n).

**Referencia de dirección:** `https://fintechx-wbs.framer.website/` (Framer). Navegada con Playwright
(capturas + extracción). Hallazgos técnicos: usa **Framer Motion** (= `motion` v12, ya instalado) +
**Lenis** (smooth-scroll con inercia); sin GSAP. Fuentes Inter Display / **Bricolage Grotesque** / Geist.
~20 reveals on-scroll (`appear-id`), ~85 elementos con transform (parallax/float).

**Qué se adopta (el sistema de movimiento):**

1. **Smooth-scroll (Lenis)** — inercia suave. Provider **scopeado a la landing**, NO al dashboard. Respeta `prefers-reduced-motion` (fallback a scroll nativo).
2. **Reveal on-scroll con stagger real** — bloques entran fade+rise al viewport (extiende `components/motion/reveal.tsx`).
3. **Parallax** — fondos/aurora y elementos flotantes a distinta velocidad (`useScroll`/`useTransform`).
4. **Entrada del hero escalonada** (ya presente) + panel de vidrio flotante con el gráfico real.
5. **Micro-interacciones** — botón glossy con glow, scale sutil en hover de cards/CTAs.
6. **Números animados** — count-up para las cifras de `stats-strip` (mono + `tabular-nums`).

**Qué NO se copia (guardrails, innegociable):**

- **La piel fotográfica de fintechx** (cielo/colinas/atardecer). Identidad ajena → leería como template.
  Traducción SMC-native = **aurora-gradient azul** (ya en el hero). Acento cromático azul solo en la landing;
  el dorado (`--gold`) sigue siendo el acento de marca del producto.
- **Los claims.** Nada de "AI recommendations", "bank-level security", ni valores de portafolio como si se
  gestionara dinero. Display-only, sin "broker", sin promesa de rentabilidad, disclaimers y "by TradingView" intactos.

**Estado:** implementado en la landing pública — hero glass (aurora + panel del gráfico real con parallax),
Lenis smooth-scroll scopeado, reveal/cascada por sección, count-up en `stats-strip`, nav píldora y footer
flotante. Primitivas en `components/motion/*`. Paleta glass en `.landing-editorial` (`app/globals.css`).
Copy congelada, "by TradingView" y disclaimers intactos, `prefers-reduced-motion` respetado.

## 11. Dashboard — "terminal light con identidad" (decisión 2026-07-08)

**Problema:** con el default light en toda la app (principio 6), el dashboard quedó **fondo blanco plano**
— su identidad de "terminal financiero" estaba pensada para el tema dark (negro + dorado), y en light
las hairlines grises y el dorado casi no contrastaban. Leía como un admin genérico frente a la landing glass.

**Decisión (dueño):** el default **sigue light en toda la plataforma** (no se va a dark). Se le da al terminal
una **piel light propia** que traduce el ADN de la landing (profundidad + acento + fuente display) al registro
**denso del terminal**, sin glass en los datos (legibilidad primero). Cohesión por **marca compartida**
(dorado `--gold`, cifras mono, hairline, logo), no por clonar el efecto glass.

**Qué se implementó (`app/globals.css` + componentes de `components/dashboard/*`):**

- **Aire tintado** (no `#fff` plano): `.terminal-app` en el `<main>` del dashboard — fondo `--dash-bg` con
  auroras dorado/frío muy tenues. Tokens `--dash-bg/--dash-tint-*/--panel-shadow` en `:root` y `.dark`.
- **Superficies flotantes**: clase `.terminal-panel` (blanca sobre el aire, hairline sólida + sombra difusa
  suave, radio md) reemplaza el patrón casi invisible `bg-card/40 + border-dashed` en todos los paneles.
- **Panel-headers con dorado**: barra vertical dorada + label mono mayúsculas más marcado + tinte suave.
- **Fuente display** (Bricolage, clase `.font-display`) en los H1 del dashboard (Mercados/Alertas/Mi plan).
- **Cifras mono con presencia**: reloj de la status-bar a `text-foreground`; nav activo con tinte dorado.

**Innegociable respetado (§7):** copy i18n intacta, "by TradingView" y disclaimers, alturas fijas + theme-sync
de embeds, cableado symbol/interval, AA en light+dark, `prefers-reduced-motion`. El giro glass sigue **solo landing**.
