import { Circle, CheckCircle2, Bell, Archive, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useApplications } from '../../context/ApplicationsContext';
import { formatRelativeDay, formatDateTime } from '../../lib/dates';
import { REMINDER_PRESETS } from '../../lib/reminders';

// One task in the list: complete toggle, title, linked app, due + reminder,
// and a quick archive/restore button.
// `highlighted` + `rowRef` are used when arriving from global search.
export default function TaskRow({ task, onToggle, onArchive, onRestore, highlighted, rowRef }) {
  const { getApplication } = useApplications();
  const app = getApplication(task.applicationId);
  const done = task.status === 'done';

  // Human label for the reminder (preset name, or the exact time for "Custom").
  const preset = REMINDER_PRESETS.find((p) => p.value === task.remindPreset);
  const reminderText = task.remindAt
    ? task.remindPreset === 'exact'
      ? formatDateTime(task.remindAt)
      : preset?.label
    : null;

  return (
    <div
      ref={rowRef}
      className={cn(
        'flex items-start gap-3 rounded-lg border bg-card px-4 py-3',
        highlighted ? 'border-accent bg-accent/10' : 'border-border'
      )}
    >
      {/* Complete toggle — click to mark done, click again to reopen */}
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={done ? 'Reopen task' : 'Mark as done'}
        className="mt-0.5 flex-shrink-0"
      >
        {done ? (
          <CheckCircle2 size={18} className="text-success" />
        ) : (
          <Circle size={18} className="text-subtle transition-colors hover:text-accent" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <h3
          className={cn(
            'text-sm font-medium text-primary',
            done && 'text-secondary line-through'
          )}
        >
          {task.title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-ui text-xs text-secondary">
          <span>{app ? `${app.company} · ${app.role}` : 'Standalone task'}</span>
          {task.dueAt && <span>Due {formatRelativeDay(task.dueAt)}</span>}
          {reminderText && (
            <span className="inline-flex items-center gap-1 text-subtle">
              <Bell size={12} /> {reminderText}
            </span>
          )}
        </div>
      </div>

      {/* Quick archive / restore */}
      {task.archived ? (
        <button
          type="button"
          title="Restore"
          aria-label="Restore"
          onClick={() => onRestore(task.id)}
          className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded text-subtle transition-colors hover:bg-background hover:text-primary"
        >
          <RotateCcw size={15} />
        </button>
      ) : (
        <button
          type="button"
          title="Archive"
          aria-label="Archive"
          onClick={() => onArchive(task.id)}
          className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded text-subtle transition-colors hover:bg-background hover:text-primary"
        >
          <Archive size={15} />
        </button>
      )}
    </div>
  );
}
