import { useState, useEffect } from 'react';
import { Save, Mail } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import SettingsSection from '../components/settings/SettingsSection';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const NOTIFICATIONS = [
  { key: 'followUp', dbKey: 'email_followup', title: 'Follow-up Reminders', desc: 'Get an alert 7 days after applying.' },
  { key: 'interviewPrep', dbKey: 'email_interview_prep', title: 'Interview Prep Alerts', desc: 'Get a reminder 1 day before interviews.' },
  { key: 'weeklySummary', dbKey: 'email_weekly_summary', title: 'Weekly Summary Email', desc: 'Receive a weekly progress breakdown.' },
];

export default function Settings() {
  const { user, updateUser } = useAuth(); // Ensure updateUser is in your AuthContext

  const [profile, setProfile] = useState({ firstName: '', lastName: '' });
  const [newEmail, setNewEmail] = useState('');
  const [notifs, setNotifs] = useState({ followUp: true, interviewPrep: true, weeklySummary: false });
  const [busy, setBusy] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setNewEmail(user.email); // Initialize email field
    supabase.from('profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (!data) return;
        setProfile({ firstName: data.first_name || '', lastName: data.last_name || '' });
        setNotifs({
          followUp: data.email_followup,
          interviewPrep: data.email_interview_prep,
          weeklySummary: data.email_weekly_summary,
        });
      });
  }, [user]);

  const updateProfile = (field) => (e) => setProfile((p) => ({ ...p, [field]: e.target.value }));
  const toggle = (key) => (val) => setNotifs((n) => ({ ...n, [key]: val }));

  // Handle Profile + Notifications
  const handleSave = async () => {
    setBusy(true);
    setError('');
    
    // 1. Update Auth Metadata
    await supabase.auth.updateUser({
      data: { first_name: profile.firstName.trim(), last_name: profile.lastName.trim() }
    });

    // 2. Update Profiles Table
    const { error: profileError } = await supabase.from('profiles').update({
      first_name: profile.firstName.trim(),
      last_name: profile.lastName.trim(),
      email_followup: notifs.followUp,
      email_interview_prep: notifs.interviewPrep,
      email_weekly_summary: notifs.weeklySummary,
    }).eq('user_id', user.id);

    setBusy(false);
    if (profileError) setError(profileError.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  // Handle Email Update separately
  const handleEmailUpdate = async () => {
    if (newEmail === user.email) return;
    setEmailBusy(true);
    setError('');
    const { error } = await updateUser({ email: newEmail });
    setEmailBusy(false);
    if (error) setError(error.message);
    else alert('Check your inbox (old and new) to confirm the email change.');
  };

  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex flex-col gap-6">
        
        <SettingsSection title="Profile Information" subtitle="Update your account details.">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First Name" value={profile.firstName} onChange={updateProfile('firstName')} />
              <Input label="Last Name" value={profile.lastName} onChange={updateProfile('lastName')} />
            </div>
            <div >
              <Input label="Email Address" type="email" className="flex-1" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              
            </div>
            <Button variant="secondary" onClick={handleEmailUpdate} disabled={emailBusy || newEmail === user.email}>
                <Mail size={16} className="mr-2" /> {emailBusy ? 'Updating...' : 'Update Email'}
              </Button>
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications" subtitle="Manage alerts.">
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
          {error && <span className="text-sm text-error">{error}</span>}
          <Button variant="dark" onClick={handleSave} disabled={busy}>
            <Save size={16} /> {busy ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </>
  );
}