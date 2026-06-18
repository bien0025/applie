import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import ApplicationsTable from '../components/applications/ApplicationsTable';
import JobDetailModal from '../components/applications/JobDetailModal';
import { useApplications } from '../context/ApplicationsContext';

export default function Archived() {
  const { applications, updateStatus, restore } = useApplications();
  const [selected, setSelected] = useState(null);

  const archived = applications.filter((a) => a.archived);

  return (
    <>
      <PageHeader
        title="Archived"
        subtitle="Jobs you've archived. Nothing is ever deleted — restore any time."
      />

      <ApplicationsTable
        applications={archived}
        onRowClick={setSelected}
        onChangeStatus={updateStatus}
        onRestore={restore}
        emptyMessage="No archived jobs yet."
      />

      <JobDetailModal
        app={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
