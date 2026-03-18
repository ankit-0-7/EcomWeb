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
          bg: '#121212',         // Deep charcoal/almost black background
          surface: '#1E1E1E',    // Slightly lighter dark shade for cards/forms
          primary: '#7B1818',    // Deep Sabyasachi signature maroon/red
          primaryHover: '#5A1111', // Darker maroon for hover states
          gold: '#C5A059',       // Antique muted gold for accents and buttons
          goldHover: '#A88746',  // Darker vintage gold
          textLight: '#F4F0E6',  // Soft parchment off-white for readable text
          border: '#333333'      // Subtle dark borders
        }
      },
      fontFamily: {
        // 'Cormorant Garamond' gives that highly traditional, luxury editorial feel
        serif: ['"Cormorant Garamond"', 'serif'], 
        sans: ['"Montserrat"', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.25em', // Exaggerated spacing for luxury brand headers
      }
    },
  },
  plugins: [],
}