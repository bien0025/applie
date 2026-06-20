-- =============================================================
-- Applications table — every job a user has applied to
-- =============================================================
-- Run this in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  -- Every row belongs to a user. `auth.users` is Supabase's built-in user table.
  -- on delete cascade: if the user deletes their account, their apps go too.
  user_id       uuid not null references auth.users (id) on delete cascade,

  -- Core job fields
  company       text not null,
  role          text not null,
  status        text not null default 'Applied',  -- Applied/Interview/Offer/Accepted/Rejected
  date_applied  date not null default current_date,

  -- Optional metadata
  salary        text,           -- free-text so "$160k" / "$140k-$160k" both work
  location      text,           -- Remote / Hybrid / city / combo
  platform      text,           -- LinkedIn / Indeed / Glassdoor / …
  url           text,
  description   text,
  notes         text,

  -- Archive = soft delete (we never actually delete a job)
  archived      boolean not null default false,

  created_at    timestamptz not null default now()
);

-- Fast lookup of "show me all this user's apps"
create index if not exists applications_user_idx
  on public.applications (user_id, archived);

-- =============================================================
-- Row Level Security
-- =============================================================
-- RLS is Postgres's per-row permission system. With RLS enabled,
-- queries from the frontend automatically filter to ONLY this
-- user's rows — even if someone crafts a malicious request.
alter table public.applications enable row level security;

create policy "Users manage their own applications"
  on public.applications
  for all                          -- SELECT, INSERT, UPDATE, DELETE
  using (auth.uid() = user_id)     -- which rows they can READ
  with check (auth.uid() = user_id); -- which rows they can WRITE
