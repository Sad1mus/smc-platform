# Spec — Páginas de contexto de la landing

**Estado:** IMPLEMENTADO (fases 1 y 2), dirección: complementar, no reemplazar.
**Alcance:** anexar rutas propias que den contexto a secciones del home. **No** reemplazan la
landing de una sola página: el home queda intacto y suma un enlace "Conocer más →" por sección.
**Depende de:** `product.md` (guardarraíl regulatorio), `i18n.md` (todo el copy es traducible),
`redesign.md` (estética "Terminal editorial", clase `landing-editorial`).

---

## 1. Decisión

El home es una sola página con anclas (`#como-funciona`, `#mercados`, `#plataforma`, …). Para dar
profundidad a lo que se menciona sin inflar el scroll ni fragmentar la navegación, cada sección de
**producto** gana una página de detalle. Modelo elegido: **complementar** (el home no cambia de forma;
solo se agrega un CTA de profundización). Alternativa descartada: reemplazar las anclas por rutas
(reescribía la navegación y contradecía el reskin vigente).

## 2. Páginas (implementadas)

| Ruta             | Expande                                       | Reutiliza         |
| ---------------- | --------------------------------------------- | ----------------- |
| `/mercados`      | Mercados cubiertos (6 clases de activo)       | `MarketsCovered`  |
| `/como-funciona` | Los 3 pasos + modelo _introducing broker_     | `HowItWorks`      |
| `/plataforma`    | El panel display-only + embed TradingView     | `PlatformSection` |
| `/seguridad`     | Pilares de confianza (TradingView/Stripe/RLS) | `WhyUs`           |
| `/faq`           | FAQ completa + contexto temático              | `Faq`             |

Fase 1 (producto): `/mercados`, `/como-funciona`, `/plataforma`. Fase 2 (confianza + dudas):
`/seguridad`, `/faq`. `/precios` ya cubre Planes. El nav del header y `Resources` apuntan a `/faq`
(la página) en vez de al ancla `/#faq`.

## 3. Arquitectura

- **Copy:** vive en `dictionaries.ts` bajo `pages.{markets,howItWorks,platform,security,faq}` (tipo `PageDetail`),
  en `es` y `en`. Nada hardcodeado en componentes.
- **Estructura por página** (`components/landing/context-page.tsx`, `ContextPage`): hero editorial
  (eyebrow + h1 + subtítulo) → la sección del home reutilizada como resumen visual (`children`) →
  bloques de contexto (`PageDetail.blocks`) → CTA (registro + planes, etiquetas globales `cta.*`).
- **Enlace desde el home** (`components/landing/section-more.tsx`, `SectionMore`): las 3 secciones
  aceptan una prop opcional `moreHref`. El home la pasa; la página de detalle **no** (así la sección
  reutilizada no se autoenlaza). Sin `moreHref` el render es idéntico al anterior.
- **Repunteo de CTAs existentes** hacia las nuevas rutas: `Resources` (item "Cómo funciona") y los
  botones secundarios de `Segments` (`/como-funciona`, `/plataforma`). El header sigue usando anclas
  (scroll en el home).

## 4. Guardarraíl regulatorio (heredado, duro)

Todo el copy nuevo respeta `product.md`: SMC Markets **no ejecuta órdenes, no custodia fondos, no está
regulado por sí mismo** (lo hacen los brokers socios regulados) y **no promete rentabilidad**. Cada
página lo reafirma explícitamente en un bloque (`markets` → "ejecución en socios regulados";
`howItWorks` → "qué significa un introducing broker"; `platform` → "display-only, por diseño").

## 5. Fuera de alcance

- Rutas por-idioma (`[locale]`): se mantiene la estrategia de cookie + diccionarios de `i18n.md`.
- Contenido dinámico o data real en estas páginas: son marketing estático display-only.
