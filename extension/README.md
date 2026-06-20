# Applie Chrome Extension

One-click "save this job to my Applie pipeline" for any job-listing page.

## Setup

### 1. Fill in your Supabase anon key

Open `popup.js`. At the top, replace `REPLACE_WITH_YOUR_ANON_KEY` with the value
from your project's `.env` (`VITE_SUPABASE_ANON_KEY`).

The `SUPABASE_URL` is already filled in for your project.

### 2. Deploy the backend Edge Function

In the Supabase Dashboard → Edge Functions → New function → name it
**`parse-job`** → paste the contents of `supabase/functions/parse-job/index.ts`
→ Deploy.

The `SILICONFLOW_API_KEY` secret you already added for `tailor-resume` will
work for this function too.

### 3. Load the extension in Chrome

1. Open `chrome://extensions`
2. Toggle **Developer mode** ON (top-right)
3. Click **Load unpacked**
4. Pick this `extension/` folder
5. You'll see the Applie icon in your toolbar

### 4. Use it

- Visit any job listing (Indeed, LinkedIn, a company careers page, etc.)
- Click the Applie icon
- First time: sign in with the same email/password you use on Applie web
- Click **Save to Applie** — a few seconds later, the job lands in your pipeline

## Notes

- The popup uses chrome.storage.local for sessions, so you stay signed in
  across opens.
- All visual styling is placeholder — your designer (you) will redo this.
- For development: edit files, then click the refresh icon for the
  extension on `chrome://extensions` to pick up changes. Hard reload the
  popup by closing + reopening.
