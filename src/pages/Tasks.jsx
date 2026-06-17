import { useState } from 'react';
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
];

export default function Tasks() {
  const { tasks, resolveTask } = useTasks();
  const [filter, setFilter] = useState('open');
  const [modalOpen, setModalOpen] = useState(false);

  const counts = {
    open: tasks.filter((t) => t.status === 'open').length,
    done: tasks.filter((t) => t.status === 'done').length,
    all: tasks.length,
  };

  const visible = tasks
    .filter((t) => filter === 'all' || t.status === filter)
    .sort((a, b) => new Date(a.dueAt || 0) - new Date(b.dueAt || 0));

  return (
    <>
      <PageHeader title="Tasks" subtitle="Your follow-ups and reminders.">
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New Task
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="mb-5 flex items-center gap-2">
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
            <TaskRow key={task.id} task={task} onResolve={resolveTask} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-sm text-secondary">
          {filter === 'done'
            ? 'No completed tasks yet.'
            : 'No tasks here — create one to get started.'}
        </div>
      )}

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
