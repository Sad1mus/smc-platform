-- ============================================================
-- SMC — Seed del catálogo de planes (cifras del dossier).
-- Bronce USD 1.500 · Plata USD 2.800 · VIP personalizado ·
-- Prueba USD 250.
-- Los stripe_price_id se completan al crear los precios en
-- Stripe (test mode).
-- ============================================================

insert into public.plans
  (id, name, description, price_usd, is_custom, features, sort_order)
values
  (
    'prueba',
    'Prueba',
    'Acceso para conocer la experiencia, los gráficos y el flujo de la plataforma antes de elegir un plan.',
    250.00,
    false,
    '["Acceso a la plataforma", "Gráficos en tiempo real", "Soporte estándar"]'::jsonb,
    0
  ),
  (
    'bronce',
    'Bronce',
    'Nivel de entrada para comenzar a usar la plataforma.',
    1500.00,
    false,
    '["Acceso a la plataforma", "Gráficos y dashboards en tiempo real", "Soporte estándar"]'::jsonb,
    1
  ),
  (
    'plata',
    'Plata',
    'Nivel intermedio con capacidades ampliadas.',
    2800.00,
    false,
    '["Todo lo del plan Bronce", "Funcionalidades avanzadas", "Soporte prioritario"]'::jsonb,
    2
  ),
  (
    'vip',
    'VIP',
    'Nivel premium configurado según necesidades.',
    null,
    true,
    '["Todo lo del plan Plata", "Configuración a medida", "Soporte dedicado y onboarding"]'::jsonb,
    3
  );
