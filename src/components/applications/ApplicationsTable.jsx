import { useRef, useEffect } from 'react';
import { Archive, RotateCcw } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ApplicationRowMenu from './ApplicationRowMenu';
import { cn } from '../../lib/cn';
import { formatShortDate } from '../../lib/dates';

const COLUMNS = ['Company', 'Role', 'Status', 'Date Applied'];

// The applications list as a table.
//  - Rows are clickable (onRowClick) to open the job detail.
//  - The ⋯ menu changes status / archives (without triggering the row click).
//  - `focusId` highlights + scrolls to a row (used when arriving from search).
export default function ApplicationsTable({
  applications,
  focusId,
  onRowClick,
  onChangeStatus,
  onArchive,
  onRestore,
  emptyMessage = 'No applications match your search.',
}) {
  const focusRef = useRef(null);

  useEffect(() => {
    if (focusId && focusRef.current) {
      focusRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [focusId]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-background text-left">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-5 py-3 font-ui text-xs font-semibold uppercase tracking-wide text-subtle"
              >
                {col}
              </th>
            ))}
            <th className="w-24 px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              ref={app.id === focusId ? focusRef : null}
              onClick={() => onRowClick?.(app)}
              className={cn(
                'cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-background',
                app.status === 'Rejected' && 'opacity-60',
                app.id === focusId && 'bg-accent/10'
              )}
            >
              <td className="px-5 py-4 text-sm font-medium text-primary">
                {app.company}
              </td>
              <td className="px-5 py-4 text-sm text-secondary">{app.role}</td>
              <td className="px-5 py-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-5 py-4 text-sm text-secondary">
                {formatShortDate(app.dateApplied)}
              </td>
              <td
                className="px-5 py-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-end gap-1">
                  {app.archived ? (
                    <button
                      type="button"
                      title="Restore"
                      aria-label="Restore"
                      onClick={() => onRestore?.(app.id)}
                      className="grid h-7 w-7 place-items-center rounded text-subtle transition-colors hover:bg-border hover:text-primary"
                    >
                      <RotateCcw size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="Archive"
                      aria-label="Archive"
                      onClick={() => onArchive?.(app.id)}
                      className="grid h-7 w-7 place-items-center rounded text-subtle transition-colors hover:bg-border hover:text-primary"
                    >
                      <Archive size={15} />
                    </button>
                  )}
                  <ApplicationRowMenu app={app} onChangeStatus={onChangeStatus} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {applications.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-secondary">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
