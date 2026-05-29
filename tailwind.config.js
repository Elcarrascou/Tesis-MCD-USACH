/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#f4fefd',
          2: '#ffffff',
          3: '#e8faf8',
          4: '#d4f4f1',
        },
        'u-blue':  { DEFAULT: '#007a74', light: '#E37200' },
        'u-gold':  { DEFAULT: '#009A93', light: '#00b5ad', pale: '#7dd8d4' },
        'u-orange': { DEFAULT: '#E37200', light: '#f08020' },
        'u-red':   '#c0392b',
        'u-white': '#1a3533',
        'u-muted': '#4a8a86',
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'sans-serif'],
        cond: ['"Nunito Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: { blink: 'blink 2s infinite' },
      keyframes: {
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
      },
    },
  },
  plugins: [],
}

