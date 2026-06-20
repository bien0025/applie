// =============================================================
// Applie Chrome extension — popup script
// =============================================================
// Handles sign-in (stored in chrome.storage.local) and saving the
// current browser tab as a job to the user's Applie pipeline.

// ⚠️ Fill these in from your Applie .env file (anon key is public-safe — it's
//    what the website itself uses; RLS still protects your data).
const SUPABASE_URL = 'https://yjzjywruknmnhptcdrwu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqemp5d3J1a25tbmhwdGNkcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MTc3NTEsImV4cCI6MjA5NzI5Mzc1MX0.6vWdlIOR71RxEyggiBXFbnK9VQwsgNUxoVlyT886S7s';

// Supabase needs sync-style storage. chrome.storage is async, so we wrap it.
const chromeStorage = {
  getItem: async (key) => (await chrome.storage.local.get(key))[key] ?? null,
  setItem: async (key, value) => chrome.storage.local.set({ [key]: value }),
  removeItem: async (key) => chrome.storage.local.remove(key),
};

// `window.supabase` is set by lib/supabase.js (the UMD bundle).
// Aliased to `sb` here so our client variable doesn't shadow it.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: chromeStorage,
    persistSession: true,
    autoRefreshToken: true,
    // Extensions don't have a server callback URL — disable URL detection.
    detectSessionInUrl: false,
  },
});

// ── DOM refs ─────────────────────────────────────────────────────
const el = (id) => document.getElementById(id);
const authView = el('auth-view');
const saveView = el('save-view');
const loadingView = el('loading-view');
const emailInput = el('email');
const passwordInput = el('password');
const signInBtn = el('sign-in-btn');
const authError = el('auth-error');
const userEmailEl = el('user-email');
const pageTitleEl = el('page-title');
const pageUrlEl = el('page-url');
const saveBtn = el('save-btn');
const saveMessage = el('save-message');
const saveError = el('save-error');
const signOutBtn = el('sign-out-btn');

let currentTab = null;

// ── Views ────────────────────────────────────────────────────────
function show(view) {
  authView.classList.add('hidden');
  saveView.classList.add('hidden');
  loadingView.classList.add('hidden');
  view.classList.remove('hidden');
}

async function showSaveView(user) {
  show(saveView);
  userEmailEl.textContent = user.email;

  // Grab the active tab so we can show what we're about to save.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  pageTitleEl.textContent = tab?.title || 'Unknown page';
  pageUrlEl.textContent = tab?.url || '';
}

// ── Init: figure out if we're already signed in ──────────────────
async function init() {
  show(loadingView);
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (session?.user) {
    await showSaveView(session.user);
  } else {
    show(authView);
  }
}

// ── Sign in ──────────────────────────────────────────────────────
signInBtn.addEventListener('click', async () => {
  authError.classList.add('hidden');
  signInBtn.disabled = true;
  signInBtn.textContent = 'Signing in…';

  const { data, error } = await sb.auth.signInWithPassword({
    email: emailInput.value.trim(),
    password: passwordInput.value,
  });

  signInBtn.disabled = false;
  signInBtn.textContent = 'Sign in';

  if (error) {
    authError.textContent = error.message;
    authError.classList.remove('hidden');
    return;
  }
  await showSaveView(data.user);
});

// ── Sign out ─────────────────────────────────────────────────────
signOutBtn.addEventListener('click', async () => {
  await sb.auth.signOut();
  show(authView);
});

// ── Save current page ────────────────────────────────────────────
saveBtn.addEventListener('click', async () => {
  saveMessage.classList.add('hidden');
  saveError.classList.add('hidden');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Reading page…';

  try {
    if (!currentTab) throw new Error('No active tab to save.');

    // Inject a function into the page to grab title + text content.
    // We strip scripts/styles and cap length so the AI request stays small.
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: () => {
        const clone = document.body.cloneNode(true);
        clone
          .querySelectorAll('script, style, noscript, svg')
          .forEach((node) => node.remove());
        return {
          title: document.title,
          url: window.location.href,
          text: (clone.innerText || '').slice(0, 12000),
        };
      },
    });

    saveBtn.textContent = 'Parsing job…';

    const { data, error } = await sb.functions.invoke('parse-job', {
      body: {
        pageTitle: result.title,
        pageUrl: result.url,
        pageText: result.text,
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    const app = data.application;
    saveMessage.textContent = `Saved: ${app.company} — ${app.role}`;
    saveMessage.classList.remove('hidden');
  } catch (e) {
    console.error('[Applie ext] save failed:', e);
    saveError.textContent = e?.message || 'Could not save. Try again.';
    saveError.classList.remove('hidden');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save to Applie';
  }
});

init();
