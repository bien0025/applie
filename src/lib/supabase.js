import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// Add these to a .env file in the project root (see .env.example).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // A friendly heads-up in the console rather than a hard crash during setup.
  console.warn(
    '[Applie] Supabase env vars are missing. Add VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
