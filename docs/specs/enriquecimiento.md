# Enriquecimiento de la plataforma (web + Android)

> **Estado: Fase 0 APROBADA (2026-07-14) · Fases 1–4 PROPUESTA, no aprobadas.**
> Redactada 2026-07-14. Bajo SDD, esta spec es la fuente de verdad de lo que sigue;
> el código es salida generada a partir de ella.
>
> - **Fase 0** — aprobada por el dueño. Catálogo de mercados y notas por símbolo commiteados;
>   los otros tres ítems siguen pendientes. Costo externo $0.
> - **Fases 1–4** — ninguna se implementa sin visto explícito. **La Fase 1 hoy es INDECIDIBLE:**
>   la elección de feed depende de un anexo de proveedores que **todavía no fue escrito** (ver
>   [Decisiones abiertas](#decisiones-abiertas-requieren-tu-visto)). Aprobarla sin ese anexo sería
>   firmar un cheque en blanco.

## Por qué existe esta spec

Diagnóstico verificado sobre el código en producción (no supuesto):

1. **El catálogo de TradingView está saturado.** El terminal ya monta 8 paneles (mapa de calor de
   acciones, cripto y ETF, calendario económico, explorador de activos, tasas cruzadas, resumen de
   mercados, noticias) más el gráfico avanzado, el `symbol-overview` y el ticker tape. **Agregar más
   iframes no agrega producto**, agrega ruido. Esa fuente de valor está agotada.

2. **SMC no tiene datos propios.** Todo el dato de mercado vive **dentro de iframes de TradingView**,
   que son display-only y no exponen un API de precio al servidor. **El backend de SMC no conoce ni
   una sola cotización.** Este es el techo arquitectónico del producto: sin datos propios, SMC no puede
   construir ninguna función que dependa de precio.

3. **Las alertas de precio son un stub en producción.** `price_alerts` guarda `symbol`, `direction`,
   `threshold`, `active` — y **no tiene ninguna columna de estado de disparo**. El usuario crea la
   alerta, la ve listada, y nunca pasa nada. No es una feature a medias: es una **promesa rota que el
   usuario ya puede tocar**. Consecuencia directa del punto 2.

4. **La app Android es un navegador con ícono.** El shell Capacitor carga la web de producción vía
   `server.url`. Los únicos plugins nativos son `@capacitor/app` y biometría. **No hay push, ni
   notificaciones locales, ni compartir, ni háptica, ni widget de home.** La app no ofrece **ninguna**
   capacidad que el navegador del usuario no tenga: instalarla no le da nada.

De ahí salen los **dos únicos ejes de enriquecimiento real**:

- **Eje A — Datos propios.** Un feed de cotizaciones consultable server-side.
- **Eje B — Capa nativa.** Capacidades que la web no puede dar (push, widget, compartir).

**Los dos ejes convergen en el motor de alertas:** necesita el feed (A) y su notificación natural es el
push (B). Por eso una sola línea de trabajo enriquece la web **y** le da a Android su primera razón de existir.

## No-alcance — lo que NO se construye (y por qué)

Gobernado por `product.md`. **Esto no es una lista de prioridades bajas: es una lista de prohibiciones.**

| No se construye                           | Por qué                                |
| ----------------------------------------- | -------------------------------------- |
| Señales / recomendaciones de compra-venta | Es **asesoría de inversión**           |
| Copy trading / social trading             | Sugiere **ejecución** por parte de SMC |
| Ranking de usuarios por rentabilidad      | **Promesa de rentabilidad** implícita  |
| P&L o cartera con dinero real             | Sugiere **custodia de fondos**         |
| "IA que predice el mercado"               | Asesoría + promesa de rentabilidad     |
| La palabra "broker" en copy pública       | Restricción regulatoria dura           |

**Regla de oro, aplicable a toda feature futura:** ¿puede leerse como consejo de inversión, como promesa
de retorno, o como que SMC ejecuta u custodia? Si la respuesta es "sí" o "quizás", **no se construye**.
La ejecución y la custodia se atribuyen SIEMPRE a los socios regulados.

---

## Fase 0 — Terminal propio (sin infra nueva)

**Costo externo: $0.** Solo Supabase + frontend. Es la vía de menor fricción: no depende del feed, ni de
FCM, ni de que el cliente entregue nada. Se puede empezar hoy.

| Feature                             | Estado                            | Qué es                                                                                   |
| ----------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| **Catálogo de mercados + búsqueda** | ✅ **hecho**                      | Ver nota abajo. `lib/markets/catalog.ts` + navegador.                                    |
| **Notas privadas por símbolo**      | ✅ **hecho** (migración aplicada) | Diario personal del usuario sobre un activo. **Es texto suyo, no recomendación de SMC.** |
| **Múltiples watchlists**            | pendiente                         | Hoy hay una sola lista plana. Pasar a listas nombradas ("Forex", "Cripto", "Mías").      |
| **Comparador multi-símbolo**        | pendiente                         | Ver 2–4 símbolos lado a lado (usa `symbol-overview`, que ya está integrado).             |
| **Layouts guardados**               | pendiente                         | El usuario guarda su configuración del terminal (panel activo, símbolo, tema).           |

> **✅ Notas por símbolo — migración aplicada (2026-07-14).** `20260714120000_symbol_notes.sql` corrió
> sobre el proyecto de prod (`czpegpattyvspxjigvij`). Verificado en la base: RLS activa, 4 políticas
> (select/insert/update/delete, todas `auth.uid() = user_id`), `anon` sin ningún grant, trigger de
> `updated_at` montado. `types/database.ts` **no necesitó regenerarse**: el tipo escrito a mano coincidía
> campo por campo con el que genera Supabase desde el schema real.

> **Corrección de alcance (2026-07-14).** La spec original proponía un "buscador global ⌘K". Al leer el
> código resultó redundante: **el navegador de mercados ya tenía buscador**. El agujero real era otro —
> filtraba sobre **15 símbolos hardcodeados**, solo por el ticker crudo (buscar "oro" o "bitcoin" no
> devolvía nada), y **faltaba entera la clase ETF que la landing promete**. Se construyó eso en su lugar:
> catálogo de **55 símbolos en 6 categorías**, todos **verificados contra la API de TradingView** (un
> símbolo inválido deja los widgets en "no existen datos"), con búsqueda por símbolo **y** por nombre
> legible, insensible a acentos.

**Criterios de aceptación (falsables):**

- Cada tabla nueva (`watchlists`, `user_layouts`, `symbol_notes`) tiene **RLS activa** y el usuario solo
  ve lo suyo. Test: usuario A no puede leer ni escribir filas de usuario B.
- La watchlist existente **migra sin pérdida** a una lista por defecto (ninguna fila queda huérfana).
- Las notas **nunca** se muestran a otro usuario ni se agregan/promedian entre usuarios (eso las
  convertiría en señal social).
- No se toca `proxy.ts`, ni las alturas de los embeds de TradingView, ni la lógica de Stripe.

**Riesgo:** bajo. **Lo que NO resuelve:** el stub de alertas sigue mintiendo, y Android sigue sin razón de existir.

---

## Fase 1 — Feed de precios server-side 🔑

**La llave maestra.** No es una feature visible: es la infraestructura que desbloquea todo lo demás.
Sin esto, las fases 2 y 3 son imposibles.

**Qué es:** una capa `lib/market/quotes.ts` que, desde el servidor, responde _"¿cuánto vale ahora
`OANDA:XAUUSD`?"_. Provider-agnostic (igual que `lib/kyc/` con su proveedor stub), para poder cambiar de
feed sin reescribir a los consumidores.

**Requisitos:**

- Cobertura de **forex, cripto, índices/CFD y acciones** — las clases que el navegador de mercados ya ofrece.
- **No necesita tick-by-tick.** Para alertas, una consulta cada 1–5 minutos alcanza. Esto abarata todo
  drásticamente y descarta los planes caros de real-time.
- **Uso comercial permitido** y sin restricción de display a usuarios finales (SMC es una plataforma paga).
- Mapeo de símbolos: los símbolos de SMC son `EXCHANGE:TICKER` (formato TradingView). **Hay que traducirlos
  al formato del feed** — es trabajo real, no un detalle.

**⚠️ Comparación de proveedores: EL ANEXO NO EXISTE.** La redacción original prometía un
"Anexo: proveedores de datos de mercado" que nunca se escribió (la sesión se cortó antes). **Sin él,
esta fase no se puede decidir**, porque la pregunta que la gobierna — qué feed, a qué costo, con qué
cobertura — no tiene respuesta en este documento. Escribir el anexo es el **prerrequisito** de aprobar
la Fase 1: comparación real de proveedores con precio, cobertura (forex / cripto / índices-CFD /
acciones), límite de consultas y licencia de uso comercial.

**Qué desbloquea de inmediato (más allá de las alertas):**

- **Watchlist viva** — hoy es una lista de texto muerta. Con feed muestra precio, variación % y color.
- **Sparklines** en la watchlist y el navegador de mercados.
- **Resumen diario por email** ("así cerraron tus símbolos") — retención pura, y reusa la capa de email.

**Criterios de aceptación:**

- `lib/market/quotes.ts` expone una interfaz estable (`getQuote(symbol)` / `getQuotes(symbols[])`) con un
  **proveedor stub** para tests, igual que el patrón de KYC.
- **Degradación limpia** (invariante del proyecto): sin `MARKET_DATA_API_KEY`, la capa devuelve `null` y la
  UI oculta los precios — **no rompe el build ni el dev**.
- Caché server-side de al menos 60 s por símbolo, para no quemar la cuota del feed.
- Test de mapeo: `OANDA:XAUUSD`, `NASDAQ:NDX`, `BINANCE:BTCUSDT` resuelven al formato del proveedor.

---

## Fase 2 — Motor de alertas (mata el stub)

**Depende de la Fase 1.** Convierte la promesa rota en una función real.

**1. Migración de schema.** `price_alerts` hoy **no puede ni registrar que una alerta se disparó**. Faltan:

```sql
alter table public.price_alerts
  add column status text not null default 'active'
    check (status in ('active', 'triggered', 'error')),
  add column triggered_at timestamptz,
  add column triggered_price numeric,
  add column last_checked_at timestamptz;
```

**2. Worker.** Una API route (`app/api/alerts/tick/route.ts`) que: lee las alertas `status = 'active'`,
agrupa los símbolos únicos, pide sus precios al feed **en batch** (no una llamada por alerta), compara
contra `direction` + `threshold`, y marca las disparadas.

**3. Scheduler.** **Vercel Cron** (`vercel.json`), cada 1–5 min. Se prefiere sobre `pg_cron` + edge function
porque el proyecto **no tiene `supabase/functions/`** y no conviene abrir una segunda plataforma de cómputo.

**Criterios de aceptación:**

- **Idempotencia:** una alerta disparada **nunca se re-dispara**. Test de regresión explícito.
- La ruta del cron está **protegida** (`CRON_SECRET`): no puede invocarla cualquiera desde internet.
- **Consulta en batch:** N alertas sobre el mismo símbolo = **1** llamada al feed, no N.
- Si el feed falla, la alerta pasa a `error` y se reintenta; **no se pierde ni se dispara en falso**.
- El tope por plan (`lib/alerts/limits.ts`: prueba 3, bronce 5, plata/vip ∞) se sigue respetando.

**⚠️ Dependencia de infra que hoy es un bloqueante silencioso:** **Supabase está en plan free y se
auto-pausa a los ~7 días de inactividad, sin backups.** Un cron corriendo cada minuto contra una base que
se pausa sola es una bomba de tiempo. **Esta fase obliga a pasar a Supabase Pro.**

---

## Fase 3 — Notificación: email + push FCM

**Depende de la Fase 2** (sin motor, no hay qué notificar).

**Email (Resend).** La capa `lib/email/send.ts` **ya existe** y hoy corre en modo stub (solo loguea sin
`RESEND_API_KEY`). Es el camino más corto: agregar la plantilla de "alerta disparada" y llamarla desde el worker.

**Push (FCM).** Es **la primera capacidad nativa real de la app Android** y la que justifica su existencia:

- Plugin `@capacitor/push-notifications` + proyecto Firebase + `google-services.json`.
- Tabla `device_tokens` (user_id, token, platform) con RLS, para saber a qué dispositivo notificar.
- El worker de la Fase 2 pasa a notificar por **ambos** canales.

**Criterios de aceptación:**

- Una alerta disparada notifica **exactamente una vez** por canal (no duplica entre email y push).
- Sin `RESEND_API_KEY` → sigue en stub y **no rompe** el worker (invariante de degradación).
- Sin configuración de FCM → el push se omite silenciosamente; el email sigue saliendo.
- Tocar la notificación **abre el símbolo** en el terminal (ya existe el deep link `smc://`).
- **La copy de la notificación no puede sugerir acción.** "XAUUSD superó 2.400" ✅ · "Momento de comprar
  XAUUSD" ⛔ — sería asesoría.

**⚠️ Requiere un build nativo nuevo y publicación en Play Store.** Es la primera vez desde v1.0.0 que hay
un cambio nativo real que amerita subir un binario. (Hoy el repo dice `versionCode 2 / 1.1.0` pero el
binario publicado es `1.0.0`; ese bump quedó huérfano — ver nota al final.)

---

## Fase 4 — Capa nativa Android (identidad de app)

**Depende de la Fase 3** (el push es la puerta de entrada a lo nativo).

| Feature                   | Plugin / trabajo                         | Valor                                                                            |
| ------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| **Widget de home screen** | Nativo Android (no hay plugin Capacitor) | La watchlist en la pantalla del teléfono. **El mayor diferenciador vs. la web.** |
| **Compartir gráfico**     | `@capacitor/share`                       | Difusión orgánica gratis                                                         |
| **Háptica**               | `@capacitor/haptics`                     | Sensación de app nativa, no de web                                               |
| **Offline real**          | Hoy solo hay `error.html`                | Mostrar el último snapshot en vez de una pantalla de error                       |
| **App shortcuts**         | Manifest Android                         | Ir directo a un símbolo desde el ícono                                           |

**El widget de home screen es el único ítem con trabajo nativo Android de verdad** (Kotlin/Jetpack Glance);
el resto son plugins. Evaluarlo aparte por costo.

---

## Costos reales (a validar antes de aprobar)

| Ítem                | Costo                           | Cuándo se vuelve obligatorio       |
| ------------------- | ------------------------------- | ---------------------------------- |
| **Supabase Pro**    | **$25/mes**                     | **Fase 2** (el free se auto-pausa) |
| **Feed de precios** | ver anexo                       | **Fase 1**                         |
| **Firebase FCM**    | **$0** (gratis, sin tope real)  | Fase 3                             |
| **Resend**          | tier gratuito alcanza al inicio | Fase 3                             |
| **Play Console**    | $25 (pago único)                | ya pagado si la app está publicada |

---

## Orden recomendado y por qué

**Fase 0 → 1 → 2 → 3 → 4.**

La Fase 0 se puede empezar **ya** y en paralelo: no depende de nada ni de nadie. Da resultado visible en
días y no arrastra costos.

Pero **la Fase 1 es la que hay que decidir**, porque es la única que rompe el techo. Todo lo demás que
valga la pena — alertas reales, watchlist viva, push, widget — **cuelga de ella**. Mientras SMC no tenga
un precio en su propio servidor, seguirá siendo un visor de iframes muy bien diseñado, y nada más.

---

## Decisiones abiertas (requieren tu visto)

1. **¿Qué feed?** — **BLOQUEADA: el anexo de proveedores no fue escrito.** Es la decisión de mayor
   impacto y hoy no hay con qué tomarla. Prerrequisito de la Fase 1.
2. **¿Supabase Pro ahora o al llegar a Fase 2?** — Recomendado: **ahora**. El free sin backups ya es un
   riesgo con registros de pago en la base, independientemente de este plan.
3. **¿El widget de home screen entra?** — Es el único ítem con trabajo nativo Android real. Puede diferirse.
4. **¿Se publica una versión nueva en Play Store en la Fase 3?** — Sí, es inevitable: el push exige binario nuevo.

## Nota de higiene — ✅ RESUELTA (2026-07-14)

El repo declaraba `versionCode 2 / versionName 1.1.0` mientras **el binario publicado era `1.0.0`**: el
bump había entrado por accidente dentro del commit de landing `6095ad8`, que **no tocó nada nativo**.
Revertido a `versionCode 1 / versionName "1.0.0"` — el repo vuelve a decir la verdad sobre lo publicado.
**El próximo bump lo hace el commit que cambie algo nativo de verdad**, que será la Fase 3 (push FCM),
el primer cambio que obliga a subir un binario nuevo desde la v1.0.0.

## Riesgo de infra detectado (2026-07-14, fuera del alcance original)

`mobile/capacitor.config.ts` apunta `server.url` a **`smc-platform-smart-money-s-projects.vercel.app`**,
la URL autogenerada de Vercel, no un dominio propio. Como el shell carga la web viva desde ahí, **si esa
URL deja de resolver (p. ej. el cliente migra a un dominio custom), todas las apps instaladas dejan de
funcionar a la vez** — y arreglarlo exige republicar en Play Store. Si hay dominio propio planeado,
apuntar `server.url` ahí **antes** del próximo binario, no después.
