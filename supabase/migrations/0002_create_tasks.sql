-- =============================================================
-- Tasks table — follow-ups and reminders
-- =============================================================
-- Run AFTER 0001_create_applications.sql (this table references it).

create table if not exists public.tasks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,

  title           text not null,
  notes           text,

  -- Optional link to a specific application. If the app is deleted, we just
  -- null out the link — the task itself stays as a "standalone task".
  application_id  uuid references public.applications (id) on delete set null,

  -- When the task is due (optional — some tasks are open-ended)
  due_at          timestamptz,

  -- Reminder configuration
  remind_preset   text not null default 'none',  -- none/morning_of/1h_before/1d_before/2d_before/exact
  remind_at       timestamptz,                   -- exact time the email should fire
  reminded_at     timestamptz,                   -- set after email sent → prevents dupes

  -- State
  status          text not null default 'open',  -- open | done
  archived        boolean not null default false,

  created_at      timestamptz not null default now()
);

-- Edge function "send-reminders" will query this index every few minutes.
create index if not exists tasks_due_remind_idx
  on public.tasks (remind_at)
  where remind_at is not null and reminded_at is null;

create index if not exists tasks_user_status_idx
  on public.tasks (user_id, status, archived);

-- =============================================================
-- Row Level Security — only the owner can see/edit their tasks
-- =============================================================
alter table public.tasks enable row level security;

create policy "Users manage their own tasks"
  on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
