import Card from '../ui/Card';
import Button from '../ui/Button';

// A single "Action Required" card: when it's due, what to do,
// the linked application (if any), and a Resolve action.
export default function ActionCard({ when, title, company, role, onResolve }) {
  return (
    <Card className="flex h-full flex-col">
      <span className="font-ui text-xs text-subtle">{when}</span>
      <h3 className="mt-1 text-md font-semibold leading-snug tracking-tight text-primary">
        {title}
      </h3>

      {/* Pinned to the bottom so Resolve buttons line up across cards */}
      <div className="mt-auto pt-4">
        {company ? (
          <>
            <div className="text-sm font-medium text-primary">{company}</div>
            <div className="text-sm text-secondary">{role}</div>
          </>
        ) : (
          <div className="text-sm text-subtle">Standalone task</div>
        )}
        <Button className="mt-4 w-full" onClick={onResolve}>
          Resolve
        </Button>
      </div>
    </Card>
  );
}
