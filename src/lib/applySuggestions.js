// Take the user's original resume text and apply the AI's tailored
// suggestions to it. Returns the new full text.
//
//  - "replace" suggestions do a literal find/replace in the resume
//    (case-insensitive fallback if the exact match fails)
//  - "add" suggestions are gathered into a "Highlights" section appended
//    at the end so we don't have to figure out where to slot them
export function applySuggestions(originalText, suggestions = []) {
  let text = originalText;
  const additions = [];

  for (const s of suggestions) {
    if (s.type === 'replace' && s.original && s.suggestion) {
      if (text.includes(s.original)) {
        text = text.replace(s.original, s.suggestion);
      } else {
        // Loose match — strip leading bullet chars + surrounding whitespace
        // before comparing. Helps when the AI quotes the bullet without the marker.
        const needle = s.original.trim().replace(/^[•\-*]\s*/, '');
        const idx = text.toLowerCase().indexOf(needle.toLowerCase());
        if (idx >= 0) {
          text = text.slice(0, idx) + s.suggestion + text.slice(idx + needle.length);
        }
      }
    } else if (s.type === 'add' && s.suggestion) {
      additions.push(s.suggestion);
    }
  }

  if (additions.length) {
    text += '\n\nHighlights\n' + additions.map((a) => `• ${a}`).join('\n');
  }

  return text;
}
