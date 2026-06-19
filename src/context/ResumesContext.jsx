import { createContext, useContext, useState } from 'react';
import { seedResumes } from '../data/resumes';

const ResumesContext = createContext(null);

/*
  In-memory resumes store (seeded with sample data). When Supabase storage is
  wired up, swap the action bodies — the component API stays the same.
  We keep the File object on uploaded resumes so downloads actually work.
*/
export function ResumesProvider({ children }) {
  const [resumes, setResumes] = useState(seedResumes);

  const addResume = (file) =>
    setResumes((prev) => [
      {
        id: crypto.randomUUID(),
        fileName: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString().slice(0, 10),
        file, // kept for client-side download via createObjectURL
      },
      ...prev,
    ]);

  const deleteResume = (id) =>
    setResumes((prev) => prev.filter((r) => r.id !== id));

  return (
    <ResumesContext.Provider value={{ resumes, addResume, deleteResume }}>
      {children}
    </ResumesContext.Provider>
  );
}

export function useResumes() {
  const ctx = useContext(ResumesContext);
  if (!ctx) throw new Error('useResumes must be used inside a <ResumesProvider>');
  return ctx;
}
