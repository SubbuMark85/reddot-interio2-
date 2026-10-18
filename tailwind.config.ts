import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#faf8f6",
          100: "#f6f3f0", // Primary Light background
          200: "#ebe5de",
          300: "#ded4c7",
          400: "#cbbaa7",
        },
        obsidian: {
          900: "#0d0d0d", // Primary Dark background
          800: "#141414",
          700: "#1a1a1a",
          600: "#242424",
          500: "#333333",
        },
        brand: {
          red: "#e5262d", // Signature Red accent
          redHover: "#c81e24",
          redSoft: "rgba(229, 38, 45, 0.12)",
          redGlow: "rgba(229, 38, 45, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
