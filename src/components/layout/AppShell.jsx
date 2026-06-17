import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// Global shell: fixed sidebar + scrollable main content viewport.
// Pages render into <Outlet /> via the router.
export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
