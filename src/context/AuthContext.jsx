import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

/*
  Tracks who is signed in. Supabase keeps the session in localStorage and
  refreshes the token automatically, so we just listen for changes.
*/
export function AuthProvider({ children }) {
  // `null` = not signed in; `undefined` while still loading.
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // 1. Read the existing session (page reloads keep you logged in).
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null))
      .catch(() => setUser(null));

    // 2. Watch for sign in / sign out anywhere in the app.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // Wrap each Supabase call so components don't import the client directly.
  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email, password, metadata) =>
    supabase.auth.signUp({ email, password, options: { data: metadata } });

  const signOut = () => supabase.auth.signOut();

  // Resend the confirmation email for users who haven't verified yet.
  const resendConfirmation = (email) =>
    supabase.auth.resend({ type: 'signup', email });

  // OAuth Sign In - Updated with the redirectTo origin
  const signInWithOAuth = ({ provider }) => 
    supabase.auth.signInWithOAuth({ 
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: user === undefined,
        signIn,
        signUp,
        signOut,
        resendConfirmation,
        signInWithOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>');
  return ctx;
}