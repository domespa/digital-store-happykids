export const screenDetoxTheme = {
  // Primary Gradient (Trust + Authority)
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Base
    600: "#2563eb", // Main CTA
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a", // Dark headers
  },

  // Success Gradient (Hope + Results)
  success: {
    50: "#d1fae5",
    100: "#a7f3d0",
    200: "#6ee7b7",
    300: "#34d399",
    400: "#10b981", // Main green
    500: "#059669",
    600: "#047857",
    700: "#065f46",
    800: "#064e3b",
    900: "#022c22",
  },

  // Warning/Urgency
  warning: {
    50: "#fef3c7",
    100: "#fde68a",
    200: "#fcd34d",
    300: "#fbbf24",
    400: "#f59e0b", // Main urgency
    500: "#d97706",
    600: "#b45309",
    700: "#92400e",
    800: "#78350f",
    900: "#451a03",
  },

  // Danger/Crisis
  danger: {
    50: "#fee2e2",
    100: "#fecaca",
    200: "#fca5a5",
    300: "#f87171",
    400: "#ef4444", // Main red
    500: "#dc2626",
    600: "#b91c1c",
    700: "#991b1b",
    800: "#7f1d1d",
    900: "#450a0a",
  },

  // Neutrals
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Gradients
  gradients: {
    hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    trust: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
    urgency: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    mesh: `
      radial-gradient(at 20% 30%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
      radial-gradient(at 80% 70%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
      radial-gradient(at 40% 80%, rgba(245, 158, 11, 0.1) 0px, transparent 50%)
    `,
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glow: "0 0 40px rgba(59, 130, 246, 0.3)",
  },

  // Glassmorphism
  glass: {
    light: "rgba(255, 255, 255, 0.1)",
    dark: "rgba(0, 0, 0, 0.1)",
    blur: "blur(10px)",
  },
};
