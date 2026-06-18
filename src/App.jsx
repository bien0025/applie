import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Tasks from './pages/Tasks';
import AddJob from './pages/AddJob';
import ResumeVault from './pages/ResumeVault';
import Archived from './pages/Archived';
import Settings from './pages/Settings';
import UIKit from './pages/UIKit';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All pages render inside the global shell (sidebar + viewport) */}
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="add" element={<AddJob />} />
          <Route path="resumes" element={<ResumeVault />} />
          <Route path="archived" element={<Archived />} />
          <Route path="settings" element={<Settings />} />
          {/* Internal design system reference, not in the sidebar */}
          <Route path="kit" element={<UIKit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
