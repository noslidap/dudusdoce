/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c8a655',
          light: '#dcc589',
          dark: '#a88b45',
        },
        secondary: {
          DEFAULT: '#e0e7d3',
          light: '#ecf0e3',
          dark: '#c5d1b1',
        },
        accent: {
          DEFAULT: '#d3876e',
          light: '#e0a996',
          dark: '#b36e58',
        },
        background: '#f2f7eb',
        mint: '#e1f0e5',
        cream: '#fcf9f2',
        gold: '#e6c87e',
        'warm-gray': {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ebe0d1',
          300: '#d7c3aa',
          400: '#c1a684',
          500: '#a78a68',
          600: '#8c715a',
          700: '#6f5849',
          800: '#5c4a3d',
          900: '#4a3f35',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1.5rem',
      },
      boxShadow: {
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};