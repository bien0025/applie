import { cn } from '../../lib/cn';

// Variant → Tailwind classes (maps to the design system button styles).
const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'bg-card text-primary border-[1.5px] border-border shadow-sm hover:border-border-strong',
  ghost: 'bg-transparent text-secondary hover:bg-border hover:text-primary',
  danger: 'bg-error text-white hover:opacity-90',
  dark: 'bg-[#1C1917] text-white hover:bg-[#292524]',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-[14px] px-[18px] py-[9px]',
  lg: 'text-md px-6 py-3',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded font-medium',
        'transition-all duration-200 active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
