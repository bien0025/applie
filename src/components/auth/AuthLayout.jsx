import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Logo from '../layout/Logo';

// Placeholder auth shell, but it now uses the same Applie tokens/components.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 text-primary sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Link to="/sign-in" className="inline-flex items-center gap-3 self-start">
          <Logo expanded />
        </Link>

        <Card className="p-6 sm:p-8">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Account
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[30px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-secondary">{subtitle}</p>
            )}
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
}
