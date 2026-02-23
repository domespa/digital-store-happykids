import type { OnlineUser } from "../../../types/admin";

interface VisitorCardProps {
  visitor: OnlineUser;
  isOnline: boolean;
  onViewDetails?: () => void;
}

export default function VisitorCard({
  visitor,
  isOnline,
  onViewDetails,
}: VisitorCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={onViewDetails}
      className="flex items-center justify-between p-3 mb-2 
                 bg-white dark:bg-slate-800 
                 border border-gray-200 dark:border-slate-700 
                 rounded-lg 
                 hover:bg-gray-50 dark:hover:bg-slate-700 
                 hover:shadow-md 
                 transition-all cursor-pointer 
                 group"
    >
      {/* LEFT: Status + Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Status Dot */}
        <div
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
          }`}
        />

        {/* Visitor Info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            #{visitor.visitorNumber || "N/A"}
          </span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {visitor.location?.city || "Unknown"}
          </span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {visitor.location?.country || "Unknown"}
          </span>
        </div>
      </div>

      {/* RIGHT: Time + Arrow */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(visitor.connectedAt)}
        </span>

        {/* Arrow Icon */}
        <svg
          className="w-4 h-4 text-gray-400 dark:text-gray-500 
                     group-hover:text-blue-500 dark:group-hover:text-blue-400 
                     group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Online Badge (optional, only if online) */}
      {isOnline && (
        <span className="ml-2 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
          Online
        </span>
      )}
    </div>
  );
}
