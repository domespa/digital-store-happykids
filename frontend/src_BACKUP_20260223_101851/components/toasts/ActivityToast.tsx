import { useEffect, useState } from "react";
import { X } from "lucide-react";

export interface ActivityToastProps {
  message: string;
  icon?: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function ActivityToast({
  message,
  icon = "💜",
  show,
  onClose,
  duration = 5000,
}: ActivityToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      // Entrance animation
      setTimeout(() => setIsVisible(true), 10);

      // Auto-dismiss
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose();
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      className={`
        fixed z-[9998]
        bottom-4 left-4
        sm:bottom-6 sm:left-6
        transition-all duration-300 ease-out
        ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }
      `}
      role="status"
      aria-live="polite"
    >
      <div
        className="
          flex items-center gap-2
          bg-white/95 backdrop-blur-sm
          border border-purple-100
          rounded-xl
          shadow-lg
          px-3 py-2.5
          sm:px-4 sm:py-3
          max-w-[280px] sm:max-w-[320px]
          hover:shadow-xl
          transition-shadow duration-200
        "
      >
        {/* Icon */}
        <div className="flex-shrink-0 text-base sm:text-lg">{icon}</div>

        {/* Message */}
        <p
          className="
            text-xs sm:text-sm
            text-gray-700
            font-medium
            leading-snug
            flex-1
          "
        >
          {message}
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="
            flex-shrink-0
            w-5 h-5
            flex items-center justify-center
            text-gray-400
            hover:text-gray-600
            transition-colors
            rounded-full
            hover:bg-gray-100
          "
          aria-label="Close notification"
        >
          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}
