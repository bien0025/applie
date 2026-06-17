import { ChevronDown } from 'lucide-react';
import Field from './Field';
import { getFieldClass } from './fieldClass';

// Labeled dropdown. Pass <option>s as children, or an `options` array
// of { value, label } for convenience.
export default function Select({
  label,
  hint,
  error,
  id,
  options,
  className,
  children,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div className="relative">
        <select
          id={id}
          className={getFieldClass(Boolean(error), `appearance-none pr-8 ${className || ''}`)}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle"
        />
      </div>
    </Field>
  );
}
