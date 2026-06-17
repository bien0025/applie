// Horizontal rule. Pass `label` for a centered "or continue with" style divider.
export default function Divider({ label, className }) {
  if (label) {
    return (
      <div
        className={`flex items-center gap-2.5 font-ui text-xs text-subtle ${className || ''}`}
      >
        <span className="h-px flex-1 bg-border" />
        {label}
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return <hr className={`border-0 border-t border-border ${className || ''}`} />;
}
