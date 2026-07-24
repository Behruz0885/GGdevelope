import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0b0f",
        surface: "#12141c",
        surface2: "#1a1d29",
        border: "#262a38",
        accent: "#6366f1",
        "accent-hover": "#4f46e5",
        success: "#22c55e",
        warn: "#f59e0b",
        danger: "#ef4444",
        muted: "#8b90a3",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(99,102,241,0.4), 0 8px 30px -8px rgba(99,102,241,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
