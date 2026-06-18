// Human-friendly date helpers for tasks and reminders.

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// "Today" / "Tomorrow" / "In 3 days" / "Mon, Jun 23" style labels.
export function formatRelativeDay(iso) {
  if (!iso) return '';
  const target = new Date(iso);
  const diffDays = Math.round(
    (startOfDay(target) - startOfDay(new Date())) / (24 * 60 * 60 * 1000)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

  return target.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// "Jun 23, 10:00 AM" — compact date + time for reminders.
export function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// "Oct 12" — month + day, for things like Date Applied.
// Date-only strings (YYYY-MM-DD) are parsed as local time, not UTC,
// so the day doesn't shift backwards in western timezones.
export function formatShortDate(iso) {
  if (!iso) return '';
  const date = new Date(iso.includes('T') ? iso : `${iso}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
  });
}

// Build a value for <input type="datetime-local"> from `daysFromNow`.
export function isoDaysFromNow(daysFromNow, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}
