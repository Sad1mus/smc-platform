# Spec de producto — SMC Platform

> Fuente de verdad de producto, marca y decisiones (convención SDD: la spec vive en `docs/specs/`).

## Register

Híbrido con dos superficies claramente separadas:

- **Brand** (`/`, `/precios`): la landing comunica y convierte. El diseño ES el producto.
- **Product** (`/dashboard/*`, `/(auth)`): la plataforma sirve datos de mercado. El diseño SIRVE al producto.

## Qué es

Plataforma web de **visualización de mercados financieros** en tiempo real:
gráficos interactivos (TradingView), cuentas de usuario y planes de
suscripción pagados vía Stripe. Solo visualización: **no ejecuta órdenes,
no custodia fondos, no es asesoría de inversión**. La palabra "broker" está
prohibida en toda la comunicación (restricción regulatoria del dossier).

## Usuarios

- **Clientes finales de SMC**: personas en América Latina y Europa que pagan
  un plan (Bronce/Plata/VIP o Prueba) para ver mercados en tiempo real.
  Hispanohablantes primero; el producto se lanza en español.
- **Operador del negocio (admin)**: gestiona usuarios y suscripciones.

## Personalidad de marca

Tres palabras: **precisa, sobria, sólida.**

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
- Lenguaje de bróker o de promesas de rentabilidad ("multiplica tu dinero",
  "señales ganadoras"). Regulatorio: solo visualización de datos.

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
> Anti-referencias (la palabra prohibida del dossier y las promesas de rentabilidad).

### Landing (`/`) — orden de secciones

1. **Hero** (existente) — se conserva.
2. **Franja de números** — 3-4 afirmaciones VERIFICABLES en Geist Mono, sin métricas de
   vanidad inventadas: "4 clases de activos" (acciones, cripto, forex, índices) ·
   "Tiempo real" (datos vía TradingView) · "24/7" (cripto cotiza siempre) ·
   "ES" (producto en español primero). Prohibido: usuarios ficticios, uptime no medido.
3. **Cómo funciona** — 3 pasos: (1) Creá tu cuenta → (2) Elegí tu plan → (3) Analizá los
   mercados en tiempo real. Verbos de visualización/análisis; jamás "operá/invertí/ganá".
4. **Mercados cubiertos** — 4 categorías (Acciones, Cripto, Forex, Índices) con símbolos de
   ejemplo reales (NASDAQ:AAPL, BINANCE:BTCUSDT, FX:EURUSD, SP:SPX). Lista estática o
   mini-widget; si es widget, lazy.
5. **Características** (existente) — se conserva.
6. **Planes** (existente) — se conserva.
7. **FAQ pública** — acordeón accesible, 6-8 preguntas. Canon (respuestas cortas, alineadas
   al marco regulatorio): ¿Qué es SMC? (visualización y análisis; no ejecuta órdenes ni
   custodia fondos) · ¿Los datos son en tiempo real? (sí, vía TradingView) · ¿Qué mercados
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
3. **FAQ de facturación** — 4-5 preguntas honestas sobre lo que el sistema hace HOY:
   ¿Cómo pago? (Stripe, tarjeta) · ¿Puedo cancelar? (sí, desde Mi plan; acceso hasta el fin
   del período) · ¿Cómo funciona la Prueba? (pago único de $250 USD, acceso al contenido del
   plan) · ¿Puedo cambiar de plan? (sí, gestionándolo desde Mi plan) · ¿Facturan en mi
   moneda? (precios en USD; el banco emisor convierte). Reembolsos: remite a la página
   `/reembolsos`, sin prometer política distinta a la publicada.
