/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D9D9D9',
        secondary: '#B3B3B3',
        lisecondary: '#CACACA',
        dasecondary: '#8E8E8E',

        primarytext: '#000000',
        secondarytext: '#676767',
      },
    },
  },
  plugins: [],
}

