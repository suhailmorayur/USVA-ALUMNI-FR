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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e', // USVA primary teal
          800: '#115e59',
          900: '#134e4a',
        },
        cardblue: {
          light: '#00adef', // Gradient end
          dark: '#0b84c1',  // Gradient start
          solid: '#0881bc'  // Flat color match
        }
      },
    },
  },
  plugins: [],
}
