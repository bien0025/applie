import { CircleUserRound } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import { currentUser } from '../../data/user';

// App top bar: global search on the left, user name + profile on the right.
export default function Topbar() {
  return (
    <header className="flex h-[72px] flex-shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-8">
      <GlobalSearch />

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-primary">
          {currentUser.name}
        </span>
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
