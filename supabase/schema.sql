-- Marica 30 — RSVP tablica
-- Pokreni ovo u Supabase: Dashboard -> SQL Editor -> New query -> Run.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_key text not null unique,          -- lowercased name, za dedup (jedan odgovor po osobi)
  attending boolean not null,
  drink text,
  created_at timestamptz not null default now()
);

-- Row Level Security je uključen; nema javnih policy-a.
-- Aplikacija piše i čita isključivo preko service-role ključa (server-side),
-- koji zaobilazi RLS, pa anon/public nema pristup podacima.
alter table public.rsvps enable row level security;
