import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0D0C0A",
        surface: "#1C1A16",
        "surface-2": "#252220",
        hairline: "#2E2A24",
        cream: "#F2E8CC",
        gold: "#C8A45A",
        "gold-dim": "#8A7040",
        muted: "#6E6455",
        error: "#E05A5A",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      fontSize: {
        label: ["0.6875rem", { letterSpacing: "0.2em", fontWeight: "500" }],
      },
      maxWidth: {
        content: "1200px",
        narrow: "720px",
        tight: "640px",
        card: "480px",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
