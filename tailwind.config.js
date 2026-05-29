/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#ffffff',
          2: '#ffffff',
          3: '#f5fffe',
          4: '#eafaff',
        },
        'u-blue':   { DEFAULT: '#009A93', light: '#E37200' },
        'u-gold':   { DEFAULT: '#009A93', light: '#1ab0a8', pale: '#a8e6e3' },
        'u-orange': { DEFAULT: '#E37200', light: '#f5a050' },
        'u-red':    '#c0392b',
        'u-white':  '#333333',
        'u-muted':  '#777777',
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
