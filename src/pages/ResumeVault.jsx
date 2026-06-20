import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import UploadDropzone from '../components/resume/UploadDropzone';
import ResumeRow from '../components/resume/ResumeRow';
import { useResumes } from '../context/ResumesContext';

export default function ResumeVault() {
  const { resumes, addResume, deleteResume, getSignedUrl } = useResumes();
  const [params] = useSearchParams();
  const focusId = params.get('focus');

  const focusRef = useRef(null);
  useEffect(() => {
    if (focusId && focusRef.current) {
      focusRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [focusId]);

  // Fetch a short-lived URL from Storage, then trigger a real browser download.
  const handleDownload = async (resume) => {
    const url = await getSignedUrl(resume);
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = resume.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Open the resume in a new tab — browsers render PDFs inline.
  const handleView = async (resume) => {
    const url = await getSignedUrl(resume);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <PageHeader
        title="Resume Vault"
        subtitle="Manage all your resume versions in one place."
      />

      <div className="mb-6">
        <UploadDropzone onUpload={addResume} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-background px-5 py-3 text-md font-semibold text-primary">
          Saved Resumes
        </div>
        {resumes.length > 0 ? (
          resumes.map((r) => (
            <ResumeRow
              key={r.id}
              resume={r}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={deleteResume}
              highlighted={r.id === focusId}
              rowRef={r.id === focusId ? focusRef : null}
            />
          ))
        ) : (
          <div className="px-5 py-10 text-center text-sm text-secondary">
            No resumes yet — upload one to get started.
          </div>
        )}
      </div>
    </>
  );
}
