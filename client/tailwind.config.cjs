/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6ff',
          100: '#e9edff',
          200: '#d5ddff',
          300: '#b0c0ff',
          400: '#7d97ff',
          500: '#4f6ef7',
          600: '#3555e6',
          700: '#2842c4',
          800: '#273b9e',
          900: '#25357c',
        },
        ink: {
          900: '#23253a',
          700: '#5f647d',
          500: '#9096b2',
        },
        shell: '#f6f4ff',
        panel: '#ffffff',
        line: '#e5e6f3',
        danger: '#e11d48',
        success: '#16a34a',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(84, 95, 146, 0.12)',
      },
      borderRadius: {
        xl2: '1.75rem',
      },
    },
  },
  plugins: [],
}
