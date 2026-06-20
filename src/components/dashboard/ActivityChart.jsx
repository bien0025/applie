import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../lib/cn';
import { useApplications } from '../../context/ApplicationsContext';

const WEEKS_TO_SHOW = 8;

// Mon-start week. Time zeroed so we compare dates cleanly.
function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun..6=Sat
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
}

function weekLabel(date, isCurrent) {
  if (isCurrent) return 'This wk';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Weekly applications-submitted chart. Buckets the last 8 weeks by
// dateApplied, highlights the current week, and shows delta vs last week.
export default function ActivityChart() {
  const { applications } = useApplications();

  const { buckets, thisWeek, lastWeek, total, max } = useMemo(() => {
    const apps = applications.filter((a) => !a.archived);
    const currentWeekStart = startOfWeek(new Date());

    // Build buckets oldest → newest. Each spans Mon 00:00 → Sun 23:59:59.
    const buckets = [];
    for (let i = WEEKS_TO_SHOW - 1; i >= 0; i--) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      buckets.push({ start, end, count: 0, isCurrent: i === 0 });
    }

    for (const app of apps) {
      if (!app.dateApplied) continue;
      // T12:00 sidesteps timezone shifting the date back a day.
      const d = new Date(`${app.dateApplied}T12:00:00`);
      for (const b of buckets) {
        if (d >= b.start && d <= b.end) {
          b.count += 1;
          break;
        }
      }
    }

    return {
      buckets,
      thisWeek: buckets[buckets.length - 1].count,
      lastWeek: buckets[buckets.length - 2]?.count ?? 0,
      total: buckets.reduce((sum, b) => sum + b.count, 0),
      max: Math.max(...buckets.map((b) => b.count), 1),
    };
  }, [applications]);

  const delta = thisWeek - lastWeek;
  let deltaText;
  let deltaClass;
  if (delta > 0) {
    deltaText = `+${delta} vs last week`;
    deltaClass = 'text-success';
  } else if (delta < 0) {
    deltaText = `${delta} vs last week`;
    deltaClass = 'text-error';
  } else {
    deltaText = 'Steady';
    deltaClass = 'text-subtle';
  }

  return (
    <Card className="p-6">
      <div>
        <h2 className="text-md font-semibold tracking-tight text-primary">
          Activity
        </h2>
        <p className="mt-1 flex items-center gap-1.5 font-ui text-xs text-subtle">
          <TrendingUp size={13} className="text-accent" />
          Applications per week
        </p>
      </div>

      <div className="my-5 flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight text-primary">
          {thisWeek}
        </span>
        <span className="text-sm text-secondary">this week</span>
        <span className={cn('font-ui text-sm font-medium', deltaClass)}>
          {deltaText}
        </span>
      </div>

      {total > 0 ? (
        <div>
          {/* Bars */}
          <div className="flex h-28 items-stretch gap-2">
            {buckets.map((b, i) => {
              const heightPct = (b.count / max) * 100;
              return (
                <div
                  key={i}
                  className="flex flex-1 flex-col justify-end"
                  title={`${b.count} application${b.count === 1 ? '' : 's'}`}
                >
                  {b.count > 0 ? (
                    <div
                      className={cn(
                        'w-full rounded-t transition-all duration-500',
                        b.isCurrent ? 'bg-accent' : 'bg-accent/30'
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  ) : (
                    // 0-count weeks get a 2px baseline so the chart reads as
                    // continuous and labels still line up.
                    <div className="h-0.5 w-full rounded-t bg-border" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <div className="mt-2 flex gap-2">
            {buckets.map((b, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 text-center font-ui text-[10px]',
                  b.isCurrent ? 'font-semibold text-primary' : 'text-subtle'
                )}
              >
                {weekLabel(b.start, b.isCurrent)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="py-4 text-sm text-secondary">
          Add your first application to start tracking your activity.
        </p>
      )}
    </Card>
  );
}
