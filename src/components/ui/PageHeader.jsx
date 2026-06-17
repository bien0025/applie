// Reusable page title + optional subtitle, used at the top of each page.
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-secondary">{subtitle}</p>
        )}
      </div>
      {/* Optional actions (buttons, etc.) on the right */}
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
