import PageHeader from '../components/ui/PageHeader';

export default function Applications() {
  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Every job you've applied to, filterable and searchable."
      />
      <div className="rounded-xl border border-border bg-card p-8 text-secondary">
        The full applications list with filter, sort and search will live here.
      </div>
    </>
  );
}
