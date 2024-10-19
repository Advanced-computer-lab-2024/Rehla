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
  plugins: [],
}

