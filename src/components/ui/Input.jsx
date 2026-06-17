import Field from './Field';
import { getFieldClass } from './fieldClass';

// Labeled text input. Pass `error` to show the error state + message,
// or `hint` for helper text.
export default function Input({ label, hint, error, id, className, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <input id={id} className={getFieldClass(Boolean(error), className)} {...props} />
    </Field>
  );
}
