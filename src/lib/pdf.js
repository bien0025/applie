import * as pdfjsLib from 'pdfjs-dist';
// Vite resolves `?url` imports to a real URL that the browser can fetch.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set the worker URL once on module load. pdf.js runs heavy work in a
// background thread so the UI doesn't freeze on big documents.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Fetch a PDF from a URL and return its plain text (pages joined by blanks).
// Returns empty string if the PDF is a scanned image (no embedded text).
export async function extractPdfText(url) {
  // pdf.js v4 expects an options object, not a bare URL string.
  const pdf = await pdfjsLib.getDocument({ url }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => item.str)
      .join(' ')
      .trim();
    if (text) pages.push(text);
  }
  return pages.join('\n\n');
}
