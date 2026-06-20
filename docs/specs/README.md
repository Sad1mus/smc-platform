# docs/specs — Fuente de verdad (SDD)

Bajo Spec-Driven Development, la **spec es la fuente de verdad** y el código es salida
generada a partir de ella. Antes de tocar una feature, leé su spec acá (referenciala con `@`).

## Índice

- [`product.md`](./product.md) — producto, marca, usuarios, principios estratégicos y
  restricciones regulatorias (solo visualización; nunca "broker"; precios exactos del dossier).

## Cómo crece esto

Cuando una feature merezca su propia spec falsable (auth, paywall, billing, market-view),
se agrega como `docs/specs/<feature>.md` y se enlaza desde acá. Hoy el producto está descrito
de forma transversal en `product.md`; la decomposición por-feature se hace a medida que cada
una evoluciona.
