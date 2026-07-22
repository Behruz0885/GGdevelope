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
        // Dark futuristic gaming theme
        background: "#0a0a0f",
        surface: "#12121a",
        // Slightly raised surface for nested elements (cards on cards, inputs)
        "surface-2": "#1b1b26",
        border: "#26263a",
        accent: {
          DEFAULT: "#00e5ff", // electric cyan
          soft: "#33eaff",
          muted: "#0891a3",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // purple
          soft: "#a78bfa",
          muted: "#6d28d9",
        },
        foreground: "#e6e6f0",
        muted: "#8a8aa3",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 229, 255, 0.25)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.25)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(0,229,255,0.08), transparent 55%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.08), transparent 55%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
