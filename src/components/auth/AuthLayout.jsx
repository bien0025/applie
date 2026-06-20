// Minimal centered shell for the placeholder auth screens.
// Black-and-white feel for now — we'll design the real thing later.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
