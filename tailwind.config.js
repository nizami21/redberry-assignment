/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'firaGo': ['firaGo', 'Arial', 'sans-serif'],
      'helveticaNeue': ['helveticaNeue', 'Arial', 'sans-serif'],
    }
  },
  plugins: [],
}

