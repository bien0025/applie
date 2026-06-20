import { FileText, Download, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatFileSize } from '../../lib/format';

// "Sep 24, 2023" — month, day, full year.
function formatLongDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.includes('T') ? iso : `${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// A row in the Saved Resumes list: file icon, name, meta, download + delete.
// Clicking the row opens the file in a new tab.
export default function ResumeRow({ resume, onView, onDownload, onDelete, highlighted, rowRef }) {
  const isViewable = Boolean(resume.storagePath || resume.file);

  return (
    <div
      ref={rowRef}
      onClick={isViewable ? () => onView(resume) : undefined}
      title={isViewable ? 'Click to preview' : undefined}
      className={cn(
        'flex items-center gap-4 border-b border-border px-5 py-4 transition-colors last:border-0',
        highlighted && 'bg-accent/10',
        isViewable && 'cursor-pointer hover:bg-background'
      )}
    >
      <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-background text-secondary">
        <FileText size={20} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-primary">
          {resume.fileName}
        </div>
        <div className="mt-0.5 font-ui text-xs text-subtle">
          {formatLongDate(resume.uploadedAt)} · {formatFileSize(resume.size)}
        </div>
      </div>

      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Download"
          onClick={() => onDownload(resume)}
          className="grid h-8 w-8 place-items-center rounded text-subtle transition-colors hover:bg-background hover:text-primary"
        >
          <Download size={16} />
        </button>
        <button
          type="button"
          aria-label="Delete"
          onClick={() => onDelete(resume.id)}
          className="grid h-8 w-8 place-items-center rounded text-subtle transition-colors hover:bg-error-subtle hover:text-error"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
