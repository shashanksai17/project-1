/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102a43',
        medical: {
          50: '#eef9ff',
          100: '#d9f1fb',
          500: '#1479a8',
          600: '#0b638f',
          700: '#0b4a6f',
          900: '#082f49',
        },
      },
      boxShadow: {
        soft: '0 12px 32px rgba(15, 61, 83, 0.10)',
      },
    },
  },
  plugins: [],
}
