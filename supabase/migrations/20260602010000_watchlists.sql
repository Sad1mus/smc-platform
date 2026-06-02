-- ============================================================
-- SMC — Watchlist del usuario (símbolos guardados del dashboard).
-- RLS: cada usuario solo ve y gestiona sus propios símbolos.
-- ============================================================

create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null check (char_length(symbol) between 1 and 40),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, symbol)
);

create index watchlists_user_id_idx on public.watchlists (user_id);

alter table public.watchlists enable row level security;

create policy "watchlists_select_own" on public.watchlists
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "watchlists_insert_own" on public.watchlists
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "watchlists_update_own" on public.watchlists
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "watchlists_delete_own" on public.watchlists
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- anon no tiene ningún acceso a watchlists
revoke all on table public.watchlists from anon;
