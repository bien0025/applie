// Dashboard metric tile: big number on top, uppercase label below, centered.
export default function StatTile({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-6 text-center">
      <div className="text-3xl font-semibold tracking-tight text-primary">
        {value}
      </div>
      <div className="mt-1.5 font-ui text-xs uppercase tracking-wide text-subtle">
        {label}
      </div>
    </div>
  );
}
