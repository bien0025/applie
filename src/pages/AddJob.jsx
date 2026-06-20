import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Divider from '../components/ui/Divider';
import InstallExtensionCard from '../components/jobs/InstallExtensionCard';
import { useApplications } from '../context/ApplicationsContext';
import { STATUSES } from '../constants/status';

const EMPTY = {
  company: '',
  role: '',
  salary: '',
  location: '',
  url: '',
  status: 'Applied',
  notes: '',
};

export default function AddJob() {
  const navigate = useNavigate();
  const { addApplication } = useApplications();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.company.trim()) next.company = 'Company name is required.';
    if (!form.role.trim()) next.role = 'Role is required.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const created = await addApplication({
      company: form.company.trim(),
      role: form.role.trim(),
      salary: form.salary.trim(),
      location: form.location.trim(),
      url: form.url.trim(),
      status: form.status,
      notes: form.notes.trim(),
    });
    // Only navigate on success — if the insert failed (network/RLS) we stay
    // on the form so the user can retry.
    if (created) navigate('/applications');
  };

  return (
    <>
      <PageHeader title="Add New Application" />

      <InstallExtensionCard />

      <Divider label="OR ENTER MANUALLY" className="my-8" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corp"
              value={form.company}
              onChange={update('company')}
              error={errors.company}
            />
            <Input
              label="Role / Title"
              placeholder="e.g. Frontend Engineer"
              value={form.role}
              onChange={update('role')}
              error={errors.role}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Yearly Salary"
              placeholder="e.g. $160k"
              value={form.salary}
              onChange={update('salary')}
            />
            <Input
              label="Location"
              placeholder="e.g. Remote, Hybrid, or San Francisco"
              value={form.location}
              onChange={update('location')}
            />
          </div>

          <Input
            label="Job URL"
            placeholder="https://…"
            value={form.url}
            onChange={update('url')}
          />

          <Select
            label="Current Status"
            value={form.status}
            onChange={update('status')}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
          />

          <Textarea
            label="Notes (Optional)"
            placeholder="Anything worth remembering about this role…"
            value={form.notes}
            onChange={update('notes')}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setForm(EMPTY)}>
              Clear
            </Button>
            <Button type="submit">Add Application</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
