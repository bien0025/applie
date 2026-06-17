// Labeled progress bar. `value` is a percentage (0–100).
export default function ProgressBar({ label, value = 0 }) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex justify-between font-ui text-xs text-subtle">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
