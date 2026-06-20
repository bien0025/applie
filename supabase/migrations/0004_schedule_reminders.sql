-- =============================================================
-- Schedule the send-reminders Edge Function every 5 minutes
-- =============================================================
-- Run this AFTER you've deployed the send-reminders Edge Function.
-- Replace <YOUR-PROJECT-REF> with the value you'll find in the function
-- URL after deploying (Dashboard → Edge Functions → send-reminders).

-- 1. Enable the extensions we need (one-time per project)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Schedule the call. '*/5 * * * *' = every 5 minutes.
select cron.schedule(
  'send-task-reminders',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://<YOUR-PROJECT-REF>.functions.supabase.co/send-reminders',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object()
  );
  $$
);

-- To unschedule later:
--   select cron.unschedule('send-task-reminders');
