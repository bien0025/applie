import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import ApplicationsTable from '../components/applications/ApplicationsTable';
import JobDetailModal from '../components/applications/JobDetailModal';
import { useApplications } from '../context/ApplicationsContext';
import { STATUSES } from '../constants/status';

export default function Applications() {
  const { applications, updateStatus, archive } = useApplications();
  const [params] = useSearchParams();
  const queryParam = params.get('q') || '';
  const focusId = params.get('focus');

  const [query, setQuery] = useState(queryParam);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  // Keep the search box in sync when arriving via global search (?q=…).
  useEffect(() => setQuery(queryParam), [queryParam]);

  const active = applications.filter((a) => !a.archived);

  const counts = active.reduce(
    (acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }),
    { All: active.length }
  );

  const visible = active
    .filter((a) => activeFilter === 'All' || a.status === activeFilter)
    .filter((a) =>
      `${a.company} ${a.role}`.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <>
      <PageHeader title="Applications" />

      {/* Status filter buttons */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Button
          variant={activeFilter === 'All' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveFilter('All')}
        >
          Show All
        </Button>
        {STATUSES.map((s) => (
          <Button
            key={s}
            variant={activeFilter === s ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveFilter(s)}
          >
            {s} ({counts[s] || 0})
          </Button>
        ))}
      </div>

      <ApplicationsTable
        applications={visible}
        focusId={focusId}
        onRowClick={setSelected}
        onChangeStatus={updateStatus}
        onArchive={archive}
      />

      <JobDetailModal
        app={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
