interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = "", padding = true }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800 
        rounded-lg 
        border border-gray-200 dark:border-slate-700 
        shadow-sm 
        transition-colors duration-300
        ${padding ? "p-6" : ""} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
