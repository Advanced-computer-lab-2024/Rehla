/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#162d56',  // Custom blue color
        // You can add more custom colors here
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
