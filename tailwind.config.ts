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
        birk: {
          bg: "#FDFCF7",
          cream: "#F5ECD7",
          text: "#2C1810",
          "text-soft": "#6B4C3B",
          yellow: "#F4C430",
          "yellow-soft": "#FFF3B0",
          "yellow-warm": "#E8A020",
          green: "#7FB77E",
          blue: "#A8DADC",
          terra: "#C4784A",
          card: "#FFFFFF",
          muted: "#9A7B6E",
          border: "#E8D5C4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        hand: ["var(--font-caveat)", "Caveat", "cursive"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(44,24,16,0.08)",
        "card-hover": "0 12px 40px rgba(44,24,16,0.14)",
        polaroid: "0 8px 32px rgba(44,24,16,0.18), 0 2px 8px rgba(44,24,16,0.08)",
        "polaroid-hover": "0 20px 60px rgba(44,24,16,0.24)",
        soft: "0 2px 12px rgba(44,24,16,0.06)",
        inner: "inset 0 1px 4px rgba(44,24,16,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
