/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        metro: {
          teal: '#0F766E',
          tealDark: '#0D9488',
          sapphire: '#0F172A',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          bg: '#090D16'
        }
      }
    },
  },
  plugins: [],
}
