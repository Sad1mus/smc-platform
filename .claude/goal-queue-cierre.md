# Goal Queue — Cierre smc-platform (continuación post-Fase 0)

estado: completada (2/2 done)
current: 2
turn_cap_por_item: 15
repo: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
Continúa la megagoal de Fase 0 (ver goal-queue.md, completada 8 done + 2 blocked).
NO incluye los items blocked de Stripe (T6/T7): dependen de las claves test del usuario.

Estados por tarea: [pending] -> [in-progress] -> [done] | [blocked]
Reglas:
- Solo UNA tarea [in-progress] a la vez. No empezar la siguiente hasta [done]/[blocked].
- "Check" debe CORRERSE y su resultado quedar VISIBLE en la conversación
  (el evaluador de /goal no lee este archivo, solo ve el transcript).
- Todos los comandos se corren dentro de `repo` (arriba).
- Al inicio de cada turno, reimprimir el estado de la cola (X/2 done, tarea actual).
- Commits como Sad1mus, sin Co-Authored-By ni footer. NUNCA `git push`.
-->

## [done] 1. Commitear plan B (fix: no duplicar customers de Stripe)
**Condición:** El cambio ya presente en `lib/stripe/actions.ts` (persistir `stripe_customer_id` al crear el customer con el cliente admin) queda en UN commit `fix:`; el working tree ya no lista `lib/stripe/actions.ts` como modificado.
**Check (imprimir):** `git -C <repo> status --short` sin `lib/stripe/actions.ts` · `git -C <repo> log --oneline -1` muestra el commit `fix:` · `cd <repo> && pnpm vitest run` exits 0.
**No tocar:** Commitear SOLO `lib/stripe/actions.ts`. No `git push`. No cambiar la lógica (ya está hecha y verificada hoy).
**Evidencia:** Commit `9dfedeb fix: persistir stripe_customer_id...` (solo actions.ts, +11/-4). `git status` no lista actions.ts; `pnpm vitest run` 31/31 passed. Sin push.

## [done] 2. Plan C — migrar PRODUCT.md a docs/specs/ (docs:)
**Condición:** El contenido de `PRODUCT.md` vive bajo `docs/specs/` (p. ej. `docs/specs/product.md`), existe un índice `docs/specs/README.md`, las referencias en el `README.md` raíz apuntan a la nueva ruta (sin menciones colgadas a `PRODUCT.md`), y todo queda en UN commit `docs:`. Sin cambios de comportamiento de la app.
**Check (imprimir):** `ls <repo>/docs/specs/` lista los archivos · `grep -rn "PRODUCT.md" <repo>/README.md` no devuelve nada · `cd <repo> && npx tsc --noEmit` limpio · `cd <repo> && pnpm vitest run` exits 0 · `git -C <repo> log --oneline -1` muestra el commit `docs:`.
**No tocar:** Archivos bajo `.claude/skills/**` (mencionan "PRODUCT.md" como concepto del skill, NO son referencias a este doc). Código de la app (ningún cambio de comportamiento). No `git push`. Preservar TODO el contenido sustantivo de PRODUCT.md (mover/reorganizar, no recortar).
**Evidencia:** Commit `41b5180 docs:`. `git mv PRODUCT.md docs/specs/product.md` (historia preservada) + índice `docs/specs/README.md`. README sin refs colgadas (grep vacío). `tsc --noEmit` limpio; `pnpm vitest run` 31/31. Sin push. Skills no tocadas.
