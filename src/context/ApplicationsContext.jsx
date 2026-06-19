import { createContext, useContext, useState } from 'react';
import { seedApplications } from '../data/applications';

const ApplicationsContext = createContext(null);

/*
  In-memory applications store (seeded). Swap the bodies for Supabase calls
  later — the component API (applications, updateStatus, archive, restore)
  stays the same. We never delete: archive just flips a flag.
*/
export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState(seedApplications);

  const patch = (id, changes) =>
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...changes } : a))
    );

  const updateStatus = (id, status) => patch(id, { status });
  const archive = (id) => patch(id, { archived: true });
  const restore = (id) => patch(id, { archived: false });
  const getApplication = (id) => applications.find((a) => a.id === id);

  const addApplication = (app) =>
    setApplications((prev) => [
      {
        id: crypto.randomUUID(),
        status: 'Applied',
        archived: false,
        dateApplied: new Date().toISOString().slice(0, 10),
        location: '', salary: '', platform: '', description: '', url: '', notes: '',
        ...app,
      },
      ...prev,
    ]);

  return (
    <ApplicationsContext.Provider
      value={{ applications, addApplication, updateStatus, archive, restore, getApplication }}
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
