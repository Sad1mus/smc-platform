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
/**
 * Página de detalle que da contexto a una sección del home (docs/specs/landing-pages.md).
 * Reutiliza la sección de la landing como resumen visual y agrega `blocks` de contexto.
 * Guardarraíl regulatorio idéntico al del resto del copy: SMC no ejecuta ni custodia.
 */
export type PageDetail = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  heading: string
  subtitle: string
  blocks: { heading: string; body: string }[]
  ctaHeading: string
  ctaBody: string
}

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
    learnMore: string
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
  pages: {
    markets: PageDetail
    howItWorks: PageDetail
    platform: PageDetail
    security: PageDetail
    faq: PageDetail
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
    learnMore: "Conocer más",
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
  pages: {
    markets: {
      metaTitle: "Mercados · SMC Markets",
      metaDescription:
        "Las seis clases de activos que seguís en SMC Markets: índices, forex, acciones, materias primas, ETF y cripto. Datos en tiempo real vía TradingView.",
      eyebrow: "Mercados",
      heading: "Seis mercados, una sola pantalla",
      subtitle:
        "Índices, forex, acciones globales, materias primas, ETF y cripto. Seguís todos desde el mismo panel, con datos en tiempo real.",
      blocks: [
        {
          heading: "Datos en tiempo real, no capturas",
          body: "Cada cotización y gráfico que ves llega en vivo a través de TradingView. Cambiás de temporalidad, comparás instrumentos y leés el mercado con las mismas herramientas que usan los analistas profesionales.",
        },
        {
          heading: "Una watchlist para todo",
          body: "No importa si seguís el S&P 500, el EUR/USD o Bitcoin: armás una sola watchlist con tus símbolos y la tenés a mano en cada visita. El navegador de mercados te deja saltar de una clase de activo a otra sin perder el hilo.",
        },
        {
          heading: "Cripto que no cierra",
          body: "Los mercados tradicionales tienen horario; el de cripto cotiza 24/7. En SMC Markets ves ambos con el mismo nivel de detalle, sin cambiar de plataforma.",
        },
        {
          heading: "La ejecución, en manos de socios regulados",
          body: "SMC Markets es la capa de análisis y visualización. Cuando decidís operar, tus órdenes se ejecutan y tus fondos se custodian a través de brokers socios regulados, no de SMC.",
        },
      ],
      ctaHeading: "Explorá los mercados por dentro",
      ctaBody:
        "Abrí tu cuenta y accedé al panel con las seis clases de activos en tiempo real.",
    },
    howItWorks: {
      metaTitle: "Cómo funciona · SMC Markets",
      metaDescription:
        "De cero a operar los mercados en tres pasos: abrí tu cuenta, elegí tu plan y operá con datos en tiempo real a través de brokers socios regulados.",
      eyebrow: "Cómo funciona",
      heading: "De cero a operar, en tres pasos",
      subtitle:
        "Registro rápido, un plan a tu medida y acceso al panel. Así se ve el camino completo, sin letra chica.",
      blocks: [
        {
          heading: "Qué significa operar con un introducing broker",
          body: "SMC Markets te da la plataforma —gráficos, análisis y tu panel—; la ejecución de las órdenes y la custodia de los fondos las hacen brokers socios regulados. Vos analizás y decidís en SMC; operás y depositás con el socio.",
        },
        {
          heading: "El registro, sin fricción",
          body: "Creás tu cuenta con tu correo en menos de un minuto y confirmás desde tu bandeja de entrada. No pedimos más de lo necesario para empezar.",
        },
        {
          heading: "Elegí el plan que te sirve",
          body: "Bronce, Plata o VIP, o arrancá con el plan Prueba, un pago único para conocer la plataforma. Todos los cobros pasan por Stripe y no hay permanencia: cancelás cuando quieras.",
        },
        {
          heading: "Del análisis a la operación",
          body: "Con el plan activo entrás al panel: watchlist, heatmap, calendario económico, screener y alertas de precio. Cuando querés ejecutar, lo hacés a través del broker socio regulado.",
        },
      ],
      ctaHeading: "Empezá el primer paso",
      ctaBody: "Creá tu cuenta y recorré la plataforma a tu ritmo.",
    },
    platform: {
      metaTitle: "La plataforma · SMC Markets",
      metaDescription:
        "El panel de SMC Markets: gráficos TradingView en tiempo real, watchlist, heatmap, calendario económico, screener y alertas de precio. Display-only.",
      eyebrow: "La plataforma",
      heading: "Un panel pensado para decidir",
      subtitle:
        "Todo lo que necesitás para leer el mercado, en una pantalla. Analizás acá; operás a través de socios regulados.",
      blocks: [
        {
          heading: "Gráficos y datos por TradingView",
          body: "El corazón del panel son los gráficos en tiempo real de TradingView: la misma calidad de datos y herramientas de análisis técnico que esperás de una terminal profesional, integrada en SMC Markets.",
        },
        {
          heading: "Tu watchlist y el navegador de mercados",
          body: "Armás tu lista de seguimiento con los símbolos que te importan y navegás las seis clases de activos sin salir del panel. El cockpit mantiene todo a la vista.",
        },
        {
          heading: "Heatmap, calendario y screener",
          body: "Un mapa de calor para ver de un vistazo qué se mueve, un calendario económico con los eventos que agitan al mercado y un screener para filtrar instrumentos por lo que buscás.",
        },
        {
          heading: "Alertas de precio",
          body: "Definís un nivel y SMC te avisa cuando el precio lo toca, así no tenés que mirar la pantalla todo el día. El análisis es tuyo; la plataforma solo te mantiene informado.",
        },
        {
          heading: "Display-only, por diseño",
          body: "El panel es de análisis y visualización: no ejecuta órdenes ni custodia fondos. Cuando decidís operar, lo hacés a través de brokers socios regulados.",
        },
      ],
      ctaHeading: "Entrá al panel",
      ctaBody:
        "Abrí tu cuenta y explorá la plataforma con datos en tiempo real.",
    },
    security: {
      metaTitle: "Seguridad y confianza · SMC Markets",
      metaDescription:
        "Cómo SMC Markets protege tus datos y tus pagos: cifrado por Stripe, aislamiento por usuario a nivel base de datos (RLS) y datos de mercado en tiempo real por TradingView.",
      eyebrow: "Seguridad",
      heading: "Confianza construida sobre hechos",
      subtitle:
        "Sin sellos inventados ni promesas vacías. Solo lo que la plataforma realmente hace para proteger tus datos y tus pagos.",
      blocks: [
        {
          heading: "Datos de mercado en tiempo real",
          body: "Las cotizaciones y gráficos del panel provienen en vivo de TradingView, el estándar de la industria en visualización de mercados. Es lo que ves y de dónde viene: sin datos inflados ni métricas sin medir.",
        },
        {
          heading: "Pagos cifrados por Stripe",
          body: "Los cobros los procesa Stripe, líder global en pagos. Ningún dato de tu tarjeta pasa por los servidores de SMC Markets ni se almacena de nuestro lado.",
        },
        {
          heading: "Tus datos, aislados por usuario",
          body: "La base de datos aplica Row-Level Security (RLS): cada cuenta solo puede leer y escribir lo suyo, con control de acceso por roles. El aislamiento es a nivel del motor de base de datos, no una verificación opcional en la aplicación.",
        },
        {
          heading: "La ejecución y la custodia, en socios regulados",
          body: "SMC Markets no ejecuta órdenes ni custodia fondos: eso lo hacen brokers socios regulados. Nosotros somos la capa de análisis y visualización; el dinero nunca está en manos de SMC.",
        },
        {
          heading: "Sin promesas de rentabilidad",
          body: "SMC Markets entrega datos y herramientas de análisis; las decisiones son siempre tuyas. No prometemos retornos ni ofrecemos señales garantizadas.",
        },
      ],
      ctaHeading: "Operá con una base sólida",
      ctaBody:
        "Abrí tu cuenta y conocé la plataforma con datos en tiempo real.",
    },
    faq: {
      metaTitle: "Preguntas frecuentes · SMC Markets",
      metaDescription:
        "Todo lo que necesitás saber antes de empezar en SMC Markets: qué es, cómo funcionan los datos y los pagos, y el modelo de brokers socios regulados.",
      eyebrow: "Preguntas frecuentes",
      heading: "Todo lo que querés saber, respondido",
      subtitle:
        "Las dudas más comunes antes de empezar. Si te queda algo, el resto de la plataforma te lo aclara en contexto.",
      blocks: [
        {
          heading: "El modelo introducing broker, en una línea",
          body: "SMC Markets es la plataforma de análisis y visualización; la ejecución de órdenes y la custodia de fondos las hacen brokers socios regulados. Vos analizás y decidís acá; operás y depositás con el socio.",
        },
        {
          heading: "Datos y análisis, nunca asesoría",
          body: "Todo lo que ves —gráficos, cotizaciones, alertas— es información en tiempo real por TradingView para que decidas mejor. SMC no da consejos de inversión ni promete resultados: las decisiones son tuyas.",
        },
        {
          heading: "Pagos y cancelación sin sorpresas",
          body: "Los cobros los procesa Stripe; ningún dato de tu tarjeta toca nuestros servidores. No hay permanencia: cancelás cuando quieras desde Mi plan y conservás el acceso hasta el fin del período pagado.",
        },
        {
          heading: "Probar antes de comprometerte",
          body: "El plan Prueba es un pago único de $250 USD que te da acceso para evaluar la plataforma a tu ritmo, antes de elegir un plan recurrente.",
        },
      ],
      ctaHeading: "¿Listo para empezar?",
      ctaBody:
        "Abrí tu cuenta y explorá la plataforma con datos en tiempo real.",
    },
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
    learnMore: "Learn more",
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
  pages: {
    markets: {
      metaTitle: "Markets · SMC Markets",
      metaDescription:
        "The six asset classes you follow on SMC Markets: indices, forex, shares, commodities, ETFs and crypto. Real-time data via TradingView.",
      eyebrow: "Markets",
      heading: "Six markets, one screen",
      subtitle:
        "Indices, forex, global shares, commodities, ETFs and crypto. Follow them all from the same panel, with real-time data.",
      blocks: [
        {
          heading: "Real-time data, not screenshots",
          body: "Every quote and chart you see arrives live through TradingView. Switch timeframes, compare instruments and read the market with the same tools professional analysts use.",
        },
        {
          heading: "One watchlist for everything",
          body: "Whether you follow the S&P 500, EUR/USD or Bitcoin, you build a single watchlist with your symbols and keep it at hand on every visit. The market browser lets you jump between asset classes without losing your place.",
        },
        {
          heading: "Crypto that never closes",
          body: "Traditional markets keep hours; crypto trades 24/7. On SMC Markets you see both with the same level of detail, without switching platforms.",
        },
        {
          heading: "Execution in the hands of regulated partners",
          body: "SMC Markets is the analysis and visualization layer. When you decide to trade, your orders are executed and your funds are held through regulated partner brokers, not by SMC.",
        },
      ],
      ctaHeading: "Explore the markets from the inside",
      ctaBody:
        "Open your account and access the panel with all six asset classes in real time.",
    },
    howItWorks: {
      metaTitle: "How it works · SMC Markets",
      metaDescription:
        "From zero to trading the markets in three steps: open your account, choose your plan and trade with real-time data through regulated partner brokers.",
      eyebrow: "How it works",
      heading: "From zero to trading, in three steps",
      subtitle:
        "Quick sign-up, a plan that fits and access to the panel. Here's the full path, no fine print.",
      blocks: [
        {
          heading: "What trading with an introducing broker means",
          body: "SMC Markets gives you the platform —charts, analysis and your panel—; order execution and custody of funds are handled by regulated partner brokers. You analyze and decide on SMC; you trade and deposit with the partner.",
        },
        {
          heading: "Sign-up without friction",
          body: "Create your account with your email in under a minute and confirm from your inbox. We ask for no more than you need to get started.",
        },
        {
          heading: "Choose the plan that fits",
          body: "Bronze, Silver or VIP, or start with the Trial plan, a one-time payment to get to know the platform. All charges go through Stripe and there's no lock-in: cancel whenever you want.",
        },
        {
          heading: "From analysis to execution",
          body: "With an active plan you enter the panel: watchlist, heatmap, economic calendar, screener and price alerts. When you want to execute, you do it through the regulated partner broker.",
        },
      ],
      ctaHeading: "Take the first step",
      ctaBody: "Create your account and explore the platform at your own pace.",
    },
    platform: {
      metaTitle: "The platform · SMC Markets",
      metaDescription:
        "The SMC Markets panel: real-time TradingView charts, watchlist, heatmap, economic calendar, screener and price alerts. Display-only.",
      eyebrow: "The platform",
      heading: "A panel built to decide",
      subtitle:
        "Everything you need to read the market, on one screen. You analyze here; you trade through regulated partners.",
      blocks: [
        {
          heading: "Charts and data by TradingView",
          body: "The heart of the panel is TradingView's real-time charts: the same data quality and technical-analysis tools you'd expect from a professional terminal, built into SMC Markets.",
        },
        {
          heading: "Your watchlist and the market browser",
          body: "Build your watchlist with the symbols that matter to you and navigate the six asset classes without leaving the panel. The cockpit keeps everything in view.",
        },
        {
          heading: "Heatmap, calendar and screener",
          body: "A heatmap to see what's moving at a glance, an economic calendar with the events that stir the market, and a screener to filter instruments by what you're after.",
        },
        {
          heading: "Price alerts",
          body: "Set a level and SMC lets you know when price hits it, so you don't have to watch the screen all day. The analysis is yours; the platform just keeps you informed.",
        },
        {
          heading: "Display-only, by design",
          body: "The panel is for analysis and visualization: it does not execute orders or custody funds. When you decide to trade, you do it through regulated partner brokers.",
        },
      ],
      ctaHeading: "Enter the panel",
      ctaBody:
        "Open your account and explore the platform with real-time data.",
    },
    security: {
      metaTitle: "Security and trust · SMC Markets",
      metaDescription:
        "How SMC Markets protects your data and payments: encryption by Stripe, per-user isolation at the database level (RLS) and real-time market data by TradingView.",
      eyebrow: "Security",
      heading: "Trust built on facts",
      subtitle:
        "No invented seals or empty promises. Only what the platform actually does to protect your data and your payments.",
      blocks: [
        {
          heading: "Real-time market data",
          body: "The panel's quotes and charts come live from TradingView, the industry standard in market visualization. What you see and where it comes from: no inflated data or unmeasured metrics.",
        },
        {
          heading: "Payments encrypted by Stripe",
          body: "Charges are processed by Stripe, a global payments leader. No card data passes through SMC Markets' servers or is stored on our side.",
        },
        {
          heading: "Your data, isolated per user",
          body: "The database enforces Row-Level Security (RLS): each account can only read and write its own, with role-based access control. Isolation is at the database-engine level, not an optional check in the application.",
        },
        {
          heading: "Execution and custody, with regulated partners",
          body: "SMC Markets does not execute orders or custody funds: regulated partner brokers do. We are the analysis and visualization layer; money is never in SMC's hands.",
        },
        {
          heading: "No promises of profit",
          body: "SMC Markets provides data and analysis tools; the decisions are always yours. We don't promise returns or offer guaranteed signals.",
        },
      ],
      ctaHeading: "Trade on a solid foundation",
      ctaBody:
        "Open your account and get to know the platform with real-time data.",
    },
    faq: {
      metaTitle: "Frequently asked questions · SMC Markets",
      metaDescription:
        "Everything you need to know before you start on SMC Markets: what it is, how data and payments work, and the regulated partner broker model.",
      eyebrow: "FAQ",
      heading: "Everything you want to know, answered",
      subtitle:
        "The most common questions before you start. If something's left, the rest of the platform clarifies it in context.",
      blocks: [
        {
          heading: "The introducing broker model, in one line",
          body: "SMC Markets is the analysis and visualization platform; order execution and custody of funds are handled by regulated partner brokers. You analyze and decide here; you trade and deposit with the partner.",
        },
        {
          heading: "Data and analysis, never advice",
          body: "Everything you see —charts, quotes, alerts— is real-time information by TradingView so you can decide better. SMC gives no investment advice and promises no results: the decisions are yours.",
        },
        {
          heading: "Payments and cancellation, no surprises",
          body: "Charges are processed by Stripe; no card data touches our servers. There's no lock-in: cancel anytime from My plan and keep access until the end of the paid period.",
        },
        {
          heading: "Try before you commit",
          body: "The Trial plan is a one-time $250 USD payment that gives you access to evaluate the platform at your own pace, before choosing a recurring plan.",
        },
      ],
      ctaHeading: "Ready to start?",
      ctaBody:
        "Open your account and explore the platform with real-time data.",
    },
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
