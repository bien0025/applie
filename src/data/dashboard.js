// Placeholder dashboard data. Swap these for Supabase queries later —
// the components only depend on this shape, so the UI won't change.

export const dashboardStats = [
  { label: 'Total Apps', value: 42 },
  { label: 'Active', value: 15 },
  { label: 'Offers', value: 2 },
  { label: 'Rejected', value: 8 },
];

export const actionItems = [
  {
    id: 1,
    when: 'Today',
    title: 'Follow up on Take-home',
    company: 'Stripe',
    role: 'Frontend Engineer',
  },
  {
    id: 2,
    when: 'Tomorrow',
    title: 'Send Thank You email',
    company: 'Vercel',
    role: 'UX Designer',
  },
  {
    id: 3,
    when: 'In 2 days',
    title: 'Prep for Final Round',
    company: 'Linear',
    role: 'Product Manager',
  },
];
