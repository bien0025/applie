import { useNavigate } from 'react-router-dom';
import { Search, Plus, CircleUserRound } from 'lucide-react';
import Button from '../ui/Button';

// App top bar: search on the left, primary action + profile on the right.
export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="flex h-[72px] flex-shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-8">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
        />
        <input
          type="search"
          placeholder="Search applications…"
          className="w-full rounded-lg border-[1.5px] border-border bg-card py-2 pl-9 pr-3 text-sm text-primary outline-none transition-all placeholder:text-subtle focus:border-accent focus:shadow-[0_0_0_3px_#F59E0B22]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => navigate('/add')}>
          <Plus size={16} /> Add Job
        </Button>
        <button
          type="button"
          aria-label="Account"
          className="grid h-9 w-9 place-items-center rounded-full text-secondary transition-colors hover:text-primary"
        >
          <CircleUserRound size={30} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
