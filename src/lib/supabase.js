import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// Add these to a .env file in the project root (see .env.example).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Friendly heads-up — auth calls will fail (gracefully) until you fill .env.
  console.warn(
    '[Applie] Supabase env vars are missing. Add VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY to your .env file, then restart the dev server.'
  );
}

// Use placeholders if env vars are missing so createClient doesn't throw.
// Network calls will fail until real values are present.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
