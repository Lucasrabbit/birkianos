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
          paper: "#f5ecd9",
          "paper-deep": "#ecdfc3",
          edge: "#d9c79c",
          ink: "#2b1f12",
          "ink-soft": "#5a4630",
          "ink-faint": "#8b7350",
          sun: "#f2b134",
          "sun-deep": "#d68a0c",
          "sun-pale": "#fde9a8",
          leaf: "#5a6b3a",
          "leaf-deep": "#3d4a26",
          terra: "#b4533a",
          "terra-2": "#8a3a26",
          rose: "#c97a6c",
          sky: "#b9c9b8",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        hand: ["Caveat", "cursive"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(43,31,18,0.08)",
        "card-hover": "0 12px 40px rgba(43,31,18,0.14)",
        polaroid:
          "0 1px 2px rgba(43,31,18,0.08), 0 12px 28px -10px rgba(43,31,18,0.35)",
        "polaroid-hover":
          "0 4px 6px rgba(43,31,18,0.10), 0 24px 48px -12px rgba(43,31,18,0.50)",
        soft: "0 2px 12px rgba(43,31,18,0.06)",
        inner: "inset 0 1px 4px rgba(43,31,18,0.06)",
        "pin": "2px 2px 0 #2b1f12",
      },
    },
  },
  plugins: [],
};

export default config;
