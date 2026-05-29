/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0c1d1c',
          2: '#112624',
          3: '#163330',
          4: '#1d3f3c',
        },
        'u-blue':  { DEFAULT: '#007a74', light: '#E37200' },
        'u-gold':  { DEFAULT: '#009A93', light: '#00b5ad', pale: '#7dd8d4' },
        'u-orange': { DEFAULT: '#E37200', light: '#f08020' },
        'u-red':   '#c0392b',
        'u-white': '#e8f5f4',
        'u-muted': '#6a9f9c',
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

