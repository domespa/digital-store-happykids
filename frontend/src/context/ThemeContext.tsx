import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// 1. DEFINIAMO I TIPI
type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// 2. CREIAMO IL CONTEXT
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. CREIAMO IL PROVIDER
type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  // 3.1 STATO TEMA + SALVATAGGIO
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    console.log(
      "🎬 ThemeProvider inizializzato con tema:",
      savedTheme || "light",
    );
    return savedTheme || "light";
  });

  // 3.2 USIAMO USEFFECT PER AGGIORNARE IL CODICE QUANDO THEME CAMBIA
  useEffect(() => {
    const root = window.document.documentElement;
    root.className = theme;

    localStorage.setItem("theme", theme);

    console.log("✅ Tema:", theme);
    console.log("✅ HTML:", root.className);
  }, [theme]);

  // 3.3 FUNZIONE PER CAMBIARE TEMA
  const toggleTheme = () => {
    console.log(
      "🔄 toggleTheme chiamata! Tema attuale PRIMA del toggle:",
      theme,
    );

    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      console.log("✨ Nuovo tema calcolato:", newTheme);
      return newTheme;
    });
  };

  // 3.4 DIAMOLO AI FIGLI
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. HELPER PER USARE LA FUNZIONE
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme deve essere usato dentro ThemeProvider");
  }

  return context;
}
