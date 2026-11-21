/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)",
          soft: "rgb(var(--brand-soft) / <alpha-value>)",
        },
        ink: "rgb(var(--ink) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['"Figtree"', "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"Figtree"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgb(11 31 63 / 0.04), 0 4px 16px rgb(11 31 63 / 0.05)",
      },
    },
  },
  plugins: [],
};
