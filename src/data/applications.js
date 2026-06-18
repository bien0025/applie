// Seed applications — loaded into ApplicationsContext as starting state.
// `archived` is a flag (we never delete), so the real status is preserved.
// Will come from Supabase once the backend is wired up.
export const seedApplications = [
  {
    id: 'a1', company: 'Stripe', role: 'Frontend Engineer', status: 'Interview',
    dateApplied: '2025-10-12', location: 'Remote', platform: 'LinkedIn', salary: '$160k',
    archived: false, url: 'https://stripe.com/jobs',
    description:
      "Build and maintain Stripe's merchant-facing dashboard in React and TypeScript. Partner closely with design to ship polished, accessible UI.",
  },
  {
    id: 'a2', company: 'Vercel', role: 'UX Designer', status: 'Applied',
    dateApplied: '2025-10-15', location: 'Remote', platform: 'Indeed', salary: '$140k',
    archived: false, url: 'https://vercel.com/careers',
    description:
      'Design end-to-end product flows for the Vercel dashboard, from research through high-fidelity prototypes and shipped UI.',
  },
  {
    id: 'a3', company: 'Linear', role: 'Product Manager', status: 'Offer',
    dateApplied: '2025-10-10', location: 'San Francisco, CA', platform: 'LinkedIn', salary: '$175k',
    archived: false, url: 'https://linear.app/careers',
    description:
      'Own the roadmap for core issue-tracking workflows. Work with a small, senior team shipping fast with high craft.',
  },
  {
    id: 'a4', company: 'Netflix', role: 'Backend Engineer', status: 'Rejected',
    dateApplied: '2025-10-05', location: 'Los Gatos, CA', platform: 'Glassdoor', salary: '$190k',
    archived: false, url: 'https://jobs.netflix.com',
    description:
      'Design and scale streaming services handling millions of requests per second. Java/Kotlin on a high-throughput platform.',
  },
  {
    id: 'a5', company: 'Spotify', role: 'Data Scientist', status: 'Applied',
    dateApplied: '2025-10-18', location: 'New York, NY', platform: 'LinkedIn', salary: '$155k',
    archived: false, url: 'https://www.lifeatspotify.com',
    description:
      'Build models that power music recommendations. Partner with product and engineering to ship experiments at scale.',
  },
  {
    id: 'a6', company: 'Airbnb', role: 'Frontend Engineer', status: 'Interview',
    dateApplied: '2025-10-08', location: 'Remote', platform: 'Indeed', salary: '$165k',
    archived: false, url: 'https://careers.airbnb.com',
    description:
      'Craft the guest booking experience across web. React, TypeScript, and a strong design-systems culture.',
  },
  {
    id: 'a7', company: 'Coinbase', role: 'Mobile Engineer', status: 'Rejected',
    dateApplied: '2025-09-20', location: 'Remote', platform: 'Glassdoor', salary: '$170k',
    archived: true, url: 'https://www.coinbase.com/careers',
    description:
      'Build secure, performant mobile experiences for millions of crypto users on iOS and Android.',
  },
  {
    id: 'a8', company: 'Notion', role: 'Design Engineer', status: 'Applied',
    dateApplied: '2025-09-15', location: 'San Francisco, CA', platform: 'LinkedIn', salary: '$150k',
    archived: true, url: 'https://www.notion.so/careers',
    description:
      'Bridge design and engineering — prototype and ship delightful editor interactions used by millions.',
  },
];
