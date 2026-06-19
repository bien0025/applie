import Card from '../ui/Card';

// A settings panel: header (title + subtitle) over a divider, then content.
export default function SettingsSection({ title, subtitle, children }) {
  return (
    <Card className="p-6">
      <div className="border-b border-border pb-5">
        <h2 className="text-md font-semibold tracking-tight text-primary">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-secondary">{subtitle}</p>}
      </div>
      <div className="pt-5">{children}</div>
    </Card>
  );
}
