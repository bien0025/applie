// =============================================================
// send-reminders — emails users when their task reminders are due
// =============================================================
// Triggered by pg_cron every few minutes. Queries the tasks table for
// reminders that are due and haven't been sent yet, sends each via Resend,
// then marks the task as reminded so we never double-send.
//
// Runs in Deno (Supabase Edge Functions). Env vars used:
//   - SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (auto-injected by Supabase)
//   - RESEND_API_KEY (you set this via Dashboard → Edge Functions → Secrets)

import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
// `onboarding@resend.dev` is Resend's shared test sender. Swap to
// `reminders@yourdomain.com` after you verify a domain in Resend.
const FROM = 'Applie <onboarding@resend.dev>';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function sendEmail(to: string, subject: string, text: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, text }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend ${res.status}: ${err}`);
  }
}

function buildBody(task: any, app: any | null) {
  const lines: string[] = [];
  lines.push(`Reminder: ${task.title}`);
  lines.push('');
  if (task.due_at) {
    lines.push(`Due: ${new Date(task.due_at).toLocaleString()}`);
  }
  if (app) lines.push(`For: ${app.company} — ${app.role}`);
  if (task.notes) {
    lines.push('');
    lines.push(`Notes: ${task.notes}`);
  }
  lines.push('');
  lines.push('— Applie');
  return lines.join('\n');
}

Deno.serve(async () => {
  // 1. Find reminders that are due AND not yet sent AND not archived.
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .lte('remind_at', new Date().toISOString())
    .is('reminded_at', null)
    .eq('archived', false)
    .limit(100);

  if (tasksError) {
    return new Response(JSON.stringify({ error: tasksError.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (!tasks?.length) {
    return new Response(JSON.stringify({ sent: 0 }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const results: any[] = [];

  for (const task of tasks) {
    try {
      // Look up the user's email (service role can query auth.users).
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(task.user_id);
      if (userError || !userData?.user?.email) {
        results.push({ taskId: task.id, status: 'no-email' });
        continue;
      }

      // Optionally fetch the linked application for richer email content.
      let app: any = null;
      if (task.application_id) {
        const { data } = await supabase
          .from('applications')
          .select('company, role')
          .eq('id', task.application_id)
          .single();
        app = data;
      }

      await sendEmail(
        userData.user.email,
        `Applie reminder: ${task.title}`,
        buildBody(task, app)
      );

      // Mark as sent — prevents double-emailing on the next cron tick.
      await supabase
        .from('tasks')
        .update({ reminded_at: new Date().toISOString() })
        .eq('id', task.id);

      results.push({ taskId: task.id, status: 'sent' });
    } catch (e) {
      console.error(`Failed task ${task.id}:`, e);
      results.push({ taskId: task.id, status: 'error', error: String(e) });
    }
  }

  return new Response(JSON.stringify({ sent: results.length, results }), {
    headers: { 'content-type': 'application/json' },
  });
});
