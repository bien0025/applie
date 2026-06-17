import PageHeader from '../components/ui/PageHeader';

export default function AddJob() {
  return (
    <>
      <PageHeader
        title="Add Job"
        subtitle="Log an application manually or let AI grab the details."
      />
      <div className="rounded-xl border border-border bg-card p-8 text-secondary">
        The manual form and AI grab flow will live here.
      </div>
    </>
  );
}
