# Applie

A job application tracker SaaS — keep every application, follow-up, and
resume version in one place, with AI helping you tailor and a Chrome
extension that grabs job postings in one click.

🌐 **Live:** [applie.vercel.app](https://applie.vercel.app)

---

## What it does

- **Dashboard** — live stats, this-week activity chart, action-required tasks
- **Applications** — full pipeline with status filters, semantic badges,
  click-to-view detail, quick archive, ⋯ menu to change status, confetti
  when you land an offer
- **Tasks** — follow-ups & reminders with email notifications (preset or
  exact-time), open/done toggle, archive
- **Add Job** — manual form, or one-click save from any job page via the
  Chrome extension
- **Resume Vault** — drag-drop PDF/DOCX upload, click-to-preview, download
- **Tailor** — AI suggestions to match your resume to a specific saved job,
  with the option to save the tailored version as an Applie-styled PDF
- **Archived** — soft-deleted apps & tasks (we never actually delete)
- **Settings** — profile, email notification preferences
- **Global search** across applications, tasks, and resumes (top bar)

---

## Stack

- **Frontend:** Vite + React (plain JS) + Tailwind CSS, React Router,
  Fraunces typeface, custom design system
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions)
- **Row-level security** on every table — users only ever see their own data
- **AI:** SiliconFlow (Qwen-family) via Supabase Edge Functions for resume
  tailoring + job-page parsing
- **Email:** Resend, triggered by pg_cron every 5 min for due task reminders
- **PDF:** `pdfjs-dist` (read) + `html2pdf.js` (write) — all client-side
- **Chrome extension:** Manifest V3, vanilla JS, sends page text to the
  `parse-job` Edge Function for AI extraction

---

## Project structure

```
applie/
├── src/
│   ├── components/        # UI kit + per-feature components
│   ├── context/           # Applications/Tasks/Resumes/Auth/Theme providers
│   ├── pages/             # Route-level screens
│   ├── lib/               # Helpers (supabase client, pdf, dates, etc.)
│   ├── constants/         # Nav, status enums
│   └── App.jsx            # Router + protected routes
├── public/
│   └── applie-logo.png    # Brand mark (also the favicon)
├── extension/             # Chrome extension (load unpacked)
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── lib/supabase.js    # bundled UMD build
│   └── icons/
└── supabase/
    ├── migrations/        # SQL schema (run in Supabase SQL Editor)
    │   ├── 0001_create_applications.sql
    │   ├── 0002_create_tasks.sql
    │   ├── 0003_create_profiles.sql
    │   └── 0004_schedule_reminders.sql
    └── functions/         # Edge Functions (deployed via dashboard or CLI)
        ├── send-reminders/   # cron-triggered email job
        ├── tailor-resume/    # AI resume tailoring
        └── parse-job/        # extension's job-page parser
```

---

## Local development

### Prerequisites

- Node 18+
- A Supabase project ([supabase.com](https://supabase.com), free tier is fine)
- A SiliconFlow API key (free tier) for AI features
- A Resend API key (free tier) for email reminders

### Setup

```bash
git clone <repo-url> applie
cd applie
npm install
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your project's
# Settings → API page
npm run dev
```

### Set up Supabase

1. Create the schema — in Dashboard → SQL Editor, run each file from
   `supabase/migrations/` in order (`0001` through `0004`).
2. Create a Storage bucket named `resumes` (Private). Add Storage
   policies that restrict reads/writes to files whose first folder
   matches `auth.uid()::text`.
3. Add the secrets — Dashboard → Edge Functions → Manage secrets:
   - `SILICONFLOW_API_KEY`
   - `RESEND_API_KEY`
4. Deploy the Edge Functions (Dashboard or `supabase functions deploy`):
   - `send-reminders`
   - `tailor-resume`
   - `parse-job`
5. (For the cron to call `send-reminders`, update the URL in
   `0004_schedule_reminders.sql` with your project ref, then run it.)

### Set up the extension

1. In `extension/popup.js`, replace `SUPABASE_ANON_KEY` placeholder with
   your anon key (the same one in `.env`).
2. Chrome → `chrome://extensions` → toggle Developer Mode on →
   **Load unpacked** → select the `extension/` folder.

---

## Conventions

- Plain **JavaScript** (no TypeScript)
- Design system tokens in `tailwind.config.js` and `src/index.css` — never
  hard-code colors, type sizes, radii, or shadows
- Status of every app/task: `archived` is a flag, never a `DELETE` (soft
  delete, restorable from Archived view)
- Async context actions optimistically update local state first, then sync
  to Supabase; failures log to console
- All Edge Functions return JSON `{ data | error }` with CORS headers that
  include `x-client-info` and `apikey` so the Supabase JS client can call
  them from the browser

---

## Status

| Area | Status |
|---|---|
| Auth (sign up / in / out / verify email / sessions) | ✅ |
| Applications, Tasks, Resumes wired to Supabase | ✅ |
| Resume Vault — Storage upload, signed-URL preview, download | ✅ |
| AI resume tailoring (`tailor-resume`) | ✅ |
| Chrome extension + `parse-job` AI parsing | ✅ |
| Email reminders (`send-reminders` + pg_cron) | ✅ — needs verified Resend domain for production |
| Dark mode wired (default off) | ✅ |
| Mobile responsive | ⏳ |
| Settings save → profile + notif prefs | ✅ |
| Save tailored output as Applie-styled PDF | ✅ |
| DOCX in-place edit (alt to PDF) | ⏳ Coming soon |

---

## License

Personal project — all rights reserved.
