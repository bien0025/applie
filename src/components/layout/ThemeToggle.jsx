import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cn';

// Light/dark switch. Lives at the bottom of the sidebar.
// Label fades out when the sidebar is collapsed.
export default function ThemeToggle({ expanded = true }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-background hover:text-primary"
    >
      <span className="shrink-0">{isDark ? <Sun size={18} /> : <Moon size={18} />}</span>
      <span
        className={cn(
          'whitespace-nowrap transition-opacity duration-200',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        {isDark ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  );
}
