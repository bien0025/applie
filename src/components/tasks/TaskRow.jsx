import { Circle, CheckCircle2, Bell } from 'lucide-react';
import { cn } from '../../lib/cn';
import { getApplication } from '../../data/applications';
import { formatRelativeDay, formatDateTime } from '../../lib/dates';
import { REMINDER_PRESETS } from '../../lib/reminders';

// One task in the list: complete toggle, title, linked app, due + reminder.
export default function TaskRow({ task, onResolve }) {
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
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <button
        type="button"
        onClick={() => onResolve(task.id)}
        disabled={done}
        aria-label={done ? 'Completed' : 'Mark as done'}
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
          <span>
            {app ? `${app.company} · ${app.role}` : 'Standalone task'}
          </span>
          {task.dueAt && <span>Due {formatRelativeDay(task.dueAt)}</span>}
          {reminderText && (
            <span className="inline-flex items-center gap-1 text-subtle">
              <Bell size={12} /> {reminderText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
