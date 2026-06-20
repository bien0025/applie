import html2pdf from 'html2pdf.js';

// Convert an HTML DOM element to a PDF blob (Letter-size, no margin since
// the template paints its own padding).
export async function generateResumePdf(element) {
  const opts = {
    margin: 0,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };
  return html2pdf().set(opts).from(element).outputPdf('blob');
}
