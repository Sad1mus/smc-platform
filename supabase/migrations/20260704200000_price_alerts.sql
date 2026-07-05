-- ============================================================
-- SMC — Alertas de precio del usuario (análisis, NO ejecución).
-- El usuario define un umbral por símbolo; el disparo/notificación es un
-- stub por ahora (ver lib/alerts). RLS: cada usuario solo ve/gestiona las suyas.
-- ============================================================

create table public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null check (char_length(symbol) between 1 and 40),
  direction text not null check (direction in ('above', 'below')),
  threshold numeric not null check (threshold > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index price_alerts_user_id_idx on public.price_alerts (user_id);

alter table public.price_alerts enable row level security;

create policy "price_alerts_select_own" on public.price_alerts
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "price_alerts_insert_own" on public.price_alerts
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "price_alerts_update_own" on public.price_alerts
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "price_alerts_delete_own" on public.price_alerts
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- anon no tiene ningún acceso a las alertas
revoke all on table public.price_alerts from anon;
