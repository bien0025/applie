import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const TasksContext = createContext(null);

// Postgres row (snake_case) → UI shape (camelCase).
function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes || '',
    applicationId: row.application_id || null,
    dueAt: row.due_at || null,
    remindPreset: row.remind_preset,
    remindAt: row.remind_at || null,
    status: row.status,
    archived: row.archived,
  };
}

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-load whenever the signed-in user changes (sign in / out).
  useEffect(() => {
    if (user === undefined) return; // auth still loading
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('[Applie] Failed to load tasks:', error);
          setTasks([]);
        } else {
          setTasks(data.map(fromRow));
        }
        setLoading(false);
      });
  }, [user]);

  const patch = (id, changes) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));

  const addTask = async (task) => {
    if (!user) return null;
    const row = {
      user_id: user.id,
      title: task.title,
      notes: task.notes || null,
      application_id: task.applicationId || null,
      due_at: task.dueAt || null,
      remind_preset: task.remindPreset || 'none',
      remind_at: task.remindAt || null,
    };
    const { data, error } = await supabase
      .from('tasks')
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error('[Applie] Failed to add task:', error);
      return null;
    }
    const newTask = fromRow(data);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  // Dashboard "Resolve" button — always sets to done.
  const resolveTask = async (id) => {
    patch(id, { status: 'done' });
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'done' })
      .eq('id', id);
    if (error) console.error('[Applie] Failed to resolve task:', error);
  };

  // Tasks page circle — toggles between open and done.
  const toggleTask = async (id) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    const newStatus = current.status === 'done' ? 'open' : 'done';
    patch(id, { status: newStatus });
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) console.error('[Applie] Failed to toggle task:', error);
  };

  const archiveTask = async (id) => {
    patch(id, { archived: true });
    const { error } = await supabase
      .from('tasks')
      .update({ archived: true })
      .eq('id', id);
    if (error) console.error('[Applie] Failed to archive task:', error);
  };

  const restoreTask = async (id) => {
    patch(id, { archived: false });
    const { error } = await supabase
      .from('tasks')
      .update({ archived: false })
      .eq('id', id);
    if (error) console.error('[Applie] Failed to restore task:', error);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        resolveTask,
        toggleTask,
        archiveTask,
        restoreTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used inside a <TasksProvider>');
  return ctx;
}
