import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ResumesContext = createContext(null);

// Map a DB row → camelCase shape the UI uses. `file` stays null for rows
// loaded from the DB — we fetch the actual blob on demand via signed URLs.
function fromRow(row) {
  return {
    id: row.id,
    fileName: row.file_name,
    size: row.size,
    uploadedAt: row.uploaded_at,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
  };
}

const BUCKET = 'resumes';

export function ResumesProvider({ children }) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      setResumes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('resumes')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('[Applie] Failed to load resumes:', error);
          setResumes([]);
        } else {
          setResumes(data.map(fromRow));
        }
        setLoading(false);
      });
  }, [user]);

  // Upload to Storage, then record the metadata in the table.
  const addResume = async (file) => {
    if (!user) return null;

    // The Storage policy requires the path's first folder to be the user's UUID.
    // That way each user's files are isolated even though the bucket is shared.
    const ext = (file.name.split('.').pop() || 'pdf').toLowerCase();
    const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
    if (uploadError) {
      console.error('[Applie] Storage upload failed:', uploadError);
      return null;
    }

    const row = {
      user_id: user.id,
      file_name: file.name,
      size: file.size,
      storage_path: storagePath,
      mime_type: file.type || null,
    };
    const { data, error: insertError } = await supabase
      .from('resumes')
      .insert(row)
      .select()
      .single();
    if (insertError) {
      console.error('[Applie] Failed to record resume metadata:', insertError);
      // Best-effort: clean up the orphaned file in Storage.
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return null;
    }

    const newResume = fromRow(data);
    setResumes((prev) => [newResume, ...prev]);
    return newResume;
  };

  // Delete the metadata row AND the underlying file. If either fails we
  // still clean up what we can; the user re-deleting won't hurt.
  const deleteResume = async (id) => {
    const target = resumes.find((r) => r.id === id);
    if (!target) return;
    setResumes((prev) => prev.filter((r) => r.id !== id)); // optimistic

    const { error: deleteError } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);
    if (deleteError) {
      console.error('[Applie] Failed to delete resume row:', deleteError);
    }
    if (target.storagePath) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([target.storagePath]);
      if (storageError) {
        console.error('[Applie] Failed to delete storage file:', storageError);
      }
    }
  };

  // Generate a short-lived URL (60s) so the browser can render or download
  // the private file. Storage policy still gates access — the URL only works
  // if the calling user owns the file.
  const getSignedUrl = async (resume) => {
    if (!resume?.storagePath) return null;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(resume.storagePath, 60);
    if (error) {
      console.error('[Applie] Failed to sign URL:', error);
      return null;
    }
    return data.signedUrl;
  };

  return (
    <ResumesContext.Provider
      value={{ resumes, loading, addResume, deleteResume, getSignedUrl }}
    >
      {children}
    </ResumesContext.Provider>
  );
}

export function useResumes() {
  const ctx = useContext(ResumesContext);
  if (!ctx) throw new Error('useResumes must be used inside a <ResumesProvider>');
  return ctx;
}
