import type { Config } from "tailwindcss";

/**
 * Lumière design system — Tailwind extension.
 * Colours are sourced from CSS custom properties declared in app/globals.css,
 * so :root remains the single source of truth (and themeable later).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "var(--ivory)",
        obsidian: "var(--obsidian)",
        "rose-gold": "var(--rose-gold)",
        glacial: "var(--glacial)",
        champagne: "var(--champagne)",
        carbon: "var(--carbon)",
        gold: "var(--gold)",
        white: "var(--white)",
      },
      fontFamily: {
        // Display: Cormorant Garamond · Body: DM Sans · Mono: DM Mono
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Scale: 64 / 48 / 32 / 24 / 18 / 14 / 12
        display: ["4rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],   // 64
        h1: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],         // 48
        h2: ["2rem", { lineHeight: "1.15" }],                                  // 32
        h3: ["1.5rem", { lineHeight: "1.3" }],                                 // 24
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],                        // 18
        body: ["0.875rem", { lineHeight: "1.6" }],                             // 14
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],  // 12
      },
      spacing: {
        // 4px base unit — explicit luxe rhythm tokens
        "2": "8px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
        "24": "96px",
      },
      borderRadius: {
        none: "0px",     // images
        button: "2px",   // buttons
        card: "4px",     // cards
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      transitionDuration: {
        "300": "300ms",
        "400": "400ms",
        "600": "600ms",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.25,0.46,0.45,0.94) both",
        reveal: "reveal 600ms cubic-bezier(0.25,0.46,0.45,0.94) both",
        "fade-in": "fade-in 300ms cubic-bezier(0.25,0.46,0.45,0.94) both",
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
