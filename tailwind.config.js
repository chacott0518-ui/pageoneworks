/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
        pretendard: ['Pretendard', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: '#f5f2ed',
        ink: '#1a1a1a',
        gold: '#c9a96e',
      },
      letterSpacing: {
        ultrawide: '0.3em',
        tight: '-0.025em',
        tighter: '-0.04em',
      },
    },
  },
  plugins: [],
}