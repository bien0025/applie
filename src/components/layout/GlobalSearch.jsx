import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTodo, FileText } from 'lucide-react';
import SearchInput from '../ui/SearchInput';
import StatusBadge from '../applications/StatusBadge';
import { useApplications } from '../../context/ApplicationsContext';
import { useTasks } from '../../context/TasksContext';
import { resumes } from '../../data/resumes';

const MAX_PER_GROUP = 4;

// A single result row in the dropdown.
function Result({ onClick, icon: Icon, primary, secondary, right }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-background"
    >
      {Icon && <Icon size={16} className="flex-shrink-0 text-subtle" />}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-primary">
          {primary}
        </span>
        <span className="block truncate text-xs text-secondary">{secondary}</span>
      </span>
      {right}
    </button>
  );
}

function Group({ title, children }) {
  return (
    <div className="py-1">
      <div className="px-4 py-1 font-ui text-xs font-semibold uppercase tracking-wide text-subtle">
        {title}
      </div>
      {children}
    </div>
  );
}

// App-wide search in the top bar. Searches applications, tasks and resumes;
// clicking a result opens the matching screen with that item highlighted.
export default function GlobalSearch() {
  const navigate = useNavigate();
  const { applications, getApplication } = useApplications();
  const { tasks } = useTasks();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const q = query.trim().toLowerCase();
  const match = (text) => text.toLowerCase().includes(q);

  const appResults = q
    ? applications
        .filter((a) => !a.archived && match(`${a.company} ${a.role}`))
        .slice(0, MAX_PER_GROUP)
    : [];
  const taskResults = q
    ? tasks.filter((t) => !t.archived && match(t.title)).slice(0, MAX_PER_GROUP)
    : [];
  const resumeResults = q
    ? resumes.filter((r) => match(`${r.name} ${r.label}`)).slice(0, MAX_PER_GROUP)
    : [];

  const hasResults =
    appResults.length || taskResults.length || resumeResults.length;

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const go = (path) => {
    navigate(path);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <SearchInput
        placeholder="Search…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      />

      {open && q && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {hasResults ? (
            <div className="max-h-96 overflow-y-auto">
              {appResults.length > 0 && (
                <Group title="Applications">
                  {appResults.map((app) => (
                    <Result
                      key={app.id}
                      onClick={() => go(`/applications?focus=${app.id}`)}
                      primary={app.company}
                      secondary={app.role}
                      right={<StatusBadge status={app.status} />}
                    />
                  ))}
                </Group>
              )}

              {taskResults.length > 0 && (
                <Group title="Tasks">
                  {taskResults.map((task) => {
                    const app = getApplication(task.applicationId);
                    return (
                      <Result
                        key={task.id}
                        icon={ListTodo}
                        onClick={() => go(`/tasks?focus=${task.id}`)}
                        primary={task.title}
                        secondary={app ? `${app.company} · ${app.role}` : 'Task'}
                      />
                    );
                  })}
                </Group>
              )}

              {resumeResults.length > 0 && (
                <Group title="Resumes">
                  {resumeResults.map((r) => (
                    <Result
                      key={r.id}
                      icon={FileText}
                      onClick={() => go(`/resumes?focus=${r.id}`)}
                      primary={r.name}
                      secondary={r.label}
                    />
                  ))}
                </Group>
              )}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-secondary">
              No matches for “{query}”
            </div>
          )}
        </div>
      )}
    </div>
  );
}
