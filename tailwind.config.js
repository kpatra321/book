/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f9f5',
          100: '#e1f2e7',
          200: '#c5e5d1',
          300: '#9bcfaf',
          400: '#6bb387',
          500: '#469666',
          600: '#347950',
          700: '#2b6142',
          800: '#254e37',
          900: '#20412f',
          950: '#0e2419',
        },
        emeraldDark: {
          900: '#061712',
          950: '#020b08',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
