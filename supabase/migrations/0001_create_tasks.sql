-- Applie: tasks / reminders table
-- Run this in the Supabase SQL editor (or via the Supabase CLI) once your
-- project is connected. Email delivery is handled separately by an Edge
-- Function that reads `remind_at`.

create table if not exists public.tasks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  title           text not null,
  notes           text,
  application_id  uuid references public.applications (id) on delete set null,
  due_at          timestamptz,
  remind_preset   text not null default 'none',
  remind_at       timestamptz,           -- when the reminder email should fire
  reminded_at     timestamptz,           -- set after the email is sent (prevents dupes)
  status          text not null default 'open',  -- 'open' | 'done'
  created_at      timestamptz not null default now()
);

-- Look up due reminders quickly from the scheduled job.
create index if not exists tasks_remind_at_idx
  on public.tasks (remind_at)
  where remind_at is not null and reminded_at is null;

create index if not exists tasks_user_status_idx
  on public.tasks (user_id, status);

-- Row level security: each user only sees and edits their own tasks.
alter table public.tasks enable row level security;

create policy "Users manage their own tasks"
  on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
