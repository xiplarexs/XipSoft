import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  darkMode: "class", // Enable class-based dark mode for  theme switching
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],

        navbar: ["var(--font-display)", "sans-serif"],
        "homebar-a": ["var(--font-display)", "sans-serif"],
        "homebar-b": ["var(--font-body)", "sans-serif"],
      },
      colors: {
        // Obsidian Prism palette
        obsidian: "#05071a",
        surface: {
          DEFAULT: "#1a1a22",
          light: "#232330",
        },
        prism: {
          cyan: "#22d3ee",
          violet: "#a78bfa",
          rose: "#fb7185",
          purple: "#c084fc",
          emerald: "#34d399",
          blue: "#3b82f6",
        },
        accent: {
          gold: "#fbbf24",
        },
        // ── LED / Ates Renkleri ──────────────────────────────
        fire: {
          rose:   "#fb7185",  // Ates baslangıç
          orange: "#f97316",  // Ana ates rengi
          yellow: "#fbbf24",  // Ates uç
        },
        // Legacy compat
        primary: "#a78bfa",
        "gradient-from": "#a78bfa",
        "gradient-to": "#22d3ee",
        
        //  Theme (Light/Dark mode support)
        "-bg":           "var(---bg, #09090b)",
        "-surface":      "var(---surface, #1a1a22)",
        "-surface-light":"var(---surface-light, #232330)",
        "-text":         "var(---text, #e4e4e7)",
        "-text-secondary":"var(---text-secondary, #a1a1a1)",
        "-border":       "var(---border, #27272a)",
        "-accent":       "var(---accent, #a78bfa)",
      },
      borderRadius: {
        // glassmorphism oval kartlar
        "glass": "2rem",      // 32px
        "glass-sm": "1.25rem", // 20px
      },
      animation: {
        fadein: "fadeIn 0.5s ease-out forwards",
        shine: "shine 1s",
        infinite_shine: "infinite_shine 3s infinite",
      },
      backgroundImage: {
        "prism-gradient": "linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #fb7185 100%)",
        square:
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255,255,255, 0.06)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shine: {
          "100%": { left: "125%" },
        },
        infinite_shine: {
          "40%, 100%": { opacity: "0", left: "125%" },
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    logs: false,
    themes: [
      {
        obsidian: {
          primary: "#a78bfa",
          secondary: "#22d3ee",
          accent: "#fb7185",
          neutral: "#1a1a22",
          "base-100": "#09090b",
          info: "#22d3ee",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#fb7185",
        },
      },
    ],
  },
};
export default config;
