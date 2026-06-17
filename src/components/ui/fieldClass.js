import { cn } from '../../lib/cn';

// Shared base styling for text inputs, textareas and selects.
// `hasError` swaps the border + focus ring to the error color.
export function getFieldClass(hasError, className) {
  return cn(
    'w-full rounded border-[1.5px] bg-card px-3 py-[9px] font-sans text-[14px] text-primary',
    'outline-none transition-all placeholder:text-subtle',
    hasError
      ? 'border-error focus:shadow-[0_0_0_3px_#DC262622]'
      : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_#F59E0B22]',
    className
  );
}
