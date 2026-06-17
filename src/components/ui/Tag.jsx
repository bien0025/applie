import { cn } from '../../lib/cn';

// Filter chips. `active` highlights the selected chip in amber.
export default function Tag({ active = false, className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-1 font-ui text-sm transition-colors',
        active
          ? 'bg-accent-subtle text-accent-dark'
          : 'bg-border text-secondary hover:bg-border-strong',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
