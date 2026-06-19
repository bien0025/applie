import { useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/cn';

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_BYTES = 10 * 1024 * 1024;

// Click-or-drag file uploader. Accepts PDF/DOC/DOCX up to 10MB.
// Calls `onUpload(file)` for each valid file.
export default function UploadDropzone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validate = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return 'Please upload a PDF or DOCX file.';
    }
    if (file.size > MAX_BYTES) {
      return 'File is over the 10MB limit.';
    }
    return null;
  };

  const handleFiles = (fileList) => {
    setError('');
    const files = Array.from(fileList || []);
    if (!files.length) return;
    for (const file of files) {
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
          isDragging
            ? 'border-accent bg-accent-subtle'
            : 'border-border bg-card hover:border-border-strong'
        )}
      >
        <Upload size={28} className="mb-3 text-subtle" />
        <h3 className="text-md font-semibold text-primary">
          Click or drag file to this area to upload
        </h3>
        <p className="mt-1 font-ui text-xs text-subtle">
          Supports PDF, DOCX up to 10MB
        </p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 font-ui text-xs text-error">{error}</p>}
    </div>
  );
}
