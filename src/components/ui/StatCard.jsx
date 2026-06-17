import { cn } from '../../lib/cn';

// Dashboard metric tile: label, big value, optional trend line.
// `trend` is 'up' (default, green) or 'down' (red).
export default function StatCard({ label, value, change, trend = 'up' }) {
  return (
    <div className="rounded-xl border-[1.5px] border-border bg-card px-5 py-[18px]">
      <div className="mb-1.5 font-ui text-xs uppercase tracking-wide text-subtle">
        {label}
      </div>
      <div className="mb-1 text-2xl font-semibold tracking-tight text-primary">
        {value}
      </div>
      {change && (
        <div
          className={cn(
            'font-ui text-sm',
            trend === 'down' ? 'text-error' : 'text-success'
          )}
        >
          {change}
        </div>
      )}
    </div>
  );
}
