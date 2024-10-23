/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#162d56',  // Custom blue color
        logoOrange: '#f2773e'
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',     /* IE and Edge */
          'scrollbar-width': 'none',        /* Firefox */
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          'display': 'none',               /* Chrome, Safari, and Opera */
        },
      };

      addUtilities(newUtilities);
    }
  ],
}
