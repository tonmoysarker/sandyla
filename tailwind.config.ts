import type { Config } from "tailwindcss";

/** Semantic token → CSS variable, alpha-aware. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: token("surface"),
          low: token("surface-low"),
          mid: token("surface-mid"),
          high: token("surface-high"),
        },
        ink: {
          DEFAULT: token("ink"),
          muted: token("ink-muted"),
        },
        accent: {
          DEFAULT: token("accent"),
          strong: token("accent-strong"),
        },
        "on-accent": token("on-accent"),
        secondary: {
          DEFAULT: token("secondary"),
          container: token("secondary-container"),
        },
        "on-secondary-container": token("on-secondary-container"),
        tertiary: token("tertiary"),
        outline: {
          DEFAULT: token("outline"),
          variant: token("outline-variant"),
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-garamond)", "serif"],
        label: ["var(--font-hanken)", "sans-serif"],
      },
      fontSize: {
        "fluid-xs": ["var(--step--2)", { lineHeight: "1.5", letterSpacing: "0.08em" }],
        "fluid-sm": ["var(--step--1)", { lineHeight: "1.6" }],
        "fluid-base": ["var(--step-0)", { lineHeight: "1.7" }],
        "fluid-md": ["var(--step-1)", { lineHeight: "1.45" }],
        "fluid-lg": ["var(--step-2)", { lineHeight: "1.3" }],
        "fluid-xl": ["var(--step-3)", { lineHeight: "1.2" }],
        "fluid-2xl": ["var(--step-4)", { lineHeight: "1.12" }],
        "fluid-3xl": ["var(--step-5)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "flow-3xs": "var(--space-3xs)",
        "flow-2xs": "var(--space-2xs)",
        "flow-xs": "var(--space-xs)",
        "flow-s": "var(--space-s)",
        "flow-m": "var(--space-m)",
        "flow-l": "var(--space-l)",
        "flow-xl": "var(--space-xl)",
        "flow-2xl": "var(--space-2xl)",
        "flow-3xl": "var(--space-3xl)",
      },
      transitionDuration: {
        "organic-fast": "150ms",
        "organic-base": "300ms",
        "organic-slow": "500ms",
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.33, 1, 0.68, 1)",
        grand: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      borderRadius: {
        soft: "0.25rem",
      },
      maxWidth: {
        content: "1100px",
        prose: "38rem",
      },
    },
  },
  plugins: [],
};

export default config;
