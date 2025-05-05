/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'utsa-blue': '#000000',        // Used for navbar background → now black
        'utsa-orange': '#ffffff',      // Used for navbar text → now white
        'light-gray': '#333333',       // Make it a darker gray for better contrast
        'success': '#1d8221',          // Keep as-is unless you'd like to tweak
        'error': '#E02B2B'
      },
    },
  },
  plugins: [],
}

