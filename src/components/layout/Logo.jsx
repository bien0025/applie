import { Briefcase } from 'lucide-react';
import { cn } from '../../lib/cn';

// Applie mark + wordmark. The wordmark fades out when the sidebar collapses.
export default function Logo({ expanded = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-white">
        <Briefcase size={18} strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          'whitespace-nowrap text-xl font-semibold tracking-tight text-primary transition-opacity duration-200',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        Applie
      </span>
    </div>
  );
}
