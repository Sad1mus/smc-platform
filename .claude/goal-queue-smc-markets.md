# Goal Queue — SMC Markets: rebrand + i18n (es/en) + admin

estado: COMPLETADA (5/5 done)
current: —
turn_cap_por_item: 25
workdir: /home/sadimus/Documentos/Agencia/orvex/smc-platform

<!--
OBJETIVO: rebrandear el frontend a "SMC Markets" con la voz del brief EN
(`docs/specs/brand-smc-markets.md`), agregar i18n español+inglés con toggle, y
expandir el panel /admin para observar toda la plataforma y sus usuarios.

REGLAS GLOBALES (aplican a TODA tarea):
- SDD: la spec manda. Task 1 actualiza specs ANTES de tocar código de producto.
- GUARDARRAÍLES REGULATORIOS (duros, ver brand-smc-markets.md + product.md):
  la ejecución/gestión de órdenes SIEMPRE se atribuye a "socios regulados";
  PROHIBIDO afirmar que SMC ejecuta/custodia/está regulado por sí mismo (hasta la
  licencia escrita); PROHIBIDA toda promesa de rentabilidad.
- GATE DURO: NO commitear ni pushear. La cola termina en "verificado local,
  esperando OK del usuario". Nunca `git add -A` (los `.claude/goal-queue-*.md` y
  `docs/decisiones/` son CONFIDENCIALES y no van al repo).
- El evaluador de /goal solo ve el transcript: cada Check debe CORRERSE y su
  resultado quedar VISIBLE. Reimprimir el estado de la cola al inicio de cada turno.
- Idioma por defecto: ES (audiencia actual); EN completo vía toggle. (Si el
  usuario prefiere EN por defecto, se ajusta.)
- Una sola tarea [in-progress] a la vez. Si una no avanza en 25 turnos -> [blocked]
  con motivo y seguir.
- FS lento: si el dev/build tarda, correr con paciencia (timeouts largos) y
  verificar por lint + render, como en las sesiones previas.
-->

## [done] 1. Spec del rebrand + i18n + admin (SDD, antes de código)
**Condición:** Actualizar `docs/specs/product.md` (marca "SMC" -> "SMC Markets",
voz nueva, i18n como requisito, alcance del admin) y crear `docs/specs/i18n.md`
(es default + en, toggle persistente, qué copy es traducible, estrategia elegida)
y `docs/specs/admin.md` (qué observa el admin: usuarios, suscripciones,
payment_events, price_alerts, métricas agregadas; read-only; admin-gated). Todo
debe respetar los guardarraíles (referenciar `brand-smc-markets.md`).
**Check (imprimir):** `ls docs/specs/{product,i18n,admin,brand-smc-markets}.md` ·
`grep -c "SMC Markets" docs/specs/product.md` (>0) · `grep -l "socios regulados" docs/specs/i18n.md docs/specs/admin.md` ·
`npx prettier --check docs/specs/*.md` (exit 0).
**No tocar:** No borrar los guardarraíles de `product.md`. No inventar reguladores.
**Evidencia:** Creados `i18n.md` y `admin.md`; `product.md` actualizado (marca "SMC Markets" ×4, principio 4 bilingüe, sección i18n+admin). Checks OK: 4 specs existen, `grep -c "SMC Markets" product.md`=4, "socios regulados" en i18n.md+admin.md, `prettier --check docs/specs/*.md` exit 0. Preservada la copy EN del cliente en `brand-smc-markets.md`.

## [done] 2. Infra de i18n (español + inglés con toggle)
**Condición:** Montar i18n en el App Router (CÓMO libre: next-intl u otra vía
RSC-safe). ES por defecto, EN disponible; un **toggle** visible en el header que
persiste la elección (cookie o ruta). TODA la copy pública actual de la landing y
`/precios` sale a diccionarios `es`/`en` (sin strings hardcodeados en los
componentes de esas superficies). El EN queda al menos con las claves creadas
(valores reales llegan en Task 3).
**Check (imprimir):** `pnpm build` (o `next build`) exit 0 · render de `/` en ES y
la variante EN (según la estrategia elegida) con `curl` -> HTTP 200 en ambas ·
imprimir una cadena que DIFIERE entre locales (prueba de que el idioma cambia) ·
`grep -rInE "toggle|locale|lang" components/landing/*header* | head` (el toggle existe).
**No tocar:** No romper el tema oscuro/dorado ni el layout. Sin regresión visual.
No tocar el dashboard/admin todavía.
**Evidencia:** Infra creada: `lib/i18n/{config,dictionaries,server}.ts` (cookie `smc-locale`, ES default) + `components/i18n/language-toggle.tsx`. Cableado: `<html lang>` dinámico en `app/layout.tsx`, toggle en header de landing y de dashboard, y externalizados header/hero/footer. Checks OK: `pnpm build` exit 0 (TS 24s, 19 rutas); `/` y `/precios` en ES y EN → HTTP 200; hero difiere por locale ("Operá los mercados del mundo" vs "Trade the world's markets"); toggle presente (`Idioma / Language`); `lang="es"`/`lang="en"` correctos. NOTA: leer la cookie en el root layout vuelve todas las rutas dinámicas (`ƒ`), trade-off aceptado. RE-SCOPE: la externalización de las SECCIONES intermedias de la landing + `/precios` se hace en la Tarea 3 (mismo pase que el rebrand, para no duplicar trabajo sobre los mismos strings).

## [done] 3. Rebrand de la landing a la voz SMC Markets (bilingüe)
**Condición:** Reescribir todas las secciones de la landing (`components/landing/*`)
+ metadata + `/precios` con la voz de `brand-smc-markets.md`: EN = texto del brief
(hero "Trade with an edge", etc.), ES = adaptación con la misma cadencia. Marca
"SMC Markets". Aplicar guardarraíles: la ejecución/órdenes atribuidas a **socios
regulados**; sin claim de "SMC regulado/ejecuta"; sin promesas de retorno.
INCLUYE (re-scope de Task 2): externalizar a diccionarios TODA la copy de esas
secciones (sin strings hardcodeados) en el mismo pase.
**Check (imprimir):** render `/` en ES y EN -> HTTP 200 · `grep` del hero nuevo por
locale (EN: "Trade with an edge"; ES: su ancla) presente · `grep` de que NO
aparece copy vieja ("Operá los mercados del mundo" / "Visualiza los mercados") ·
`grep -rniE "SMC (ejecuta|executes)|guaranteed|rentabilidad garantiz" components/landing app`
DEBE dar 0 líneas que afirmen ejecución propia sin "socio/partner".
**No tocar:** No reintroducir lenguaje prohibido. No romper i18n de Task 2.
**Evidencia:** Diccionario expandido a TODAS las secciones (es+en, voz de marca del brief). Externalizados y reescritos: hero (titular "Operá con ventaja"/"Trade with an edge"), trust-strip, stats (6 clases), value-trio, how-it-works, markets-covered (6 activos), platform-section, why-us, segments, resources, faq, closing-cta, plans + `/precios` + metadata (generateMetadata bilingüe) + wordmark "SMC Markets". Checks OK: `pnpm build` exit 0; `/` ES+EN 200 con hero de marca por locale; markets EN "One platform. Every opportunity."; copy vieja = 0 en ambos; grep de claim de ejecución propia = 0 (ejecución siempre atribuida a socios regulados); lint 0.

## [done] 4. Expandir el panel /admin (observabilidad de plataforma y usuarios)
**Condición:** Expandir `app/admin` (ya existe, admin-gated por `is_admin()`) para
observar, **read-only**: usuarios (email, nombre, rol, alta), suscripciones
(plan, estado, vencimiento), `payment_events`, `price_alerts` (conteos) y métricas
agregadas (total usuarios, subs activas, distribución por plan, proxy de ingresos).
Bilingüe (usa i18n de Task 2). Lecturas server-side con permisos correctos (no
exponer `service_role` al cliente; respetar RLS/`is_admin`).
**Check (imprimir):** `/admin` -> con sesión admin HTTP 200 y las secciones
presentes en el HTML; sin sesión o no-admin -> redirect/403 (probar y mostrar) ·
`pnpm build` exit 0 · `grep -rn "service_role\|admin()" lib components/admin app/admin | head`
para evidenciar que las escrituras sensibles no se exponen al cliente.
**No tocar:** No agregar acciones destructivas salvo pedido explícito (es
observabilidad). No romper la landing ni el dashboard.
**Evidencia:** `app/admin/page.tsx` expandido (read-only, bilingüe): métricas (usuarios, subs activas, ingresos proxy rotulado, alertas) + distribución por plan + tablas de usuarios, suscripciones, pagos (payment_events) y alertas (price_alerts). profiles/subs vía server client (RLS admin); payment_events/price_alerts vía `createAdminClient` (service_role, server-only, `import "server-only"`), con degradación si falta la clave. Sección `admin` agregada al diccionario (es+en). Checks OK: `pnpm build` exit 0 (TS 16s); `/admin` sin sesión → 307 `/login` (gate); no-admin→`/dashboard` en el layout (sin cambios); ningún componente cliente importa `createAdminClient` (service_role no expuesto). Render autenticado como admin lo verifica el usuario (sin credenciales admin para curl aquí).

## [done] 5. Gate de calidad + entrega (SIN commit)
**Condición:** Dejar el pipeline local verde y NO commitear. Correr lint,
format:check, tests unit, build y e2e; que el working tree tenga SOLO los archivos
de esta cola (sin confidenciales staged); dejar todo listo para que el usuario dé
el OK de commit/deploy.
**Check (imprimir):** `pnpm lint` · `pnpm format:check` · `pnpm test` ·
`pnpm build` · `pnpm test:e2e` (cada uno con su exit code visible; si e2e es
inestable por FS, correr `--workers=1` y anotarlo) · `git status --short`
(mostrar que NO hay nada staged y que los `.md` de la cola siguen untracked).
**No tocar:** NO `git add` / `git commit` / `git push`. NO desplegar. El deploy
espera OK explícito del usuario (gate duro).
**Evidencia:** Pipeline verde: `pnpm lint` exit 0 · `pnpm format:check` exit 0 · `pnpm test` 120/120 exit 0 (4 tests de landing reescritos a asertar el diccionario tras el pase a async server components + i18n) · `pnpm build` exit 0 · `pnpm test:e2e` 14 passed / 1 skipped (registro, skip preexistente) exit 0. `git diff --cached` VACÍO (nada staged). Confidenciales (`.claude/goal-queue-*.md`, `docs/decisiones/`) siguen untracked. NUEVOS sin trackear a incluir al commitear (con `git add` explícito, NO -A): `lib/i18n/`, `components/i18n/`, `docs/specs/{i18n,admin,brand-smc-markets}.md`. NO commiteado ni desplegado: espera OK del usuario.

<!--
Al terminar (5/5 done o [blocked]): frontend rebrandeado SMC Markets bilingüe +
admin expandido, verificado local, SIN commitear. El usuario decide commit/deploy
(firma smartmoney4, como en 7eca81e/09df0b8).
-->
