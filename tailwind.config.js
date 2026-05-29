/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0b1120',
          2: '#101929',
          3: '#16233a',
          4: '#1d2f4a',
        },
        'u-blue': { DEFAULT: '#0d3b8c', light: '#1a56c8' },
        'u-gold': { DEFAULT: '#e8a400', light: '#f5bc2e', pale: '#ffd97a' },
        'u-red': '#c0392b',
        'u-white': '#f0f4fa',
        'u-muted': '#7b90b0',
      },
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
        cond: ['"Barlow Condensed"', 'sans-serif'],
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

