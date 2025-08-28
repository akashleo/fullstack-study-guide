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
        // Light theme colors
        light: {
          primary: '#ffffff',
          secondary: '#f3f4f6',
          accent: '#3b82f6',
          text: '#1f2937',
          muted: '#6b7280',
        },
        // Dark theme colors
        dark: {
          primary: '#1f2937',
          secondary: '#111827',
          accent: '#60a5fa',
          // Warm white color palette for text
          text: '#f5f0e6',       // Primary warm white (ivory)
          muted: '#e6dfd0',      // Secondary warm white (cream)
          subtle: '#d8cfc0',     // Tertiary warm white (light beige)
        },
      },
    },
  },
  plugins: [],
};
