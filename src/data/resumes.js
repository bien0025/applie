// Seed resumes — loaded into ResumesContext. Sizes are in bytes.
// Will come from Supabase storage once the backend is wired up.
export const seedResumes = [
  {
    id: 'r1',
    fileName: 'Frontend_Engineer_Resume_v3.pdf',
    size: Math.round(1.2 * 1024 * 1024),
    uploadedAt: '2023-10-18',
  },
  {
    id: 'r2',
    fileName: 'UX_Design_Portfolio_Resume.pdf',
    size: Math.round(2.5 * 1024 * 1024),
    uploadedAt: '2023-09-24',
  },
  {
    id: 'r3',
    fileName: 'General_Software_Dev_v1.pdf',
    size: Math.round(1.1 * 1024 * 1024),
    uploadedAt: '2023-08-10',
  },
];
