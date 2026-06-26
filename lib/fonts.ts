import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";

/**
 * Display — Cormorant Garamond (headings, campaign text)
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Body — DM Sans (UI, product descriptions)
 */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Monospaced accent — DM Mono (carat weights, prices, certificate IDs)
 */
export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/** Combined font CSS-variable classes for <html>. */
export const fontVariables = `${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`;
