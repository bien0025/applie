-- =============================================================
-- Profiles table — per-user info + notification preferences
-- =============================================================
-- One row per user. The auth.users table holds login info (email/password);
-- this table holds everything else we want to query from the server side,
-- including the email-reminder toggles that the cron job will check.

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,

  -- Mirrored from auth user_metadata for easy server-side joins.
  first_name text,
  last_name  text,

  -- Notification preferences (read by the email cron later).
  email_followup        boolean not null default true,
  email_interview_prep  boolean not null default true,
  email_weekly_summary  boolean not null default false,

  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users manage their own profile"
  on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================
-- Trigger: auto-create a profile row when a new user signs up
-- =============================================================
-- Without this, the frontend would have to remember to insert a profile
-- on first login. With it, every new auth.users row gets a matching
-- profiles row automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Backfill: any existing users (incl. you) get a profile row now
-- =============================================================
insert into public.profiles (user_id, first_name, last_name)
select
  u.id,
  u.raw_user_meta_data->>'first_name',
  u.raw_user_meta_data->>'last_name'
from auth.users u
left join public.profiles p on p.user_id = u.id
where p.user_id is null;
