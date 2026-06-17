import { cn } from '../../lib/cn';

// Initials avatar. Sizes sm/md/lg, colors amber/stone.
const SIZES = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-md',
};

const COLORS = {
  amber: 'bg-accent-subtle text-accent-dark',
  stone: 'bg-border text-secondary',
};

export default function Avatar({ initials, size = 'md', color = 'amber' }) {
  return (
    <span
      className={cn(
        'inline-flex flex-shrink-0 items-center justify-center rounded-full font-ui font-medium',
        SIZES[size],
        COLORS[color]
      )}
    >
      {initials}
    </span>
  );
}
