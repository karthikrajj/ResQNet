/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // Sky blue
          dark: '#0284c7',
        },
        secondary: {
          DEFAULT: '#f97316', // Orange
          dark: '#ea580c',
        }
      }
    },
  },
  plugins: [],
}
