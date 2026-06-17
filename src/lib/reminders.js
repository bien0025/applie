// Reminder options for tasks. The user can pick a preset relative to the
// due date, or "Custom" to choose an exact date & time.
export const REMINDER_PRESETS = [
  { value: 'none', label: 'No reminder' },
  { value: 'morning_of', label: 'Morning of (9:00 AM)' },
  { value: '1h_before', label: '1 hour before' },
  { value: '1d_before', label: '1 day before' },
  { value: '2d_before', label: '2 days before' },
  { value: 'exact', label: 'Custom date & time…' },
];

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Resolve a preset + due date into the actual ISO timestamp the email
// should fire at. Returns null when there's no reminder.
export function computeRemindAt(dueAtISO, preset, exactISO) {
  if (preset === 'none') return null;
  if (preset === 'exact') return exactISO ? new Date(exactISO).toISOString() : null;
  if (!dueAtISO) return null;

  const due = new Date(dueAtISO);

  switch (preset) {
    case 'morning_of': {
      const d = new Date(due);
      d.setHours(9, 0, 0, 0);
      return d.toISOString();
    }
    case '1h_before':
      return new Date(due.getTime() - HOUR).toISOString();
    case '1d_before':
      return new Date(due.getTime() - DAY).toISOString();
    case '2d_before':
      return new Date(due.getTime() - 2 * DAY).toISOString();
    default:
      return null;
  }
}
