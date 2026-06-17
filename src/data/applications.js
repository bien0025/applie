// Mock applications — used to link a task to a job and to populate selects.
// Will come from Supabase once the Applications screen is wired up.
export const applications = [
  { id: 'a1', company: 'Stripe', role: 'Frontend Engineer' },
  { id: 'a2', company: 'Vercel', role: 'UX Designer' },
  { id: 'a3', company: 'Linear', role: 'Product Manager' },
  { id: 'a4', company: 'Figma', role: 'Senior Product Designer' },
];

export const getApplication = (id) =>
  applications.find((app) => app.id === id);
