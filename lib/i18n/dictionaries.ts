import type { Locale } from "@/lib/i18n/config"

/**
 * Diccionarios de copy (spec §i18n.md + brand-smc-markets.md). Toda la copy
 * pública traducible vive acá, no hardcodeada en los componentes.
 *
 * Voz SMC Markets: calma, precisa, deliberada; nunca promocional.
 * Guardarraíl (duro): en ningún idioma se afirma que SMC Markets
 * ejecuta/custodia/está regulado por sí mismo — la ejecución y la custodia son
 * de los BROKERS SOCIOS REGULADOS. Cero promesas de rentabilidad.
 */
export type Dictionary = {
  nav: { howItWorks: string; markets: string; plans: string; faq: string }
  cta: {
    openAccount: string
    getStarted: string
    login: string
    dashboard: string
    viewPlans: string
    explore: string
    talkToUs: string
    menuOpen: string
    menuClose: string
  }
  hero: {
    eyebrow: string
    titleLead: string
    titleAccent: string
    titleTail: string
    subtitle: string
    microcopy: string
  }
  trustStrip: { execution: string; data: string; noHidden: string }
  stats: { heading: string; items: { value: string; label: string }[] }
  valueTrio: { items: { title: string; description: string }[] }
  howItWorks: {
    heading: string
    subtitle: string
    steps: { title: string; description: string }[]
  }
  markets: {
    heading: string
    subtitle: string
    items: Record<
      "indices" | "forex" | "shares" | "commodities" | "etfs" | "crypto",
      { name: string; description: string }
    >
  }
  platform: {
    heading: string
    subtitle: string
    features: string[]
    cta: string
    caption: string
  }
  whyUs: {
    heading: string
    subtitle: string
    pillars: { title: string; description: string }[]
  }
  segments: {
    novice: {
      title: string
      description: string
      primary: string
      secondary: string
    }
    pro: {
      title: string
      description: string
      primary: string
      secondary: string
    }
  }
  resources: {
    heading: string
    subtitle: string
    items: { title: string; description: string }[]
  }
  faq: { heading: string; subtitle: string; items: { q: string; a: string }[] }
  closing: {
    proof: string[]
    heading: string
    subtitle: string
    steps: { title: string; description: string }[]
  }
  plans: {
    heading: string
    subtitle: string
    trial: string
    note: string
    choose: string
    trialCta: string
  }
  pricing: { title: string; subtitle: string }
  footer: {
    disclaimer: string
    links: {
      features: string
      plans: string
      login: string
      terms: string
      privacy: string
      refunds: string
    }
  }
  meta: {
    homeTitle: string
    homeDescription: string
    pricingDescription: string
  }
  admin: {
    title: string
    subtitle: string
    metricUsers: string
    metricActiveSubs: string
    metricRevenue: string
    metricAlerts: string
    proxyNote: string
    planDistribution: string
    usersTitle: string
    subsTitle: string
    paymentsTitle: string
    alertsTitle: string
    colEmail: string
    colName: string
    colRole: string
    colCreated: string
    colUser: string
    colPlan: string
    colStatus: string
    colEnds: string
    colCancels: string
    colType: string
    colEvent: string
    colDate: string
    colSymbol: string
    colActive: string
    registered: string
    empty: string
    unavailable: string
    yes: string
    no: string
    alertsActive: string
  }
}

const es: Dictionary = {
  nav: {
    howItWorks: "Cómo funciona",
    markets: "Mercados",
    plans: "Planes",
    faq: "Preguntas",
  },
  cta: {
    openAccount: "Abrí tu cuenta",
    getStarted: "Comenzá",
    login: "Iniciar sesión",
    dashboard: "Ir al dashboard",
    viewPlans: "Ver los planes",
    explore: "Explorá la plataforma",
    talkToUs: "Hablar con SMC Markets",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
  },
  hero: {
    eyebrow: "Trading multi-activo · LATAM, España y EE. UU.",
    titleLead: "Operá con",
    titleAccent: "ventaja.",
    titleTail: "",
    subtitle:
      "Los mercados premian la preparación, la precisión y el tiempo. SMC Markets te da la tecnología y el control para operar los mercados globales con confianza, a través de brokers socios regulados. De tu primera operación a la número mil.",
    microcopy: "Sin permanencia · Cancelá cuando quieras",
  },
  trustStrip: {
    execution: "Ejecución y custodia por brokers socios regulados",
    data: "Tus datos, cifrados",
    noHidden: "Sin comisiones ocultas",
  },
  stats: {
    heading: "",
    items: [
      { value: "6", label: "clases de activos" },
      { value: "Tiempo real", label: "datos vía TradingView" },
      { value: "24/7", label: "el mercado cripto no cierra" },
      { value: "ES · EN", label: "en tu idioma" },
    ],
  },
  valueTrio: {
    items: [
      {
        title: "Tecnología que se siente",
        description:
          "Gráficos profesionales y datos en vivo. Más rápido, más limpio, más confiable, para que te enfoques en el mercado, no en la plataforma.",
      },
      {
        title: "Una sola pantalla",
        description:
          "Índices, forex, acciones, materias primas, ETF y cripto, con tu watchlist a mano.",
      },
      {
        title: "Ejecución con socios regulados",
        description:
          "Operás a través de brokers socios regulados: ellos ejecutan tus órdenes y resguardan tus fondos.",
      },
    ],
  },
  howItWorks: {
    heading: "Cómo funciona",
    subtitle: "De cero a operar los mercados en tres pasos.",
    steps: [
      {
        title: "Abrí tu cuenta",
        description:
          "Registro con tu correo en menos de un minuto. Confirmás desde tu bandeja y ya estás adentro.",
      },
      {
        title: "Elegí tu plan",
        description:
          "Bronce, Plata o VIP, o empezá con el plan Prueba. Pago seguro por Stripe.",
      },
      {
        title: "Operá los mercados",
        description:
          "Gráficos en tiempo real y tus operaciones a través de brokers socios regulados, todo en un panel.",
      },
    ],
  },
  markets: {
    heading: "Una plataforma. Cada oportunidad.",
    subtitle:
      "Acceso a miles de instrumentos de los mercados financieros del mundo, desde una sola plataforma.",
    items: {
      indices: {
        name: "Índices",
        description: "El pulso agregado de cada mercado.",
      },
      forex: {
        name: "Forex",
        description: "Los pares de divisas más negociados.",
      },
      shares: {
        name: "Acciones globales",
        description: "Las mayores compañías del mundo, en tiempo real.",
      },
      commodities: {
        name: "Materias primas",
        description: "Oro, petróleo y metales, con datos en vivo.",
      },
      etfs: {
        name: "ETF",
        description: "Exposición diversificada en un solo instrumento.",
      },
      crypto: {
        name: "Cripto",
        description: "El mercado que cotiza 24/7, sin cierre.",
      },
    },
  },
  platform: {
    heading: "La precisión es una ventaja competitiva",
    subtitle:
      "Cada función tiene un propósito: ayudarte a tomar mejores decisiones. Analizás, decidís y operás a través de socios regulados, todo desde una pantalla.",
    features: [
      "Gráficos TradingView en tiempo real",
      "Watchlist personalizable con tus símbolos",
      "Heatmap, calendario económico y screener",
      "Alertas de precio inteligentes",
    ],
    cta: "Explorá la plataforma",
    caption: "Datos en vivo por TradingView.",
  },
  whyUs: {
    heading: "Construido para operar mejor",
    subtitle: "Sin promesas vacías: solo lo que la plataforma realmente hace.",
    pillars: [
      {
        title: "Datos en tiempo real",
        description:
          "Cotizaciones y gráficos en vivo provistos por TradingView.",
      },
      {
        title: "Pagos cifrados",
        description:
          "Cobros procesados por Stripe; SMC Markets no almacena tu tarjeta.",
      },
      {
        title: "Tus datos, protegidos",
        description:
          "Acceso por roles y aislamiento por usuario a nivel base de datos (RLS).",
      },
      {
        title: "Bilingüe",
        description:
          "Pensado para LATAM, España y EE. UU., en español e inglés.",
      },
    ],
  },
  segments: {
    novice: {
      title: "¿Nuevo en los mercados?",
      description:
        "Empezá tranquilo. El plan Prueba te da acceso para conocer la plataforma a tu ritmo, y te mostramos cómo funciona en tres pasos.",
      primary: "Empezar con Prueba",
      secondary: "Cómo funciona",
    },
    pro: {
      title: "¿Ya operás los mercados?",
      description:
        "Andá directo al panel: gráficos en tiempo real, heatmap, calendario económico, screener y tu watchlist. Operá a través de brokers socios regulados, todo desde una pantalla.",
      primary: "Ver los planes",
      secondary: "Explorar el panel",
    },
  },
  resources: {
    heading: "Antes de decidir",
    subtitle: "Todo lo que necesitás para conocer la plataforma, en un clic.",
    items: [
      {
        title: "Cómo funciona",
        description: "De cero a operar los mercados en tres pasos.",
      },
      {
        title: "Planes y precios",
        description: "Compará qué incluye cada plan, sin permanencia.",
      },
      {
        title: "Preguntas frecuentes",
        description: "Lo esencial antes de empezar, respondido.",
      },
    ],
  },
  faq: {
    heading: "Preguntas frecuentes",
    subtitle: "Lo esencial antes de empezar.",
    items: [
      {
        q: "¿Qué es SMC Markets?",
        a: "Una plataforma de trading multi-activo: reunís gráficos, portafolio y tus operaciones en un lugar. La ejecución de órdenes y la custodia de fondos están a cargo de brokers socios regulados.",
      },
      {
        q: "¿Los datos son en tiempo real?",
        a: "Sí. Los gráficos y cotizaciones del panel se muestran en tiempo real a través de TradingView.",
      },
      {
        q: "¿Qué mercados puedo ver?",
        a: "Seis clases de activos: índices, forex, acciones globales, materias primas, ETF y cripto.",
      },
      {
        q: "¿Cómo pago?",
        a: "Con tarjeta, mediante Stripe. Ningún dato de tu tarjeta pasa por los servidores de SMC Markets.",
      },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "Sí. Gestionás la cancelación desde Mi plan, y conservás el acceso hasta el fin del período pagado.",
      },
      {
        q: "¿SMC Markets da consejos de inversión?",
        a: "No. SMC Markets entrega datos y herramientas de análisis; las decisiones son siempre tuyas.",
      },
      {
        q: "¿En qué idioma está?",
        a: "En español e inglés, con un toggle en el header.",
      },
      {
        q: "¿Hay una prueba?",
        a: "Sí. El plan Prueba, un pago único de $250 USD, te da acceso para evaluar la plataforma.",
      },
    ],
  },
  closing: {
    proof: [
      "Datos por TradingView",
      "Pagos por Stripe",
      "Datos protegidos con RLS",
    ],
    heading: "Cuando estés listo",
    subtitle: "Sin permanencia. Cancelá cuando quieras.",
    steps: [
      {
        title: "Abrí tu cuenta",
        description: "Creá tu cuenta con tu correo en un minuto.",
      },
      {
        title: "Elegí tu plan",
        description: "Prueba, Bronce, Plata o VIP. Pago seguro por Stripe.",
      },
      {
        title: "Operá los mercados",
        description:
          "Entrá al panel y operá a través de brokers socios regulados.",
      },
    ],
  },
  plans: {
    heading: "Planes de acceso",
    subtitle:
      "Tres niveles de acceso a la plataforma, en USD. Elegí el tuyo y pagá de forma segura con Stripe.",
    trial: "Opción de prueba",
    note: "Pagos procesados de forma segura vía Stripe. Cifras sujetas a las condiciones comerciales vigentes.",
    choose: "Elegir",
    trialCta: "Probar la plataforma",
  },
  pricing: {
    title: "Precios",
    subtitle:
      "Elegí tu nivel de acceso a la plataforma. Operá a través de brokers socios regulados; pagos procesados de forma segura por Stripe.",
  },
  footer: {
    disclaimer:
      "SMC Markets es una plataforma de trading multi-activo. La ejecución de órdenes y la custodia de fondos están a cargo de brokers socios regulados; SMC Markets no ejecuta órdenes ni custodia fondos por sí mismo, y no constituye asesoría de inversión. Los datos de mercado se muestran con fines informativos. Gráficos por TradingView.",
    links: {
      features: "Características",
      plans: "Planes",
      login: "Iniciar sesión",
      terms: "Términos",
      privacy: "Privacidad",
      refunds: "Reembolsos",
    },
  },
  meta: {
    homeTitle: "SMC Markets · Trading Multi-Activo en Tiempo Real",
    homeDescription:
      "Plataforma de trading multi-activo: gráficos en tiempo real, tu portafolio y tus operaciones a través de brokers socios regulados.",
    pricingDescription:
      "Planes de acceso a SMC Markets, plataforma de trading multi-activo. Tabla comparativa y preguntas de facturación. Precios claros, sin permanencia.",
  },
  admin: {
    title: "Panel de administración",
    subtitle: "Observabilidad de la plataforma y sus usuarios · solo lectura.",
    metricUsers: "Usuarios",
    metricActiveSubs: "Suscripciones activas",
    metricRevenue: "Ingresos (proxy)",
    metricAlerts: "Alertas de precio",
    proxyNote:
      "Proxy: suma de precios de planes con suscripción activa. No es contabilidad.",
    planDistribution: "Distribución por plan",
    usersTitle: "Usuarios",
    subsTitle: "Suscripciones",
    paymentsTitle: "Pagos",
    alertsTitle: "Alertas de precio",
    colEmail: "Email",
    colName: "Nombre",
    colRole: "Rol",
    colCreated: "Alta",
    colUser: "Usuario",
    colPlan: "Plan",
    colStatus: "Estado",
    colEnds: "Vence",
    colCancels: "Cancela al fin",
    colType: "Tipo",
    colEvent: "Evento Stripe",
    colDate: "Fecha",
    colSymbol: "Símbolo",
    colActive: "Activa",
    registered: "registrados",
    empty: "Sin datos.",
    unavailable: "No disponible (falta la clave de servicio).",
    yes: "sí",
    no: "no",
    alertsActive: "activas",
  },
}

const en: Dictionary = {
  nav: {
    howItWorks: "How it works",
    markets: "Markets",
    plans: "Plans",
    faq: "FAQ",
  },
  cta: {
    openAccount: "Open your account",
    getStarted: "Get started",
    login: "Log in",
    dashboard: "Go to dashboard",
    viewPlans: "View plans",
    explore: "Explore the platform",
    talkToUs: "Talk to SMC Markets",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
  hero: {
    eyebrow: "Multi-asset trading · LATAM, Spain & the U.S.",
    titleLead: "Trade with",
    titleAccent: "an edge.",
    titleTail: "",
    subtitle:
      "The markets reward preparation, precision, and timing. SMC Markets gives you the technology and control to trade global markets with confidence, through regulated partner brokers. From your first trade to your thousandth.",
    microcopy: "No lock-in · Cancel anytime",
  },
  trustStrip: {
    execution: "Execution and custody by regulated partner brokers",
    data: "Your data, encrypted",
    noHidden: "No hidden fees",
  },
  stats: {
    heading: "",
    items: [
      { value: "6", label: "asset classes" },
      { value: "Real-time", label: "data via TradingView" },
      { value: "24/7", label: "the crypto market never closes" },
      { value: "ES · EN", label: "in your language" },
    ],
  },
  valueTrio: {
    items: [
      {
        title: "Performance you can feel",
        description:
          "Professional charting and live data. Faster, cleaner, more reliable, so you can focus on the market, not your platform.",
      },
      {
        title: "One screen",
        description:
          "Indices, forex, shares, commodities, ETFs and crypto, with your watchlist at hand.",
      },
      {
        title: "Execution with regulated partners",
        description:
          "You trade through regulated partner brokers: they execute your orders and safeguard your funds.",
      },
    ],
  },
  howItWorks: {
    heading: "How it works",
    subtitle: "From zero to trading the markets in three steps.",
    steps: [
      {
        title: "Open your account",
        description:
          "Sign up with your email in under a minute. Confirm from your inbox and you're in.",
      },
      {
        title: "Choose your plan",
        description:
          "Bronze, Silver or VIP, or start with the Trial plan. Secure payment via Stripe.",
      },
      {
        title: "Trade the markets",
        description:
          "Real-time charts and your trades through regulated partner brokers, all in one panel.",
      },
    ],
  },
  markets: {
    heading: "One platform. Every opportunity.",
    subtitle:
      "Access thousands of instruments across the world's financial markets, from a single platform.",
    items: {
      indices: {
        name: "Indices",
        description: "The aggregate pulse of each market.",
      },
      forex: {
        name: "Forex",
        description: "The most traded currency pairs.",
      },
      shares: {
        name: "Global shares",
        description: "The world's largest companies, in real time.",
      },
      commodities: {
        name: "Commodities",
        description: "Gold, oil and metals, with live data.",
      },
      etfs: {
        name: "ETFs",
        description: "Diversified exposure in a single instrument.",
      },
      crypto: {
        name: "Cryptocurrencies",
        description: "The market that trades 24/7, without a close.",
      },
    },
  },
  platform: {
    heading: "Precision is a competitive advantage",
    subtitle:
      "Every feature has one purpose: helping you make better decisions. You analyze, decide and trade through regulated partners, all from one screen.",
    features: [
      "Real-time TradingView charts",
      "Customizable watchlist with your symbols",
      "Heatmap, economic calendar and screener",
      "Intelligent price alerts",
    ],
    cta: "Explore the platform",
    caption: "Live data by TradingView.",
  },
  whyUs: {
    heading: "Built to trade better",
    subtitle: "No empty promises: only what the platform actually does.",
    pillars: [
      {
        title: "Real-time data",
        description: "Live quotes and charts provided by TradingView.",
      },
      {
        title: "Encrypted payments",
        description:
          "Charges processed by Stripe; SMC Markets never stores your card.",
      },
      {
        title: "Your data, protected",
        description:
          "Role-based access and per-user isolation at the database level (RLS).",
      },
      {
        title: "Bilingual",
        description:
          "Built for LATAM, Spain and the U.S., in Spanish and English.",
      },
    ],
  },
  segments: {
    novice: {
      title: "New to the markets?",
      description:
        "Start calmly. The Trial plan gives you access to learn the platform at your own pace, and we show you how it works in three steps.",
      primary: "Start with Trial",
      secondary: "How it works",
    },
    pro: {
      title: "Already trading the markets?",
      description:
        "Go straight to the panel: real-time charts, heatmap, economic calendar, screener and your watchlist. Trade through regulated partner brokers, all from one screen.",
      primary: "View plans",
      secondary: "Explore the panel",
    },
  },
  resources: {
    heading: "Before you decide",
    subtitle:
      "Everything you need to get to know the platform, one click away.",
    items: [
      {
        title: "How it works",
        description: "From zero to trading the markets in three steps.",
      },
      {
        title: "Plans and pricing",
        description: "Compare what each plan includes, no lock-in.",
      },
      {
        title: "FAQ",
        description: "The essentials before you start, answered.",
      },
    ],
  },
  faq: {
    heading: "Frequently asked questions",
    subtitle: "The essentials before you start.",
    items: [
      {
        q: "What is SMC Markets?",
        a: "A multi-asset trading platform: charts, portfolio and your trades in one place. Order execution and custody of funds are handled by regulated partner brokers.",
      },
      {
        q: "Is the data real-time?",
        a: "Yes. The panel's charts and quotes are shown in real time through TradingView.",
      },
      {
        q: "Which markets can I see?",
        a: "Six asset classes: indices, forex, global shares, commodities, ETFs and crypto.",
      },
      {
        q: "How do I pay?",
        a: "By card, via Stripe. No card data passes through SMC Markets' servers.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You manage cancellation from My plan, and keep access until the end of the paid period.",
      },
      {
        q: "Does SMC Markets give investment advice?",
        a: "No. SMC Markets provides data and analysis tools; the decisions are always yours.",
      },
      {
        q: "What language is it in?",
        a: "In Spanish and English, with a toggle in the header.",
      },
      {
        q: "Is there a trial?",
        a: "Yes. The Trial plan, a one-time $250 USD payment, gives you access to evaluate the platform.",
      },
    ],
  },
  closing: {
    proof: [
      "Data by TradingView",
      "Payments by Stripe",
      "Data protected with RLS",
    ],
    heading: "Ready when you are",
    subtitle: "No lock-in. Cancel anytime.",
    steps: [
      {
        title: "Open your account",
        description: "Create your account with your email in a minute.",
      },
      {
        title: "Choose your plan",
        description: "Trial, Bronze, Silver or VIP. Secure payment via Stripe.",
      },
      {
        title: "Trade the markets",
        description:
          "Enter the panel and trade through regulated partner brokers.",
      },
    ],
  },
  plans: {
    heading: "Access plans",
    subtitle:
      "Three levels of access to the platform, in USD. Choose yours and pay securely with Stripe.",
    trial: "Trial option",
    note: "Payments processed securely via Stripe. Figures subject to current commercial terms.",
    choose: "Choose",
    trialCta: "Try the platform",
  },
  pricing: {
    title: "Pricing",
    subtitle:
      "Choose your level of access to the platform. Trade through regulated partner brokers; payments processed securely by Stripe.",
  },
  footer: {
    disclaimer:
      "SMC Markets is a multi-asset trading platform. Order execution and custody of funds are handled by regulated partner brokers; SMC Markets does not execute orders or custody funds itself, and does not constitute investment advice. Market data is shown for informational purposes. Charts by TradingView.",
    links: {
      features: "Features",
      plans: "Plans",
      login: "Log in",
      terms: "Terms",
      privacy: "Privacy",
      refunds: "Refunds",
    },
  },
  meta: {
    homeTitle: "SMC Markets · Real-Time Multi-Asset Trading",
    homeDescription:
      "Multi-asset trading platform: real-time charts, your portfolio and your trades through regulated partner brokers.",
    pricingDescription:
      "Access plans for SMC Markets, a multi-asset trading platform. Comparison table and billing FAQ. Clear pricing, no lock-in.",
  },
  admin: {
    title: "Admin panel",
    subtitle: "Observability of the platform and its users · read-only.",
    metricUsers: "Users",
    metricActiveSubs: "Active subscriptions",
    metricRevenue: "Revenue (proxy)",
    metricAlerts: "Price alerts",
    proxyNote:
      "Proxy: sum of plan prices with an active subscription. Not accounting.",
    planDistribution: "Distribution by plan",
    usersTitle: "Users",
    subsTitle: "Subscriptions",
    paymentsTitle: "Payments",
    alertsTitle: "Price alerts",
    colEmail: "Email",
    colName: "Name",
    colRole: "Role",
    colCreated: "Joined",
    colUser: "User",
    colPlan: "Plan",
    colStatus: "Status",
    colEnds: "Ends",
    colCancels: "Cancels at end",
    colType: "Type",
    colEvent: "Stripe event",
    colDate: "Date",
    colSymbol: "Symbol",
    colActive: "Active",
    registered: "registered",
    empty: "No data.",
    unavailable: "Unavailable (missing service key).",
    yes: "yes",
    no: "no",
    alertsActive: "active",
  },
}

export const dictionaries: Record<Locale, Dictionary> = { es, en }
