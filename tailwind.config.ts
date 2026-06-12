import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FCFAF8",
          100: "#F7F3EE",
          200: "#F0E9E0",
          300: "#E8DDD0",
          400: "#DDD0BE",
          500: "#C8B9A5",
        },
        burgundy: {
          50: "#FCF0F3",
          100: "#F5D5DE",
          200: "#E9A8BC",
          300: "#D97496",
          400: "#C04D73",
          500: "#8B2D4A",
          600: "#6D213C",
          700: "#4B1026",
          800: "#350A1B",
          900: "#1E0510",
        },
      },
    },
  },
  plugins: [],
};
export default config;