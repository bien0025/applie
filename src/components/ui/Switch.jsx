import { cn } from '../../lib/cn';

// Controlled on/off toggle with an optional label.
// Usage: <Switch checked={value} onChange={setValue} label="Email notifications" />
export default function Switch({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-[22px] w-10 flex-shrink-0 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-border-strong'
        )}
      >
        <span
          className={cn(
            'absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform ease-spring',
            checked && 'translate-x-[18px]'
          )}
        />
      </button>
      {label && <span className="font-ui text-sm text-secondary">{label}</span>}
    </label>
  );
}
