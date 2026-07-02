-- ============================================================
-- SMC — Verificación de identidad (KYC) · Fase 1: flag-gated, proveedor stub.
-- RLS: el dueño solo LEE su verificación; las escrituras ocurren únicamente
-- vía service_role (server actions), mismo patrón que payment_events.
-- ============================================================

create type public.kyc_status as enum ('unverified', 'pending', 'approved', 'rejected');

create table public.kyc_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.kyc_status not null default 'pending',
  provider text not null check (char_length(provider) between 1 and 40),
  provider_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index kyc_verifications_user_id_idx on public.kyc_verifications (user_id);

alter table public.kyc_verifications enable row level security;

create policy "kyc_select_own" on public.kyc_verifications
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Sin políticas de escritura para authenticated: INSERT/UPDATE/DELETE
-- solo ocurren vía service_role (bypassa RLS) desde código server-only.
revoke all on table public.kyc_verifications from anon;
revoke insert, update, delete on table public.kyc_verifications from authenticated;
