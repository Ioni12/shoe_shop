/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15150F",
        paper: "#F6F4EF",
        panel: "#EEEBE3",
        brass: {
          DEFAULT: "#C5A059",
          deep: "#A08040",
          light: "#D4B87A",
        },
        stone: {
          DEFAULT: "#7A7568",
          light: "#C9C4B7",
          line: "#DBD7CC",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Public Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        stamp: "0.18em",
      },
    },
  },
  plugins: [],
};
