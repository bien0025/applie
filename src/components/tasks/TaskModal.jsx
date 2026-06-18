import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { useTasks } from '../../context/TasksContext';
import { useApplications } from '../../context/ApplicationsContext';
import { REMINDER_PRESETS, computeRemindAt } from '../../lib/reminders';

const EMPTY = {
  title: '',
  applicationId: '',
  dueAt: '',
  remindPreset: 'morning_of',
  remindExact: '',
  notes: '',
};

// Create-task form. Standalone or linked to an application, with a
// preset or custom reminder time.
export default function TaskModal({ open, onClose }) {
  const { addTask } = useTasks();
  const { applications } = useApplications();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const close = () => {
    setForm(EMPTY);
    setError('');
    onClose();
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      setError('Give your task a title.');
      return;
    }

    addTask({
      title: form.title.trim(),
      notes: form.notes.trim(),
      applicationId: form.applicationId || null,
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : null,
      remindPreset: form.remindPreset,
      remindAt: computeRemindAt(form.dueAt, form.remindPreset, form.remindExact),
    });
    close();
  };

  const appOptions = [
    { value: '', label: 'None (standalone task)' },
    ...applications.map((a) => ({
      value: a.id,
      label: `${a.company} — ${a.role}`,
    })),
  ];

  return (
    <Modal
      open={open}
      onClose={close}
      title="New task"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create task</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Task"
          placeholder="Follow up on Take-home"
          value={form.title}
          onChange={update('title')}
          error={error}
        />

        <Select
          label="Linked application"
          value={form.applicationId}
          onChange={update('applicationId')}
          options={appOptions}
        />

        <Input
          label="Due date"
          type="datetime-local"
          value={form.dueAt}
          onChange={update('dueAt')}
        />

        <Select
          label="Email reminder"
          value={form.remindPreset}
          onChange={update('remindPreset')}
          options={REMINDER_PRESETS}
          hint="We'll email you when it's due. (Email delivery coming soon.)"
        />

        {form.remindPreset === 'exact' && (
          <Input
            label="Remind me at"
            type="datetime-local"
            value={form.remindExact}
            onChange={update('remindExact')}
          />
        )}

        <Textarea
          label="Notes"
          placeholder="Anything you want to remember…"
          value={form.notes}
          onChange={update('notes')}
        />
      </div>
    </Modal>
  );
}
