interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  size = "md",
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200",
    success:
      "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
    warning:
      "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
    danger: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300",
    info: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full transition-colors duration-200 ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
