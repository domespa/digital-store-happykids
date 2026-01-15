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
        transition-all 
        duration-300
        hover:scale-110
        
        ${theme === "light" ? " hover:bg-gray-50" : " hover:bg-slate-700"}
        
        ${className}
      `}
      aria-label={`Passa al tema ${theme === "light" ? "scuro" : "chiaro"}`}
      title={`Passa al tema ${theme === "light" ? "scuro" : "chiaro"}`}
    >
      <span
        className={`
          text-lg
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
