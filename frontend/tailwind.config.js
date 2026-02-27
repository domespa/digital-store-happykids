/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10b981", // Green-500
          hover: "#059669", // Green-600
          light: "#34d399", // Green-400
        },
        secondary: {
          DEFAULT: "#3b82f6", // Blue-500
          hover: "#2563eb", // Blue-600
          light: "#60a5fa", // Blue-400
        },
        accent: {
          yellow: "#fbbf24", // primary
          orange: "#fb923c", // Orange-400
          purple: "#a78bfa", // Purple-400
          teal: "#14b8a6", // Teal-500
        },

        text: {
          DEFAULT: "#1e293b", // Slate-800
          light: "#64748b", // Slate-500
          lighter: "#94a3b8", // Slate-400
        },
        border: {
          DEFAULT: "#e2e8f0", // Slate-200
          light: "#f1f5f9", // Slate-100
        },
        background: {
          DEFAULT: "#ffffff", // White
          gray: "#f8fafc", // Slate-50
        },
      },

      backgroundImage: {
        "gradient-success": "linear-gradient(to right, #10b981, #059669)",
        "gradient-trust": "linear-gradient(to right, #3b82f6, #14b8a6)",
        "gradient-warm": "linear-gradient(to right, #fbbf24, #fb923c)",
        "gradient-creative": "linear-gradient(to right, #a78bfa, #ec4899)",
      },
    },
  },
  plugins: [],
};
