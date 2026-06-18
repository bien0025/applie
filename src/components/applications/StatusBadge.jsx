import Badge from '../ui/Badge';
import { STATUS_BADGE } from '../../constants/status';

// Maps an application status to its design-system Badge variant.
// Rejected gets a strikethrough to read as "closed out".
export default function StatusBadge({ status }) {
  return (
    <Badge
      variant={STATUS_BADGE[status] || 'neutral'}
      className={status === 'Rejected' ? 'line-through' : undefined}
    >
      {status}
    </Badge>
  );
}
