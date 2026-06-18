import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';

// Search field with a leading icon. Wrap width via `className` (e.g. "w-64").
export default function SearchInput({ className, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
      />
      <input
        type="search"
        className="w-full rounded-lg border-[1.5px] border-border bg-card py-2 pl-9 pr-3 text-sm text-primary outline-none transition-all placeholder:text-subtle focus:border-accent focus:shadow-[0_0_0_3px_#F59E0B22]"
        {...props}
      />
    </div>
  );
}
