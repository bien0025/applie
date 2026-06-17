import { cn } from '../../lib/cn';

// Generic raised container. Use for content panels and list items.
export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border-[1.5px] border-border bg-card p-5 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
