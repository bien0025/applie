import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Download } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { cn } from '../lib/cn';
import { formatShortDate } from '../lib/dates';
import { resumes } from '../data/resumes';

// Basic list for now — will be fleshed out (upload, manage) with its wireframe.
export default function ResumeVault() {
  const [params] = useSearchParams();
  const focusId = params.get('focus');

  const focusRef = useRef(null);
  useEffect(() => {
    if (focusId && focusRef.current) {
      focusRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [focusId]);

  return (
    <>
      <PageHeader
        title="Resume Vault"
        subtitle="Upload and manage your resume versions."
      />

      <div className="flex flex-col gap-2">
        {resumes.map((r) => (
          <div
            key={r.id}
            ref={r.id === focusId ? focusRef : null}
            className={cn(
              'flex items-center gap-3 rounded-lg border bg-card px-4 py-3',
              r.id === focusId ? 'border-accent bg-accent/10' : 'border-border'
            )}
          >
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-accent-subtle text-accent-dark">
              <FileText size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-primary">{r.name}</div>
              <div className="truncate text-xs text-secondary">
                {r.label} · {r.fileName} · Updated {formatShortDate(r.updated)}
              </div>
            </div>
            <button
              type="button"
              aria-label="Download"
              className="grid h-8 w-8 flex-shrink-0 place-items-center rounded text-subtle transition-colors hover:bg-background hover:text-primary"
            >
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
