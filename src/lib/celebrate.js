import confetti from 'canvas-confetti';

// Brand-colored confetti for a landed offer 🎉
const COLORS = ['#F59E0B', '#D97706', '#16A34A', '#FEF3C7', '#FFFFFF'];

// A short, pleasant ascending chime — synthesized so we don't ship an audio
// file. Best-effort: silently does nothing if Web Audio isn't available.
function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 · E5 · G5 · C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const start = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.32);
    });
  } catch {
    /* sound is best-effort */
  }
}

// Confetti burst + chime. Call when an application is marked Accepted.
export function celebrate() {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: COLORS });
  setTimeout(
    () =>
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS }),
    150
  );
  setTimeout(
    () =>
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS }),
    150
  );
  playSuccessChime();
}
