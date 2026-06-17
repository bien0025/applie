import PageHeader from '../components/ui/PageHeader';

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and notification preferences."
      />
      <div className="rounded-xl border border-border bg-card p-8 text-secondary">
        Profile and notification settings will live here.
      </div>
    </>
  );
}
