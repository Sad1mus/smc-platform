-- ============================================================
-- SMC — Notas privadas del usuario por símbolo (diario personal).
--
-- Es texto DEL USUARIO sobre un activo, no contenido de SMC: la plataforma no
-- opina, no recomienda y no agrega/promedia notas entre usuarios. Convertirlas
-- en señal social o en "lo que piensa la comunidad" sería asesoría de inversión
-- (ver docs/specs/product.md y el no-alcance de docs/specs/enriquecimiento.md).
--
-- Una nota por símbolo por usuario (se edita, no se apila). RLS: estrictamente
-- privadas — nadie más que el dueño las lee.
-- ============================================================

create table public.symbol_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  symbol text not null check (char_length(symbol) between 1 and 40),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, symbol)
);

create index symbol_notes_user_id_idx on public.symbol_notes (user_id);

create trigger symbol_notes_updated_at
  before update on public.symbol_notes
  for each row execute function public.handle_updated_at();

alter table public.symbol_notes enable row level security;

create policy "symbol_notes_select_own" on public.symbol_notes
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "symbol_notes_insert_own" on public.symbol_notes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "symbol_notes_update_own" on public.symbol_notes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "symbol_notes_delete_own" on public.symbol_notes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- anon no tiene ningún acceso a las notas
revoke all on table public.symbol_notes from anon;
