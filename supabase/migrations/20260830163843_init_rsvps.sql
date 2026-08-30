-- Run this in the Supabase SQL editor.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  party_size int not null check (party_size between 1 and 20),
  side text not null check (side in ('groom', 'bride')),
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- Anonymous visitors may insert their RSVP...
drop policy if exists "anon can insert rsvps" on public.rsvps;
create policy "anon can insert rsvps"
  on public.rsvps
  for insert
  to anon
  with check (true);

-- ...and nothing else. With RLS enabled and no SELECT/UPDATE/DELETE policy,
-- reads from the anon key return zero rows. View RSVPs in the Supabase
-- dashboard (service role bypasses RLS).
