import { createContext, useContext, useState } from 'react';
import { isoDaysFromNow } from '../lib/dates';

const TasksContext = createContext(null);

/*
  In-memory tasks store (seeded with sample data) so we can build the UI now.
  When Supabase is connected, swap the bodies of addTask / resolveTask / the
  initial state for calls into src/lib/tasks.js — the component API stays the same.
*/
function seedTasks() {
  return [
    {
      id: 't1',
      title: 'Follow up on Take-home',
      notes: '',
      applicationId: 'a1',
      dueAt: isoDaysFromNow(0),
      remindPreset: 'morning_of',
      remindAt: isoDaysFromNow(0, 9),
      status: 'open',
    },
    {
      id: 't2',
      title: 'Send Thank You email',
      notes: '',
      applicationId: 'a2',
      dueAt: isoDaysFromNow(1),
      remindPreset: '1d_before',
      remindAt: isoDaysFromNow(0),
      status: 'open',
    },
    {
      id: 't3',
      title: 'Prep for Final Round',
      notes: '',
      applicationId: 'a3',
      dueAt: isoDaysFromNow(2),
      remindPreset: '1d_before',
      remindAt: isoDaysFromNow(1),
      status: 'open',
    },
  ];
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(seedTasks);

  const addTask = (task) => {
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        status: 'open',
        createdAt: new Date().toISOString(),
        ...task,
      },
      ...prev,
    ]);
  };

  const resolveTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t))
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, resolveTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used inside a <TasksProvider>');
  return ctx;
}
