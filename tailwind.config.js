/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Simple theme colors
        theme: {
          // Light mode
          'light-bg': '#ffffff',
          'light-text': '#000000',
          
          // Dark mode  
          'dark-bg': '#000000',
          'dark-text': '#f5f5dc', // warm white (beige)
        },
      },
    },
  },
  plugins: [],
};
