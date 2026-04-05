/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        void: "#060608",
        surface: "#0e0e12",
        panel: "#14141a",
        border: "#1e1e28",
        accent: "#c8ff00",
        "accent-dim": "#a8d800",
        muted: "#4a4a5a",
        soft: "#9898b0",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
