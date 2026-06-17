import PageHeader from '../components/ui/PageHeader';

export default function ResumeVault() {
  return (
    <>
      <PageHeader
        title="Resume Vault"
        subtitle="Upload and manage your resume versions."
      />
      <div className="rounded-xl border border-border bg-card p-8 text-secondary">
        Resume uploads and version management will live here.
      </div>
    </>
  );
}
