/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0096FF",
        secondary: "#0096FF",
        white: "#FFFFFF",
      },
      fontFamily: {
        novaMono: ["Nova Mono", "sans-serif"],
      }
    },
  },
  plugins: [],
}
