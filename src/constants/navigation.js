import {
  LayoutDashboard,
  Briefcase,
  ListTodo,
  PlusCircle,
  FileText,
  Archive,
  Settings,
} from 'lucide-react';

// Single source of truth for the sidebar links + routes.
// Add a page here and it shows up in the nav automatically.
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Applications', path: '/applications', icon: Briefcase },
  { label: 'Tasks', path: '/tasks', icon: ListTodo },
  { label: 'Add Job', path: '/add', icon: PlusCircle },
  { label: 'Resume Vault', path: '/resumes', icon: FileText },
  { label: 'Archived', path: '/archived', icon: Archive },
  { label: 'Settings', path: '/settings', icon: Settings },
];
