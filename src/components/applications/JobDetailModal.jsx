import { ExternalLink, MapPin, DollarSign, Globe, CalendarDays } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import StatusBadge from './StatusBadge';
import { formatShortDate } from '../../lib/dates';

function Meta({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-secondary">
      <Icon size={15} className="flex-shrink-0 text-subtle" />
      <span>{children}</span>
    </div>
  );
}

// Job detail view: description, key facts, and a link to the real listing.
export default function JobDetailModal({ app, open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={app?.role || 'Job'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() =>
              window.open(app.url, '_blank', 'noopener,noreferrer')
            }
          >
            <ExternalLink size={16} /> View listing
          </Button>
        </>
      }
    >
      {app && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold tracking-tight text-primary">
                {app.company}
              </div>
              <div className="text-sm text-secondary">{app.role}</div>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Meta icon={MapPin}>{app.location}</Meta>
            <Meta icon={DollarSign}>{app.salary}</Meta>
            <Meta icon={Globe}>{app.platform}</Meta>
            <Meta icon={CalendarDays}>
              Applied {formatShortDate(app.dateApplied)}
            </Meta>
          </div>

          <div>
            <div className="mb-1.5 font-ui text-xs font-semibold uppercase tracking-wide text-subtle">
              Description
            </div>
            <p className="text-sm leading-normal text-secondary">
              {app.description}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
