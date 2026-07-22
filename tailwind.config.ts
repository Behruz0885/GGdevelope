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
        // Core surfaces
        background: "#0a0a0f",
        surface: {
          DEFAULT: "#12121a",
          light: "#1a1a26",
          lighter: "#22222f",
        },
        // Text
        foreground: {
          DEFAULT: "#e6e6f0",
          muted: "#9ca3af",
          subtle: "#6b7280",
        },
        // Electric cyan accent
        accent: {
          DEFAULT: "#00e5ff",
          hover: "#33ebff",
          muted: "#0891a3",
        },
        // Purple secondary
        secondary: {
          DEFAULT: "#8b5cf6",
          hover: "#a78bfa",
          muted: "#6d28d9",
        },
        // Semantic
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        star: "#ffc107",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
        heading: [
          '"Space Grotesk Variable"',
          '"Inter Variable"',
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 229, 255, 0.35)",
        "glow-lg": "0 0 40px rgba(0, 229, 255, 0.45)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.35)",
        "glow-purple-lg": "0 0 40px rgba(139, 92, 246, 0.45)",
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #00e5ff 0%, #8b5cf6 100%)",
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
