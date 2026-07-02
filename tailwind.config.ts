import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#131313",
          low: "#1c1b1b",
          high: "#2a2a2a",
        },
        parchment: "#f3ead9",
        gold: {
          DEFAULT: "#f2ca50",
          container: "#d4af37",
        },
        emerald: {
          DEFAULT: "#95d3ba",
          container: "#0b513d",
        },
        ink: "#e5e2e1",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-garamond)", "serif"],
        label: ["var(--font-hanken)", "sans-serif"],
      },
      transitionDuration: {
        "organic-fast": "150ms",
        "organic-base": "250ms",
        "organic-slow": "350ms",
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      borderRadius: {
        soft: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
