import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navigation';
import { cn } from '../../lib/cn';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const STORAGE_KEY = 'applie-sidebar-open';

// Collapsible left rail.
//  - Default: collapsed (icons only).
//  - Click the logo to expand — labels slide into view.
//  - When open, an X appears on hover (top-right) to collapse again.
//  - The open/closed choice is remembered across reloads.
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  return (
    <aside
      className={cn(
        'group relative flex h-screen flex-col overflow-hidden border-r border-border bg-card',
        'transition-[width] duration-200 ease-in-out',
        isOpen ? 'w-64' : 'w-[72px]'
      )}
    >
      {/* Brand — click to open when collapsed */}
      <div className="flex h-[72px] items-center px-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={isOpen}
          aria-label="Open menu"
          className={cn('flex items-center', !isOpen && 'cursor-pointer')}
        >
          <Logo expanded={isOpen} />
        </button>
      </div>

      {/* Close — only visible on hover while open */}
      {isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
          className="absolute right-3 top-6 grid h-7 w-7 place-items-center rounded text-secondary opacity-0 transition-opacity hover:bg-background hover:text-primary group-hover:opacity-100"
        >
          <X size={16} />
        </button>
      )}

      {/* Primary navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            title={label}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-secondary hover:bg-background hover:text-primary'
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span
              className={cn(
                'whitespace-nowrap transition-opacity duration-200',
                isOpen ? 'opacity-100' : 'opacity-0'
              )}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <ThemeToggle expanded={isOpen} />
      </div>
    </aside>
  );
}
