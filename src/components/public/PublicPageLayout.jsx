import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Logo from '../layout/Logo';

export default function PublicPageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 text-primary sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/sign-in" className="inline-flex items-center gap-3">
            <Logo expanded />
          </Link>

          <Link
            to="/sign-in"
            className="inline-flex items-center justify-center rounded border-[1.5px] border-border bg-card px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:border-border-strong"
          >
            Sign in
          </Link>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-background px-6 py-5 sm:px-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Public info
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-secondary">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="px-6 py-6 sm:px-8">{children}</div>
        </Card>
      </div>
    </div>
  );
}
