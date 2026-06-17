import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

// Inline feedback banners. Each variant carries its own color + icon.
const VARIANTS = {
  success: { icon: CheckCircle2, className: 'bg-success-subtle text-success' },
  error: { icon: XCircle, className: 'bg-error-subtle text-error' },
  warning: { icon: AlertTriangle, className: 'bg-warning-subtle text-accent-dark' },
  info: { icon: Info, className: 'bg-info-subtle text-info' },
};

export default function Alert({ variant = 'info', title, children }) {
  const { icon: Icon, className } = VARIANTS[variant];

  return (
    <div className={`flex items-start gap-2.5 rounded-lg p-4 ${className}`}>
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <div>
        {title && <div className="text-[14px] font-medium">{title}</div>}
        {children && (
          <div className="text-sm font-light opacity-85">{children}</div>
        )}
      </div>
    </div>
  );
}
