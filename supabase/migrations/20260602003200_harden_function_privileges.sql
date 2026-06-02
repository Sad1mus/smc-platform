-- ============================================================
-- SMC — Endurecimiento: las funciones SECURITY DEFINER no deben
-- ser ejecutables vía RPC (/rest/v1/rpc/*) por anon/authenticated.
-- ============================================================

-- Funciones de trigger: solo el sistema las invoca.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_updated_at() from public, anon, authenticated;

-- is_admin se usa dentro de políticas RLS evaluadas por usuarios
-- autenticados: authenticated conserva EXECUTE, anon no.
revoke execute on function public.is_admin() from public, anon;
