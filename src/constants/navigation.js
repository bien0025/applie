import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Settings,
} from 'lucide-react';

// Single source of truth for the sidebar links + routes.
// Add a page here and it shows up in the nav automatically.
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Applications', path: '/applications', icon: Briefcase },
  { label: 'Add Job', path: '/add', icon: PlusCircle },
  { label: 'Resume Vault', path: '/resumes', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings },
];
