/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#003447',
      },
      spacing:{
        'main': 'calc(100vw - 224px)'
      }
    },
  },
  plugins: [],
}