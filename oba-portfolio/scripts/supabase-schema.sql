-- =====================================================================
--  Oba Jafojo Portfolio — Supabase schema
--  Run this once in your Supabase project:
--  Dashboard -> SQL Editor -> New query -> paste -> Run.
-- =====================================================================

-- One row holds the entire site's content as JSON (id is always 1).
create table if not exists public.site_content (
  id         integer primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Turn on Row Level Security.
alter table public.site_content enable row level security;

-- Anyone (the public website) may READ the content.
drop policy if exists "public read site_content" on public.site_content;
create policy "public read site_content"
  on public.site_content
  for select
  using (true);

-- Only signed-in users (the admin) may INSERT / UPDATE content.
drop policy if exists "auth write site_content" on public.site_content;
create policy "auth write site_content"
  on public.site_content
  for all
  to authenticated
  using (true)
  with check (true);

-- Seed the single content row if it doesn't exist yet.
-- (The setup-admin script also seeds real placeholder content.)
insert into public.site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
