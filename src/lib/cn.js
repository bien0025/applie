// Joins class names, dropping any falsy values.
// Lets components compose conditional Tailwind classes cleanly:
//   cn('btn', isActive && 'btn-active', disabled && 'opacity-40')
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
