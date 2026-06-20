import { useState, useRef, useMemo } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Download, FileEdit } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';
import ResumeTemplate from '../components/resume/ResumeTemplate';
import { useApplications } from '../context/ApplicationsContext';
import { useResumes } from '../context/ResumesContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { extractPdfText } from '../lib/pdf';
import { applySuggestions } from '../lib/applySuggestions';
import { generateResumePdf } from '../lib/generateResumePdf';

export default function Tailor() {
  const { applications, getApplication } = useApplications();
  const { resumes, getSignedUrl, addResume } = useResumes();
  const { user } = useAuth();
  const [appId, setAppId] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [error, setError] = useState('');
  const templateRef = useRef(null);

  const activeApps = applications.filter((a) => !a.archived);
  // Only PDFs can be auto-extracted in the browser.
  const pdfResumes = resumes.filter((r) =>
    r.fileName.toLowerCase().endsWith('.pdf')
  );

  // When the user picks a saved resume, fetch + extract its text into the
  // textarea. They can still edit it after, or paste different text entirely.
  const handlePickResume = async (id) => {
    setResumeId(id);
    setError('');
    if (!id) return;

    const resume = resumes.find((r) => r.id === id);
    if (!resume) return;

    setExtracting(true);
    try {
      const url = await getSignedUrl(resume);
      if (!url) throw new Error('Could not load the resume file.');
      const text = await extractPdfText(url);
      if (!text.trim()) {
        setError(
          'No text found — this PDF might be a scanned image. Paste the text manually.'
        );
        return;
      }
      setResumeText(text);
    } catch (e) {
      console.error('[Applie] PDF extract failed:', e);
      setError('Could not read this PDF. Paste the text manually.');
    } finally {
      setExtracting(false);
    }
  };

  // The original resume text with all "replace" suggestions applied and
  // "add" suggestions appended. Used for the Applie-template PDF render.
  const tailoredText = useMemo(
    () => applySuggestions(resumeText, suggestions || []),
    [resumeText, suggestions]
  );

  const selectedApp = getApplication(appId);

  // Take the rendered template, snap it to a PDF, upload to the vault.
  const handleSaveAsAppliePdf = async () => {
    setError('');
    setSavedMessage('');
    if (!templateRef.current) return;

    setSaving(true);
    try {
      const blob = await generateResumePdf(templateRef.current);
      const safeCo = (selectedApp?.company || 'job').replace(/[^\w-]+/g, '_');
      const safeRole = (selectedApp?.role || 'role').replace(/[^\w-]+/g, '_');
      const fileName = `Resume_for_${safeCo}_${safeRole}.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });
      const saved = await addResume(file);
      if (!saved) throw new Error('Could not save to your Resume Vault.');
      setSavedMessage(`Saved "${fileName}" to your Resume Vault.`);
    } catch (e) {
      console.error('[Applie] Save PDF failed:', e);
      setError(e?.message || 'Could not save the PDF. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTailor = async () => {
    setError('');
    if (!appId) return setError('Pick a job first.');
    if (!resumeText.trim()) return setError('Paste your resume text first.');

    setBusy(true);
    setSuggestions(null);

    try {
      // supabase.functions.invoke auto-includes the user's auth JWT.
      const { data, error: fnError } = await supabase.functions.invoke(
        'tailor-resume',
        {
          body: { resumeText: resumeText.trim(), applicationId: appId },
        }
      );

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setSuggestions(data?.suggestions || []);
    } catch (e) {
      console.error('[Applie] Tailor failed:', e);
      setError(e?.message || 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Tailor Resume"
        subtitle="Get AI suggestions to match your resume to a specific job — your design stays untouched."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* INPUT */}
        <Card className="flex flex-col gap-4 p-6">
          <Select
            label="Tailor for which job?"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            options={[
              { value: '', label: 'Pick a saved job…' },
              ...activeApps.map((a) => ({
                value: a.id,
                label: `${a.company} — ${a.role}`,
              })),
            ]}
            hint={
              activeApps.length === 0
                ? 'Add a job first (Add Job tab) so we know what to tailor for.'
                : undefined
            }
          />

          {pdfResumes.length > 0 && (
            <Select
              label="Use a saved resume (PDF)"
              value={resumeId}
              onChange={(e) => handlePickResume(e.target.value)}
              options={[
                { value: '', label: 'Or paste manually below…' },
                ...pdfResumes.map((r) => ({ value: r.id, label: r.fileName })),
              ]}
              hint={
                extracting
                  ? 'Reading the PDF…'
                  : 'Picks the text out of one of your saved PDFs. You can still edit it below.'
              }
            />
          )}

          <Textarea
            label="Your resume text"
            placeholder="Paste your current resume here — the AI works on the text content, not the layout."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={16}
          />

          {error && <p className="text-sm text-error">{error}</p>}

          <Button
            onClick={handleTailor}
            disabled={busy || !appId || !resumeText.trim()}
            className="w-full"
          >
            <Sparkles size={16} />
            {busy ? 'Tailoring…' : 'Get suggestions'}
          </Button>
        </Card>

        {/* OUTPUT */}
        <div className="flex flex-col gap-3">
          {suggestions === null && !busy && (
            <div className="rounded-xl border-2 border-dashed border-border p-10 text-center text-sm text-subtle">
              Suggestions will appear here.
            </div>
          )}
          {busy && (
            <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-secondary">
              Thinking…
            </div>
          )}
          {suggestions && suggestions.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-secondary">
              Your resume already reads well for this job — no changes suggested.
            </div>
          )}
          {suggestions?.map((s, i) => (
            <SuggestionCard key={i} suggestion={s} />
          ))}

          {/* Save actions — only shown once we have suggestions */}
          {suggestions && suggestions.length > 0 && (
            <Card className="mt-2 flex flex-col gap-3 p-4">
              <div className="font-ui text-xs font-semibold uppercase tracking-wide text-subtle">
                Save the tailored version
              </div>
              <Button
                onClick={handleSaveAsAppliePdf}
                disabled={saving}
                className="w-full"
              >
                <Download size={16} />
                {saving ? 'Building PDF…' : 'Save as Applie PDF'}
              </Button>
              <Button
                variant="secondary"
                disabled
                title="Coming soon — edit your original .docx in place, preserving its design."
                className="w-full opacity-60"
              >
                <FileEdit size={16} />
                Save as DOCX (edit in place) — Coming soon
              </Button>
              {savedMessage && (
                <p className="text-sm text-success">{savedMessage}</p>
              )}
            </Card>
          )}
        </div>
      </div>

      {/*
        Off-screen render of the Applie-branded resume template.
        html2pdf snapshots this DOM into a PDF when the user clicks Save.
        Kept in the layout (not display:none) so styles compute correctly.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 0,
          pointerEvents: 'none',
        }}
      >
        <ResumeTemplate
          ref={templateRef}
          text={tailoredText}
          appliedFor={selectedApp}
          name={
            [
              user?.user_metadata?.first_name,
              user?.user_metadata?.last_name,
            ]
              .filter(Boolean)
              .join(' ') || 'Tailored Resume'
          }
        />
      </div>
    </>
  );
}

function SuggestionCard({ suggestion }) {
  const [copied, setCopied] = useState(false);
  const isAdd = suggestion.type === 'add';

  const copy = async () => {
    await navigator.clipboard.writeText(suggestion.suggestion || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <Badge variant={isAdd ? 'green' : 'amber'}>
          {isAdd ? 'Add new' : 'Replace'}
        </Badge>
        <button
          type="button"
          onClick={copy}
          title="Copy the new text"
          className="grid h-7 w-7 place-items-center rounded text-subtle transition-colors hover:bg-background hover:text-primary"
        >
          {copied ? (
            <Check size={14} className="text-success" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>

      {!isAdd && suggestion.original && (
        <>
          <div className="rounded bg-error-subtle p-3">
            <div className="mb-1 font-ui text-xs font-semibold uppercase tracking-wide text-error">
              From
            </div>
            <p className="text-sm leading-snug text-error/80 line-through">
              {suggestion.original}
            </p>
          </div>
          <div className="flex justify-center text-subtle">
            <ArrowRight size={14} />
          </div>
        </>
      )}

      <div className="rounded bg-success-subtle p-3">
        <div className="mb-1 font-ui text-xs font-semibold uppercase tracking-wide text-success">
          {isAdd ? 'Add' : 'To'}
        </div>
        <p className="text-sm leading-snug text-success">
          {suggestion.suggestion}
        </p>
      </div>

      {suggestion.reason && (
        <p className="border-t border-border pt-2 text-xs text-secondary">
          {suggestion.reason}
        </p>
      )}
    </Card>
  );
}
