/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        porcelain: 'var(--porcelain)',
        mist: 'var(--mist)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        sky: 'var(--sky)',
        skydeep: 'var(--sky-deep)',
        abyss: 'var(--abyss)',
        pearl: 'var(--pearl)',
      },
      fontFamily: {
        display: ['Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Outfit', 'Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      screens: { xs: '400px' },
    },
  },
  plugins: [],
};
