import { cn } from '../../lib/cn';

// Pill labels for statuses. Colors come straight from the design system.
const VARIANTS = {
  amber: 'bg-accent-subtle text-accent-dark',
  green: 'bg-success-subtle text-success',
  red: 'bg-error-subtle text-error',
  blue: 'bg-info-subtle text-info',
  neutral: 'bg-border text-secondary',
};

export default function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 font-ui text-xs font-semibold tracking-wide',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
