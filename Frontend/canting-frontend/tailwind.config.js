/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf9',
          100: '#f9f7f0',
          200: '#f0ede0',
          300: '#e6e2d0',
          500: '#d4d0c0',
        },
        brown: {
          50: '#fefbf9',
          100: '#fbf5f1',
          200: '#f5ede6',
          300: '#eee4da',
          400: '#ddd9ce',
          500: '#ccc4b8',
          600: '#bba192',
          700: '#9a7e6b',
          800: '#795b44',
          900: '#583822',
        },
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9fcd1',
          300: '#befed7',
          400: '#a3fedd',
          500: '#86efac',
          600: '#6ee7b7',
          700: '#50d69b',
          800: '#34c780',
          900: '#16a34a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}