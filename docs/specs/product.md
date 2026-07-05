# Spec de producto — SMC Platform

> Fuente de verdad de producto, marca y decisiones (convención SDD: la spec vive en `docs/specs/`).

## Register

Híbrido con dos superficies claramente separadas:

- **Brand** (`/`, `/precios`): la landing comunica y convierte. El diseño ES el producto.
- **Product** (`/dashboard/*`, `/(auth)`): la plataforma sirve datos de mercado. El diseño SIRVE al producto.

## Qué es

Plataforma de **trading multi-activo** que conecta al usuario con **brokers
socios regulados** (modelo _introducing broker_ / marca blanca): SMC provee la
experiencia — gráficos en tiempo real (TradingView), portafolio, cuentas y
planes de suscripción vía Stripe — mientras que la **ejecución de órdenes y la
custodia de fondos están a cargo de los brokers socios regulados**, no de SMC.

**Guardarraíles de honestidad (verdaderos, no estéticos):**

- Hasta contar con la **autorización escrita** de la licencia del socio, la copy
  **no afirma que SMC esté regulado** ni que ejecute/custodie por sí mismo: esas
  capacidades se atribuyen siempre a los **socios regulados**.
- Prohibición **permanente** (no depende de ninguna licencia): ninguna **promesa
  de rentabilidad** ni retorno garantizado. Eso es fraude.
- No se inventan reguladores, licencias, jurisdicciones ni cifras de usuarios.
  Cuando lleguen los datos reales del socio se nombran; hasta entonces, "socios
  regulados" sin especificar.

## Usuarios

- **Clientes finales de SMC**: personas en América Latina y Europa que pagan
  un plan (Bronce/Plata/VIP o Prueba) para ver mercados en tiempo real.
  Hispanohablantes primero; el producto se lanza en español.
- **Operador del negocio (admin)**: gestiona usuarios y suscripciones.

## Personalidad de marca

Tres palabras: **precisa, audaz, sólida.**

Voz trading-forward: directa, con actitud de plataforma de mercados (no tímida
"solo visualización"). La ambición se permite; la mentira no.

- Como un terminal financiero bien hecho: oscuro, denso en información,
  sin decoración gratuita.
- La confianza se construye con exactitud (números, datos, tiempos), no con
  promesas de marketing.
- Identidad visual heredada del dossier de inversores: fondo casi negro,
  acento dorado, wordmark "SMC." con punto dorado.

## Anti-referencias

- Landing genérica de SaaS con gradientes morados y blobs.
- Estética "crypto bro": neones, lambos, FOMO, countdown timers.
- Cream/beige editorial: esto es un terminal, no una revista.
- Promesas de rentabilidad o de resultado ("multiplicá tu dinero", "señales
  ganadoras", "retornos garantizados"). Prohibición permanente: es fraude.
- Afirmar que **SMC** está regulado / ejecuta / custodia por sí mismo. La
  ejecución y la custodia son de los **socios regulados** (ver "Qué es").

## Referencias de diseño

- **TradingView / terminales de mercado**: densidad de datos, fondo oscuro, números mono.
- **Vercel**: negro puro, tipografía Geist, restraint.
- **Stripe**: claridad en precios y checkout.
- Estrategia de color: "terminal oscuro + dorado del dossier" — fondo
  oklch(0.14 0.005 260), acento dorado oklch(0.78 0.12 85), verde/rojo solo
  para datos de mercado (subidas/bajadas).

## Tipografía

- **Geist Sans** (ya comprometida en el scaffold): UI y texto.
- **Geist Mono**: precios, números, datos de mercado y etiquetas técnicas.
  El mono aquí no es disfraz: es un producto de datos financieros.

## Accesibilidad

- WCAG AA: contraste ≥4.5:1 en texto de cuerpo (crítico en tema oscuro).
- Toda animación respeta `prefers-reduced-motion`.
- Formularios con labels reales, focus visible, navegación por teclado.

## Principios estratégicos

1. Los datos de mercado son el héroe; el chrome de la UI desaparece.
2. Los precios de los planes son exactos e inmutables (vienen del dossier:
   Bronce $1.500 · Plata $2.800 · VIP personalizado · Prueba $250 USD).
3. Cada animación responde a una acción del usuario; nada se mueve solo.
4. Español primero. Cifras en formato USD.

## Contenido y densidad de superficies

> Motivación (feedback 2026-07-02): el producto se percibía "leve". La respuesta NO es prosa
> de relleno sino **contenido funcional**: más datos en el dashboard, más argumento en la
> landing. Toda afirmación pública debe ser verificable; toda copy respeta la sección
> Anti-referencias (nada de promesas de rentabilidad ni claim de "SMC regulado/ejecuta").

### Landing (`/`) — orden de secciones

1. **Hero** (existente) — se conserva.
2. **Franja de números** — 3-4 afirmaciones VERIFICABLES en Geist Mono, sin métricas de
   vanidad inventadas: "4 clases de activos" (acciones, cripto, forex, índices) ·
   "Tiempo real" (datos vía TradingView) · "24/7" (cripto cotiza siempre) ·
   "ES" (producto en español primero). Prohibido: usuarios ficticios, uptime no medido.
3. **Cómo funciona** — 3 pasos: (1) Abrí tu cuenta → (2) Elegí tu plan → (3) Operá los
   mercados a través de brokers socios regulados. Nunca prometer rentabilidad ni "ganá".
4. **Mercados cubiertos** — 4 categorías (Acciones, Cripto, Forex, Índices) con símbolos de
   ejemplo reales (NASDAQ:AAPL, BINANCE:BTCUSDT, FX:EURUSD, SP:SPX). Lista estática o
   mini-widget; si es widget, lazy.
5. **Características** (existente) — se conserva.
6. **Planes** (existente) — se conserva.
7. **FAQ pública** — acordeón accesible, 6-8 preguntas. Canon (respuestas cortas, concepto
   introducing broker): ¿Qué es SMC? (plataforma de trading multi-activo; la ejecución y la
   custodia son de brokers socios regulados) · ¿Los datos son en tiempo real? (sí, vía TradingView) · ¿Qué mercados
   puedo ver? (4 clases) · ¿Cómo pago? (Stripe; tarjeta; ningún dato de tarjeta toca
   servidores de SMC) · ¿Puedo cancelar cuando quiera? (sí, desde Mi plan) · ¿SMC da
   consejos de inversión? (no; solo datos y herramientas de análisis) · ¿En qué idioma está?
   (español primero) · ¿Hay prueba? (plan Prueba $250 USD).
8. **CTA final** — invitación a crear cuenta, antes del footer.

### Dashboard (`/dashboard`) — terminal de mercados

Además del gráfico principal + watchlist (existentes), display-only y gratuitos de TradingView:

- **Ticker tape** (cinta de precios) en el tope del dashboard: índices + cripto + forex.
- **Heatmap de acciones** (mapa de calor S&P 500): pestaña/panel propio.
- **Calendario económico**: pestaña/panel propio.
- **Screener** (explorador de activos): pestaña/panel propio (si el widget gratuito lo permite
  con tema oscuro; si no, se difiere y se anota acá).

Reglas de integración: lazy-load con altura reservada (cero layout shift), tema del widget
sigue al tema de la app, atribución TradingView visible, **degradación limpia** (si el script
de terceros no carga, el panel muestra un vacío amable, jamás rompe la página), CSP con el
ajuste mínimo necesario documentado en `hardening.md`. Los widgets muestran datos; ninguno
permite operar.

### `/precios` — argumentación de compra

1. **Planes** (existente, componente compartido con la landing).
2. **Tabla comparativa** — filas = features reales de la columna `features` de la tabla
   `plans` (DB, seed del dossier); columnas = Prueba/Bronce/Plata/VIP. No se inventan
   features: si la DB no lo dice, no está en la tabla. Overflow-x propio en móvil.
   **Gap conocido del seed (2026-07-04):** las features son acumulativas (`"Todo lo del plan X"`)
   y los niveles de soporte están modelados como **aditivos, no exclusivos** — al resolver la
   herencia, un plan superior puede mostrar el soporte del inferior además del suyo (p. ej. Plata
   marca "Soporte estándar" heredado de Bronce y "Soporte prioritario" propio). La comparativa lo
   refleja tal cual la DB, sin corregir a mano. Si se quiere una fila única de soporte por nivel,
   el arreglo va en el seed de `plans`, no en el componente.
3. **FAQ de facturación** — 4-5 preguntas honestas sobre lo que el sistema hace HOY:
   ¿Cómo pago? (Stripe, tarjeta) · ¿Puedo cancelar? (sí, desde Mi plan; acceso hasta el fin
   del período) · ¿Cómo funciona la Prueba? (pago único de $250 USD, acceso al contenido del
   plan) · ¿Puedo cambiar de plan? (sí, gestionándolo desde Mi plan) · ¿Facturan en mi
   moneda? (precios en USD; el banco emisor convierte). Reembolsos: remite a la página
   `/reembolsos`, sin prometer política distinta a la publicada.

## Landing — arquitectura de conversión (patrón del sector, DENTRO del marco)

> Origen: `~/Documentos/Agencia/orvex/playbook-landing-conversion.md`. Se adopta la **estructura
> de conversión** del patrón del sector (casas de bolsa online), NO su copy ni su tema visual.
> Se conserva la identidad SMC (terminal oscuro + dorado, Geist Mono para números) y un único
> color de acento (dorado) para todos los CTA primarios. Toda afirmación pública es verificable.

Orden de bloques de la landing (`/`), de arriba a abajo:

1. **Header sticky** — fijo al hacer scroll, sombra al despegar del top, con **CTA de acento
   persistente** siempre visible (en móvil: hamburguesa + el CTA nunca desaparece).
2. **Hero** (above the fold, entendible en 5s) — titular de "superación" 4-8 palabras, subtítulo
   simple, **doble CTA** (primario "Comienza ahora" + secundario ghost), **micro-copy de baja
   fricción** ("Sin permanencia · Cancelá cuando quieras"), y un **visual/mockup** del producto.
3. **Franja de cifras** — 3-4 números grandes, SOLO verificables (4 clases de activos · tiempo real
   vía TradingView · 24/7 cripto · español primero). Sin métricas de vanidad ni usuarios inventados.
4. **Trío de valor** — exactamente 3 tarjetas (ícono + título + línea), adaptado al marco
   (p. ej. "Datos en tiempo real · Todo en un panel · Pagos seguros").
5. **Grid de mercados** — reusa `markets-covered` (4 categorías con símbolos de ejemplo reales).
6. **Sección plataforma / tecnología** — dos columnas: screenshot/mockup del dashboard + features
   con checks + CTA contextual "Explorá la plataforma".
7. **"¿Por qué elegirnos?"** — 4 pilares de confianza con señales **REALES**: datos por TradingView ·
   pagos cifrados por Stripe · datos con RLS/seguridad · español primero. **Prohibido** inventar
   sellos de regulador, certificaciones o cotización en bolsa que no existan.
8. **Segmentación dual** — "¿Nuevo en los mercados?" (tono acompañante → plan Prueba / cómo funciona)
   y "¿Ya seguís los mercados?" (tono de producto → dashboard / paneles), cada uno con su CTA.
9. **Recursos** — SOLO enlaces reales (FAQ, /precios, cómo funciona). Nada de academia/webinars
   falsos; si no hay contenido real, se omite el bloque.
10. **Prueba social** — SOLO verificable (badges "Datos por TradingView" / "Pagos por Stripe"). Sin
    premios, reseñas, testimonios ni cifras de usuarios inventados. Si no hay pruebas reales, se omite.
11. **CTA de cierre** — embudo **numerado** "1. Abrí tu cuenta → 2. Elegí tu plan → 3. Operá los
    mercados" + un CTA grande centrado. El depósito/custodia ocurre en el **broker socio**, no en SMC.
12. **Footer denso** — enlaces de producto/empresa/legal/soporte, entidad legal y avisos (según
    datos reales del cliente cuando existan), medios de pago, copyright.

**Voz pública (concepto vigente: introducing broker).** Copy trading-forward y audaz. Se PUEDE
usar "operá los mercados", "abrí tu cuenta", "brokers socios", multi-activo, fiat y cripto. La
**ejecución de órdenes** y la **custodia de fondos** se atribuyen SIEMPRE a los **socios regulados**
(es lo verdadero). **PROHIBIDO** (regla dura, no depende de licencia): afirmar que **SMC** está
regulado / ejecuta / custodia por sí mismo hasta la autorización escrita del socio; inventar
reguladores, licencias o jurisdicciones; y **toda promesa de rentabilidad o retorno**. Persuadir con
claridad, nunca fabricar.

## Terminal display — layout de cockpit 3+1 (SOLO visualización / análisis)

> Origen: `playbook-landing-conversion1.md` (Parte 2). Se adopta el **layout de terminal** del
> sector, pero recortado a **visualización y análisis**. La capa de ejecución/dinero/custodia está
> **ESTACIONADA** (ver `docs/decisiones/2026-07-04-giro-regulatorio.md`) y NO se construye aquí.

Layout del dashboard (`/dashboard`) como cockpit, sobre lo existente (chart + watchlist + paneles):

- **[A] Barra de estado (arriba, siempre visible)** — plan/sesión y accesos (Mi plan, ajustes,
  salir). **NO** muestra Fondos/Equidad/Margen/P&L ni botón Depositar.
- **[B] Panel izquierdo — navegador de mercados** — buscador instantáneo + categorías (Forex ·
  Índices · Materias · Acciones · Cripto) + **watchlists con estrella ★**.
- **[C] Centro — gráfico** — TradingView display-only (idealmente multi-gráfico / layout guardable),
  con atribución visible.
- **[D] Panel derecho — ANÁLISIS / NOTICIAS** — detalle del símbolo, añadir a watchlist, **crear
  alerta de precio**, feed de noticias/calendario. **NUNCA** un ticket Comprar/Vender.
- **[E] Pestañas inferiores — VISTAS** — Watchlist · Alertas · (historial de vistas). **NO**
  Posiciones/Órdenes/Historial de operaciones.

Reglas del shell: CSS Grid responsive, tema oscuro por defecto, Geist Mono en números, degradación
limpia si un widget de terceros no carga, atribución TradingView donde aplique.

**ESTACIONADO — NO se construye hasta cierre legal** (autorización de la licencia por escrito +
compliance): ticket Comprar/Vender, botón Depositar, barra de Fondos/Equidad/Margen/P&L real,
confirmar/ejecutar orden, 1-click dealing, stop-loss/take-profit de posiciones reales, custodia,
señales de trading, bonos/referidos. Tampoco se implementan los **patrones oscuros** que el propio
playbook señala (§9 + nota Parte 2): P&L verde/rojo como gancho de dopamina, riesgo reenmarcado como
"protección", botón de depósito omnipresente con el aviso de riesgo enterrado.

### Catálogo de widgets TradingView (display-only) del dashboard

Todos gratuitos y oficiales de `s3.tradingview.com`, muestran datos y **ninguno permite operar**.
Reglas: **lazy** (solo el panel/pestaña activo monta su script), **CSP sin ampliar**
(s3.tradingview.com ya permitido, sin comodines nuevos), altura reservada (cero layout shift),
degradación limpia, atribución TradingView visible.

- Ya integrados: gráfico avanzado, ticker tape, heatmap de acciones, calendario económico, screener.
- A anexar: heatmap de **cripto** (`crypto-coins-heatmap`), heatmap de **ETF** (`etf-heatmap`),
  **forex** (`forex-heat-map` / `forex-cross-rates`), **market overview** (`market-overview`),
  **noticias / timeline** (`timeline`), **análisis técnico** (`technical-analysis`) y **symbol info /
  overview** (`symbol-info` / `symbol-overview`). El análisis técnico y el symbol info del cockpit se
  atan al **símbolo activo** (al elegir símbolo en el navegador, el panel de análisis lo refleja).

## Ajustes de taste (landing)

> Auditoría con la skill Taste (anti-slop). Se aplican SOLO los tells puros de LLM; los patrones
> estructurales del playbook de conversión (embudo numerado 01/02/03 y trío de valor) **se conservan**
> por ser decisión de negocio, no un tell.

Arreglos a aplicar en la landing:

1. **Purga de em-dash (`—`)** en copy y comentarios → guión normal (`-`) o reescritura (es el tell
   número uno de LLM según Taste).
2. **Un solo label por intención de signup**: hoy hay 4 variantes ("Comienza ahora", "Crear cuenta",
   "Crear mi cuenta", "Empezar con Prueba"); se unifica a **"Crear cuenta"** en toda la landing.
3. **Trust-strip fuera del hero**: la fila de señales de confianza baja del hero a una franja/sección
   propia debajo.
4. **Reemplazo del mockup fake**: el terminal dibujado con `<div>`/SVG en la sección plataforma
   (un "fake terminal" = tell) se reemplaza por un **embed REAL** de TradingView (display-only, lazy).

Se **conservan** (no son tells, son el playbook): el embudo numerado del CTA de cierre y el trío de
valor de 3 tarjetas.
