import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Tag from '../components/ui/Tag';
import TaskRow from '../components/tasks/TaskRow';
import TaskModal from '../components/tasks/TaskModal';
import { useTasks } from '../context/TasksContext';

const FILTERS = [
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Done' },
  { value: 'all', label: 'All' },
  { value: 'archived', label: 'Archived' },
];

export default function Tasks() {
  const { tasks, toggleTask, archiveTask, restoreTask } = useTasks();
  const [params] = useSearchParams();
  const focusId = params.get('focus');

  // When arriving via global search, show "All" so the task is visible.
  const [filter, setFilter] = useState(focusId ? 'all' : 'open');
  const [modalOpen, setModalOpen] = useState(false);

  const focusRef = useRef(null);
  useEffect(() => {
    if (focusId && focusRef.current) {
      focusRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [focusId]);

  const counts = {
    open: tasks.filter((t) => !t.archived && t.status === 'open').length,
    done: tasks.filter((t) => !t.archived && t.status === 'done').length,
    all: tasks.filter((t) => !t.archived).length,
    archived: tasks.filter((t) => t.archived).length,
  };

  const visible = tasks
    .filter((t) => {
      if (filter === 'archived') return t.archived;
      if (t.archived) return false;
      if (filter === 'all') return true;
      return t.status === filter;
    })
    .sort((a, b) => new Date(a.dueAt || 0) - new Date(b.dueAt || 0));

  const emptyMessage = {
    done: 'No completed tasks yet.',
    archived: 'No archived tasks.',
  }[filter] || 'No tasks here — create one to get started.';

  return (
    <>
      <PageHeader title="Tasks" subtitle="Your follow-ups and reminders.">
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New Task
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Tag
            key={f.value}
            active={filter === f.value}
            onClick={() => setFilter(f.value)}
            className="cursor-pointer"
          >
            {f.label} ({counts[f.value]})
          </Tag>
        ))}
      </div>

      {/* List */}
      {visible.length > 0 ? (
        <div className="flex flex-col gap-2">
          {visible.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onArchive={archiveTask}
              onRestore={restoreTask}
              highlighted={task.id === focusId}
              rowRef={task.id === focusId ? focusRef : null}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-sm text-secondary">
          {emptyMessage}
        </div>
      )}

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
