import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        accent: "#FFD700",
        text: "#ffffff",
        muted: "#888888",
        card: "#161616",
        border: "#222222",
        cyan: "#00d9ff",
        yellow: "#ffd700",
      },
      fontFamily: {
        display: ["var(--font-roboto-condensed)", "var(--font-bebas)", "sans-serif"],
        condensed: ["var(--font-roboto-condensed)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        orbFloat: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-28px) scale(1.05)" },
        },
        livePulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
        lSlide: {
          from: { transform: "translateY(110%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        hReveal: {
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        orbFloat: "orbFloat 6s ease-in-out infinite",
        livePulse: "livePulse 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
