import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ApplicationsContext = createContext(null);

// Convert a Postgres row (snake_case) into the camelCase shape the UI uses.
function fromRow(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status,
    dateApplied: row.date_applied,
    salary: row.salary || '',
    location: row.location || '',
    platform: row.platform || '',
    url: row.url || '',
    description: row.description || '',
    notes: row.notes || '',
    archived: row.archived,
  };
}

export function ApplicationsProvider({ children }) {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load applications every time the signed-in user changes.
  // RLS makes sure we only ever get this user's rows.
  useEffect(() => {
    if (user === undefined) return; // auth still figuring out who's signed in
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('[Applie] Failed to load applications:', error);
          setApplications([]);
        } else {
          setApplications(data.map(fromRow));
        }
        setLoading(false);
      });
  }, [user]);

  // Local-only patch — used as the "optimistic" half of mutations below.
  const patch = (id, changes) =>
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...changes } : a))
    );

  const addApplication = async (app) => {
    if (!user) return null;
    // user_id matches our RLS policy (auth.uid() = user_id).
    const row = {
      user_id: user.id,
      company: app.company,
      role: app.role,
      status: app.status || 'Applied',
      date_applied:
        app.dateApplied || new Date().toISOString().slice(0, 10),
      salary: app.salary || null,
      location: app.location || null,
      platform: app.platform || null,
      url: app.url || null,
      description: app.description || null,
      notes: app.notes || null,
    };
    // .insert(row).select().single() inserts and returns the newly created row.
    const { data, error } = await supabase
      .from('applications')
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error('[Applie] Failed to add application:', error);
      return null;
    }
    const newApp = fromRow(data);
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateStatus = async (id, status) => {
    patch(id, { status }); // optimistic — UI updates instantly
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id);
    if (error) console.error('[Applie] Failed to update status:', error);
  };

  const archive = async (id) => {
    patch(id, { archived: true });
    const { error } = await supabase
      .from('applications')
      .update({ archived: true })
      .eq('id', id);
    if (error) console.error('[Applie] Failed to archive:', error);
  };

  const restore = async (id) => {
    patch(id, { archived: false });
    const { error } = await supabase
      .from('applications')
      .update({ archived: false })
      .eq('id', id);
    if (error) console.error('[Applie] Failed to restore:', error);
  };

  const getApplication = (id) => applications.find((a) => a.id === id);

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        loading,
        addApplication,
        updateStatus,
        archive,
        restore,
        getApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx)
    throw new Error('useApplications must be used inside an <ApplicationsProvider>');
  return ctx;
}
