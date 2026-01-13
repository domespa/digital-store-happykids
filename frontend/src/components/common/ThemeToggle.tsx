import { useTheme } from "../../context/ThemeContext";

// 1 DEIFIAMO LE PROPS
type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  // PRENDIAMO L'HELPER
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative
        p-2 
        rounded-lg 
        transition-all 
        duration-300
        hover:scale-110
        
        ${
          theme === "light"
            ? "bg-white border-2 border-gray-300 hover:bg-gray-50"
            : "bg-slate-800 border-2 border-slate-600 hover:bg-slate-700"
        }
        
        ${className}
      `}
      aria-label={`Passa al tema ${theme === "light" ? "scuro" : "chiaro"}`}
      title={`Passa al tema ${theme === "light" ? "scuro" : "chiaro"}`}
    >
      <span
        className={`
          text-2xl 
          transition-transform 
          duration-300
          inline-block
          ${theme === "light" ? "rotate-0" : "rotate-180"}
        `}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
