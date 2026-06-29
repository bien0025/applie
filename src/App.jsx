import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Tasks from './pages/Tasks';
import AddJob from './pages/AddJob';
import ResumeVault from './pages/ResumeVault';
import Tailor from './pages/Tailor';
import Archived from './pages/Archived';
import Settings from './pages/Settings';
import UIKit from './pages/UIKit';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import Privacy from './pages/Privacy';
import About from './pages/About';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — no auth required */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />

        {/* Everything else lives inside the app shell, behind auth */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="add" element={<AddJob />} />
          <Route path="resumes" element={<ResumeVault />} />
          <Route path="tailor" element={<Tailor />} />
          <Route path="archived" element={<Archived />} />
          <Route path="settings" element={<Settings />} />
          {/* Internal design system reference, not in the sidebar */}
          <Route path="kit" element={<UIKit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
