import { useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import StatTile from '../components/dashboard/StatTile';
import ActionCard from '../components/dashboard/ActionCard';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/ui/Button';
import { useTasks } from '../context/TasksContext';
import { useApplications } from '../context/ApplicationsContext';
import { formatRelativeDay } from '../lib/dates';
import { dashboardStats } from '../data/dashboard';

export default function Dashboard() {
  const { tasks, resolveTask } = useTasks();
  const { getApplication } = useApplications();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Open (non-archived) tasks, soonest due first.
  const openTasks = tasks
    .filter((t) => !t.archived && t.status === 'open')
    .sort((a, b) => new Date(a.dueAt || 0) - new Date(b.dueAt || 0));

  return (
    <div className="space-y-10">
      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatTile key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </section>

      {/* Action Required */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h2 className="text-lg font-semibold tracking-tight text-primary">
              Action Required
            </h2>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setTaskModalOpen(true)}>
            <Plus size={16} /> New Task
          </Button>
        </div>

        {openTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {openTasks.map((task) => {
              const app = getApplication(task.applicationId);
              return (
                <ActionCard
                  key={task.id}
                  when={formatRelativeDay(task.dueAt)}
                  title={task.title}
                  company={app?.company}
                  role={app?.role}
                  onResolve={() => resolveTask(task.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-center text-sm text-secondary">
            You're all caught up — no tasks need attention.
          </div>
        )}
      </section>

      {/* Pipeline chart (placeholder) */}
      <section>
        <div className="flex min-h-[240px] items-center justify-center rounded-xl border-2 border-dashed border-border text-sm text-subtle">
          Application Pipeline Graph Placeholder
        </div>
      </section>

      <TaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </div>
  );
}
