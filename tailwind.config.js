/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // toggle dark mode by adding the `dark` class to <html>
  theme: {
    extend: {
      fontFamily: {
        // Headings, body, buttons, inputs
        sans: ['Fraunces', 'serif'],
        // Micro-labels: eyebrows, badges, meta, stat labels
        ui: ['system-ui', 'sans-serif'],
        // Brand wordmark (Allura — matches the cursive A in the logo)
        display: ['Allura', 'cursive'],
      },

      colors: {
        // ── Accent (amber) — same in light + dark ──
        accent: {
          DEFAULT: '#F59E0B', // vivid — buttons, links, highlights
          hover: '#D97706',
          muted: '#B45309', // secondary text, icons
          subtle: '#FEF3C7', // backgrounds, badges
          dark: '#78350F', // dark text on light accent
        },

        // ── Semantic — same in light + dark ──
        success: { DEFAULT: '#16A34A', subtle: '#DCFCE7' },
        error: { DEFAULT: '#DC2626', subtle: '#FEE2E2' },
        warning: { DEFAULT: '#D97706', subtle: '#FEF3C7' },
        info: { DEFAULT: '#0284C7', subtle: '#E0F2FE' },

        // ── Theme surfaces — read from CSS variables (see index.css) ──
        // so components never need `dark:` variants for core surfaces.
        background: 'var(--color-bg)',
        card: 'var(--color-bg-raised)', // cards, modals, raised surfaces
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        primary: 'var(--color-text-primary)', // headings, body
        secondary: 'var(--color-text-secondary)', // secondary text
        subtle: 'var(--color-text-subtle)', // placeholders, hints, meta
      },

      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        md: '17px',
        lg: '20px',
        xl: '24px',
        '2xl': '30px',
        '3xl': '38px',
        '4xl': '48px',
      },

      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
      },

      lineHeight: {
        tight: '1.1',
        snug: '1.3',
        normal: '1.6',
        loose: '1.8',
      },

      letterSpacing: {
        tight: '-0.02em',
        normal: '0em',
        wide: '0.06em',
        wider: '0.1em',
      },

      borderRadius: {
        sm: '3px', // subtle
        DEFAULT: '5px', // default — buttons, inputs
        lg: '8px', // modals, panels, alerts
        xl: '12px', // large cards
        full: '9999px', // pills, avatars
      },

      boxShadow: {
        // Values read from CSS variables so dark mode can deepen them.
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },

      transitionTimingFunction: {
        // Playful overshoot for toggles / press states
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // Spacing scale (4px base) already matches Tailwind's defaults,
      // so no custom spacing is needed.
    },
  },
  plugins: [],
};
