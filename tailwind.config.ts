import type { Config } from "tailwindcss"
import { heroui } from "@heroui/theme/plugin"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#030712",
        surface: "#0b0f19",
        surface2: "#131927",
        accent: "#00f3ff",
        "accent-pink": "#ec4899",
        secondary: "#a855f7",
        muted: "#94a3b8",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(0, 243, 255, 0.3)",
        glowPurple: "0 0 30px rgba(168, 85, 247, 0.35)",
        glowPink: "0 0 30px rgba(236, 72, 153, 0.35)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 50% 0%, rgba(0, 243, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 45%, transparent 70%)",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
export default config
