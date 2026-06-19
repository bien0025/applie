import { useState } from 'react';
import { Save } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import SettingsSection from '../components/settings/SettingsSection';
import { currentUser } from '../data/user';

const NOTIFICATIONS = [
  {
    key: 'followUp',
    title: 'Follow-up Reminders',
    desc: 'Get an alert 7 days after applying if no response.',
  },
  {
    key: 'interviewPrep',
    title: 'Interview Prep Alerts',
    desc: 'Get a reminder 1 day before scheduled interviews.',
  },
  {
    key: 'weeklySummary',
    title: 'Weekly Summary Email',
    desc: 'Receive a weekly breakdown of your pipeline progress.',
  },
];

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
  });
  const [notifs, setNotifs] = useState({
    followUp: true,
    interviewPrep: true,
    weeklySummary: false,
  });
  const [saved, setSaved] = useState(false);

  const updateProfile = (field) => (e) =>
    setProfile((p) => ({ ...p, [field]: e.target.value }));
  const toggle = (key) => (val) => setNotifs((n) => ({ ...n, [key]: val }));

  // No backend yet — show a brief confirmation.
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <PageHeader title="Settings" />

      <div className="flex flex-col gap-6">
        <SettingsSection
          title="Profile Information"
          subtitle="Update your account details."
        >
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="First Name"
                value={profile.firstName}
                onChange={updateProfile('firstName')}
              />
              <Input
                label="Last Name"
                value={profile.lastName}
                onChange={updateProfile('lastName')}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={updateProfile('email')}
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          subtitle="Manage when and how you are reminded."
        >
          <div className="flex flex-col gap-5">
            {NOTIFICATIONS.map((n) => (
              <div key={n.key} className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-primary">{n.title}</div>
                  <div className="text-sm text-secondary">{n.desc}</div>
                </div>
                <Switch checked={notifs[n.key]} onChange={toggle(n.key)} />
              </div>
            ))}
          </div>
        </SettingsSection>

        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-success">Changes saved.</span>}
          <Button variant="dark" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
