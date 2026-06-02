-- ============================================================
-- SMC — Plataforma de Visualización de Mercados
-- Migración inicial: perfiles, planes, suscripciones y eventos
-- de pago. Todas las tablas con Row-Level Security.
-- ============================================================

-- ── Función reutilizable: updated_at ────────────────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ────────────────────────────────────────────────
-- Extiende auth.users con datos de la app y rol (RBAC).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper para RBAC sin recursión en políticas (security definer).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_select_admin" on public.profiles
  for select to authenticated
  using (public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Defensa en profundidad: el perfil lo crea un trigger; el rol no
-- es editable por el usuario (solo full_name).
revoke insert, update, delete on table public.profiles from anon, authenticated;
grant update (full_name) on table public.profiles to authenticated;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Crear perfil automáticamente al registrarse.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── plans ───────────────────────────────────────────────────
-- Catálogo de planes comerciales (precios del dossier).
create table public.plans (
  id text primary key,
  name text not null,
  description text,
  price_usd numeric(10, 2),
  is_custom boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  stripe_product_id text,
  stripe_price_id text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.plans enable row level security;

-- El catálogo es público: la landing muestra precios sin sesión.
create policy "plans_select_active" on public.plans
  for select to anon, authenticated
  using (active = true);

-- Escrituras solo vía service_role (bypassa RLS).
revoke insert, update, delete on table public.plans from anon, authenticated;

create trigger plans_updated_at
  before update on public.plans
  for each row execute function public.handle_updated_at();

-- ── subscriptions ───────────────────────────────────────────
-- Estado de la suscripción de cada usuario (sincronizado por
-- webhooks de Stripe; el cliente solo lee la propia).
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id text not null references public.plans (id),
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null default 'incomplete' check (
    status in (
      'trialing', 'active', 'past_due', 'canceled',
      'unpaid', 'incomplete', 'incomplete_expired', 'paused'
    )
  ),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_user_status_idx on public.subscriptions (user_id, status);
create index subscriptions_plan_id_idx on public.subscriptions (plan_id);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "subscriptions_select_admin" on public.subscriptions
  for select to authenticated
  using (public.is_admin());

-- Escrituras solo vía service_role (webhooks de Stripe).
revoke insert, update, delete on table public.subscriptions from anon, authenticated;

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ── payment_events ──────────────────────────────────────────
-- Log de eventos de Stripe para idempotencia y auditoría.
-- Acceso exclusivo de service_role: sin políticas para usuarios.
create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  user_id uuid references public.profiles (id) on delete set null,
  processed_at timestamptz not null default now()
);

create index payment_events_user_id_idx on public.payment_events (user_id);
create index payment_events_event_type_idx on public.payment_events (event_type);

alter table public.payment_events enable row level security;

revoke all on table public.payment_events from anon, authenticated;
