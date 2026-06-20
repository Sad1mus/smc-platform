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
