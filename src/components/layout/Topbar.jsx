import { LogOut, CircleUserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import { useAuth } from '../../context/AuthContext';

// App top bar: global search on the left, user name + sign-out on the right.
// Clicking the avatar signs out (we'll replace it with a real menu later).
export default function Topbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Names live on user.user_metadata (set at sign-up). Fall back to email
  // so brand-new accounts without metadata still show something readable.
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const displayName =
    `${firstName} ${lastName}`.trim() || user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in', { replace: true });
  };

  return (
    <header className="flex h-[72px] flex-shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-8">
      <GlobalSearch />

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-primary">{displayName}</span>
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign out"
          aria-label="Sign out"
          className="group relative grid h-9 w-9 place-items-center rounded-full text-secondary transition-colors hover:text-primary"
        >
          <CircleUserRound size={30} strokeWidth={1.5} className="group-hover:hidden" />
          <LogOut size={18} className="hidden group-hover:block" />
        </button>
      </div>
    </header>
  );
}
