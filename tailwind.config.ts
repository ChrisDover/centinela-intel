import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        centinela: {
          bg: {
            primary: "#0a0e17",
            secondary: "#0f1420",
            card: "#141a28",
            "card-hover": "#1a2236",
          },
          border: {
            DEFAULT: "#1e2a3f",
            accent: "#2a3a55",
          },
          text: {
            primary: "#e8ecf4",
            secondary: "#8a96ad",
            muted: "#5a6680",
          },
          accent: {
            DEFAULT: "#00d4aa",
            dim: "rgba(0, 212, 170, 0.15)",
            glow: "rgba(0, 212, 170, 0.3)",
          },
          danger: "#ff4757",
          warning: "#ffb347",
          safe: "#00d4aa",
          info: "#4da6ff",
        },
      },
      fontFamily: {
        display: ["Instrument Serif", "serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
