/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      x: "1024px",
      xl: "1440px",
    },
    extend: {
      fontFamily: {
        atkinson: "Atkinson Hyperlegible",
      },
    },
  },
  plugins: [],
};
