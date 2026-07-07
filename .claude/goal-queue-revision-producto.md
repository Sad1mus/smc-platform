# Cola de goals — Revisión profunda del producto (smc-platform)

> Fuente de verdad de la cola. El evaluador de `/goal` NO ve este archivo: cada turno
> el asistente debe **reimprimir el estado de la cola** y **correr/pegar los checks** en la conversación.
> Contexto: producto desplegado en Vercel (`smc-platform-smart-money-s-projects.vercel.app`) + Supabase
> (`czpegpattyvspxjigvij`, ACTIVE_HEALTHY). Gates globales: no tocar alturas de embeds TradingView
> (`docs/specs/redesign.md`); **no commitear ni deployar sin OK explícito del usuario**.

current: 2

---

## [done] 1. Bug intermitente de TradingView en el dashboard

**Evidencia (2026-07-07):** causa raíz = doble montaje del embed porque `resolvedTheme` (next-themes)
arranca `undefined` y el efecto montaba igual, recargando el script al resolver. Fix: guarda
`if (!resolvedTheme) return` en `tv-widget.tsx` y `tradingview-chart.tsx` (no toca alturas ni CSP).
Test nuevo `tests/unit/tv-widget-theme-mount.test.tsx` reproduce el churn: **2 fail contra HEAD** →
**4/4 pass** con el fix. `pnpm test` 124/124 exit 0 · `tsc --noEmit` exit 0 · `pnpm build` exit 0.
De paso se corrigió una falla PREEXISTENTE de `taste-fixes` (em-dash en 4 body strings de
`dictionaries.ts`, ya en HEAD) reemplazando `—` por paréntesis (significado idéntico). Sin commit.

**Contexto/hipótesis:** `components/dashboard/tv-widget.tsx` recrea el `<script>` de TradingView en
cada render cuando el padre pasa una `config` con referencia nueva (dep array `[widget, config, resolvedTheme]`);
`components/dashboard/tradingview-chart.tsx` monta dos veces porque `resolvedTheme` arranca `undefined`
y luego resuelve. Verificar `terminal-panels.tsx` / `terminal-cockpit.tsx` (pasan `panel.config`).

**Condición (estado final):** los embeds de TradingView del dashboard **no se recargan** cuando el
componente padre re-renderiza con la misma `config`, y **no montan dos veces** por la resolución del tema.

**Check (dejar VISIBLE en la conversación):**
- Un test Vitest nuevo (p. ej. `components/dashboard/tv-widget.test.tsx`) que reproduce el churn:
  **falla contra el código actual** y **pasa tras el fix**.
- `pnpm test` → exit 0 · `pnpm exec tsc --noEmit` → exit 0 · `pnpm build` → exit 0. Pegar las salidas.

**No tocar:** alturas de embeds ni CSP (`next.config.ts`); rutas/URLs; cableado symbol/interval.
No commitear ni deployar sin OK del usuario.

**Bound:** si no avanza tras **20 turnos** → `[blocked]` con el motivo, y seguir con la tarea 2.

---

## [done] 2. Auditoría amplia del producto (solo observación)

**Evidencia (2026-07-07):** `docs/reviews/audit-2026-07-07.md` creado (visible en `git status` como
`?? docs/reviews/`). Cubre: deploy Vercel prod READY + 6 rutas públicas en 200 (curl impreso);
`get_advisors` security (1 INFO + 2 WARN) y performance (5 INFO + 2 WARN) impresos; y estado del
dashboard (bug TV resuelto en Tarea 1; perfilado logueado diferido con motivo). Sin cambios de código
ni deploy en esta tarea.

**Condición (estado final):** existe `docs/reviews/audit-2026-07-07.md` con hallazgos **priorizados
(alta / media / baja)** cubriendo: (a) salud del deploy en Vercel (prod READY + las 6 rutas públicas
`/ /mercados /como-funciona /plataforma /seguridad /faq` en 200), (b) **advisors de Supabase**
(security + performance) del proyecto activo, (c) performance y errores de consola del dashboard.

**Check (dejar VISIBLE en la conversación):**
- `git status` muestra el archivo nuevo `docs/reviews/audit-2026-07-07.md`.
- Salida de `get_advisors` (security y performance) pegada en el chat.
- `curl` de las 6 rutas de prod con sus códigos (200) pegado en el chat.

**No tocar:** cero cambios de código y **cero deploy** en esta tarea (es auditoría, no fix).
Los hallazgos accionables se listan en el doc; no se implementan acá sin un goal/OK aparte.

**Bound:** si no avanza tras **15 turnos** → `[blocked]` con el motivo.

---

**Global:** la cola está completa cuando NINGUNA tarea queda `[pending]` ni `[in-progress]`
(todas `[done]` o `[blocked]`).
