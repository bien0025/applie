import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Check } from 'lucide-react';
import { STATUSES } from '../../constants/status';
import { celebrate } from '../../lib/celebrate';

// Row "⋯" menu: change status. (Archive/Restore is the quick button in the row.)
// Rendered in a portal so it isn't clipped by the table's rounded overflow.
export default function ApplicationRowMenu({ app, onChangeStatus }) {
  const [coords, setCoords] = useState(null); // null = closed
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const close = () => setCoords(null);

  const toggle = (e) => {
    e.stopPropagation();
    if (coords) return close();
    const r = btnRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom + 4, right: window.innerWidth - r.right });
  };

  useEffect(() => {
    if (!coords) return undefined;
    const onDocClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      )
        close();
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [coords]);

  // Wrap an action so it stops row-click bubbling and closes the menu.
  const run = (fn) => (e) => {
    e.stopPropagation();
    fn();
    close();
  };

  // Set status — celebrate when it's a fresh transition to Accepted 🎉
  const setStatus = (s) => {
    onChangeStatus(app.id, s);
    if (s === 'Accepted' && app.status !== 'Accepted') celebrate();
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="More actions"
        onClick={toggle}
        className="grid h-7 w-7 place-items-center rounded text-subtle transition-colors hover:bg-border hover:text-primary"
      >
        <MoreHorizontal size={16} />
      </button>

      {coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: coords.top, right: coords.right }}
            onClick={(e) => e.stopPropagation()}
            className="z-50 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
          >
            <div className="px-3 py-1.5 font-ui text-xs font-semibold uppercase tracking-wide text-subtle">
              Set status
            </div>
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={run(() => setStatus(s))}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left text-sm text-primary transition-colors hover:bg-background"
              >
                {s}
                {app.status === s && <Check size={14} className="text-accent" />}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
