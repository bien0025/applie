import PageHeader from '../components/ui/PageHeader';

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="An overview of your job search at a glance."
      />
      <div className="rounded-xl border border-border bg-card p-8 text-secondary">
        Stats cards and your recent applications will live here.
      </div>
    </>
  );
}
