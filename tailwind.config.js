/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#faf7f2',
          100: '#f3ede2',
          200: '#e7d9c4',
          300: '#d8c09f',
          400: '#c5a378',
          500: '#b08757',
          600: '#9b7044',
          700: '#7c5537',
          800: '#654530',
          900: '#53392a',
          950: '#2d1e16',
        },
        emeraldDeep: '#064e3b',
        goldAccent: '#d97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
      },
    },
  },
  plugins: [],
};
