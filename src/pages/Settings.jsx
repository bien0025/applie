import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import SettingsSection from '../components/settings/SettingsSection';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const NOTIFICATIONS = [
  {
    key: 'followUp',
    dbKey: 'email_followup',
    title: 'Follow-up Reminders',
    desc: 'Get an alert 7 days after applying if no response.',
  },
  {
    key: 'interviewPrep',
    dbKey: 'email_interview_prep',
    title: 'Interview Prep Alerts',
    desc: 'Get a reminder 1 day before scheduled interviews.',
  },
  {
    key: 'weeklySummary',
    dbKey: 'email_weekly_summary',
    title: 'Weekly Summary Email',
    desc: 'Receive a weekly breakdown of your pipeline progress.',
  },
];

export default function Settings() {
  const { user } = useAuth();

  // Profile defaults come from the signed-in auth user; notification prefs
  // come from the profiles table. Both get overwritten when the profile loads.
  const [profile, setProfile] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
  });
  const [notifs, setNotifs] = useState({
    followUp: true,
    interviewPrep: true,
    weeklySummary: false,
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load the canonical values from the profiles table.
  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error: loadError }) => {
        if (loadError || !data) return;
        setProfile({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: user.email || '',
        });
        setNotifs({
          followUp: data.email_followup,
          interviewPrep: data.email_interview_prep,
          weeklySummary: data.email_weekly_summary,
        });
      });
  }, [user]);

  const updateProfile = (field) => (e) =>
    setProfile((p) => ({ ...p, [field]: e.target.value }));
  const toggle = (key) => (val) => setNotifs((n) => ({ ...n, [key]: val }));

  const handleSave = async () => {
    setBusy(true);
    setError('');

    // 1. Update the auth user — name in metadata, email if changed.
    //    This fires `onAuthStateChange` (USER_UPDATED), so Topbar updates live.
    const authUpdates = {
      data: {
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
      },
    };
    if (profile.email.trim() && profile.email !== user.email) {
      authUpdates.email = profile.email.trim();
    }
    const { error: authError } = await supabase.auth.updateUser(authUpdates);
    if (authError) {
      setBusy(false);
      setError(authError.message);
      return;
    }

    // 2. Update the profiles row — name (mirrored) + notification toggles.
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
        email_followup: notifs.followUp,
        email_interview_prep: notifs.interviewPrep,
        email_weekly_summary: notifs.weeklySummary,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    setBusy(false);
    if (profileError) {
      setError(profileError.message);
      return;
    }

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
              hint={
                profile.email !== user?.email
                  ? 'Changing your email may require confirming the new address.'
                  : undefined
              }
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
          {error && <span className="text-sm text-error">{error}</span>}
          <Button variant="dark" onClick={handleSave} disabled={busy}>
            <Save size={16} /> {busy ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </>
  );
}
