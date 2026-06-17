import Field from './Field';
import { getFieldClass } from './fieldClass';

// Labeled multi-line text field. Vertically resizable.
export default function Textarea({
  label,
  hint,
  error,
  id,
  rows = 3,
  className,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        className={getFieldClass(Boolean(error), `resize-y ${className || ''}`)}
        {...props}
      />
    </Field>
  );
}
