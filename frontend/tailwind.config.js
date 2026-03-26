/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          bg: '#faf8f5',         // Maison Light Cream background
          surface: '#f5f3f0',    // Slightly darker cream for cards/forms
          primary: '#1a1a1a',    // Deep Charcoal (replaces the red)
          primaryHover: '#333333', // Lighter charcoal for hover states
          gold: '#b4a078',       // Maison Muted Gold
          goldHover: '#9a8763',  // Darker vintage gold
          textLight: '#1a1a1a',  // MAPPED TO DARK: Keeps existing code from breaking!
          border: '#e8e6e2'      // Soft light borders
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'], 
        sans: ['"Montserrat"', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.25em', 
      }
    },
  },
  plugins: [],
}