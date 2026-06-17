// Wraps a form control with a label and an optional hint / error message.
// Used by Input, Textarea and Select so they all look consistent.
export default function Field({ label, hint, error, htmlFor, children }) {
  const message = error || hint;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="font-ui text-xs font-medium text-secondary">
          {label}
        </label>
      )}
      {children}
      {message && (
        <span
          className={`font-ui text-xs ${error ? 'text-error' : 'text-subtle'}`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
