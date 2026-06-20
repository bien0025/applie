import { forwardRef } from 'react';

// Applie-branded resume template. Rendered off-screen by Tailor.jsx, then
// captured as a PDF via html2pdf. Plain inline styles so html2canvas
// reliably embeds the visuals (Tailwind/CSS vars sometimes flake).
const ResumeTemplate = forwardRef(function ResumeTemplate({ text, appliedFor, name }, ref) {
  // Split into sections by blank line. First non-empty line is the heading.
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return null;
      return { heading: lines[0], body: lines.slice(1) };
    })
    .filter(Boolean);

  return (
    <div ref={ref} style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.name}>{name || 'Tailored Resume'}</h1>
        {appliedFor && (
          <div style={styles.appliedFor}>
            Tailored for {appliedFor.company} · {appliedFor.role}
          </div>
        )}
      </header>

      <div style={styles.divider} />

      {blocks.map((sec, i) => (
        <section key={i} style={styles.section}>
          <h2 style={styles.h2}>{sec.heading}</h2>
          {sec.body.map((line, j) => {
            const isBullet = /^[•\-*]\s/.test(line);
            const clean = isBullet ? line.replace(/^[•\-*]\s+/, '') : line;
            return (
              <p key={j} style={isBullet ? styles.bullet : styles.line}>
                {isBullet ? `• ${clean}` : clean}
              </p>
            );
          })}
        </section>
      ))}

      <footer style={styles.footer}>Crafted with Applie</footer>
    </div>
  );
});

const styles = {
  page: {
    fontFamily: '"Fraunces", Georgia, serif',
    width: '8.5in',
    minHeight: '11in',
    padding: '0.75in',
    background: '#ffffff',
    color: '#1C1917',
    boxSizing: 'border-box',
    fontSize: '11pt',
    lineHeight: 1.5,
  },
  header: { marginBottom: '12px' },
  name: {
    fontSize: '26pt',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    margin: 0,
    color: '#1C1917',
  },
  appliedFor: {
    fontSize: '10pt',
    color: '#78716C',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  divider: {
    height: '1.5px',
    background: '#1C1917',
    margin: '8px 0 20px',
  },
  section: { marginBottom: '18px', breakInside: 'avoid' },
  h2: {
    fontSize: '12pt',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    margin: '0 0 8px',
    color: '#D97706',
  },
  line: { margin: '0 0 4px', fontSize: '11pt' },
  bullet: {
    margin: '0 0 4px',
    paddingLeft: '16px',
    textIndent: '-12px',
    fontSize: '11pt',
  },
  footer: {
    marginTop: '32px',
    fontSize: '9pt',
    color: '#A8A29E',
    textAlign: 'right',
    fontStyle: 'italic',
  },
};

export default ResumeTemplate;
