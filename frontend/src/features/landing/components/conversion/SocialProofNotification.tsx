import { useState, useEffect } from "react";

export default function ActivityIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);

  // Check if user dismissed permanently
  useEffect(() => {
    const dismissed = localStorage.getItem("activity_indicator_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  // SUPER GENERIC activities - NO specific claims, NO purchases, NO locations, NO timestamps
  const activities = [
    "Someone is exploring the protocol",
    "Someone is reading the guide details",
    "Someone is reviewing Day 1-3 section",
    "Someone is checking the guarantee",
    "Someone is viewing parent tools",
    "Someone is reading the FAQ",
    "Someone is exploring the crisis scripts",
    "Someone is reviewing the 30-day system",
    "Someone is checking family alignment tools",
    "Someone is reading about screen-free activities",
    "Someone is viewing the chapter breakdown",
    "Someone is exploring the bonus materials",
    "Someone is reading about Hell Week",
    "Someone is checking co-parent worksheets",
    "Someone is reviewing troubleshooting scenarios",
    "Someone is exploring quick reference guides",
  ];

  const getRandomActivity = (): string => {
    return activities[Math.floor(Math.random() * activities.length)];
  };

  // True random interval - never same pattern
  const getRandomInterval = (minMs: number, maxMs: number): number => {
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  };

  useEffect(() => {
    if (isDismissed) return;

    let timeouts: NodeJS.Timeout[] = [];

    // Initial delay: 20-45 seconds (let user settle in)
    const initialDelay = getRandomInterval(20000, 45000);

    const initialTimer = setTimeout(() => {
      setCurrentActivity(getRandomActivity());
      setIsVisible(true);

      // Show for 5-7 seconds
      const showDuration = getRandomInterval(5000, 7000);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, showDuration);

      timeouts.push(hideTimer);
    }, initialDelay);

    timeouts.push(initialTimer);

    // Recurring notifications with EXTREME randomization
    const scheduleNext = () => {
      // Random interval: 4-12 minutes (VERY RARE)
      const nextInterval = getRandomInterval(240000, 720000); // 4-12 min

      const timer = setTimeout(() => {
        // Only 60% chance to show (extra randomness)
        if (Math.random() > 0.4) {
          setCurrentActivity(getRandomActivity());
          setIsVisible(true);

          // Random show duration
          const showDuration = getRandomInterval(5000, 7000);
          const hideTimer = setTimeout(() => {
            setIsVisible(false);
          }, showDuration);

          timeouts.push(hideTimer);
        }

        // Schedule next recursively
        scheduleNext();
      }, nextInterval);

      timeouts.push(timer);
    };

    // Start recurring after initial notification
    setTimeout(() => {
      scheduleNext();
    }, initialDelay + 10000);

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDismissForever = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("activity_indicator_dismissed", "true");
  };

  if (isDismissed || !currentActivity) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 max-w-[280px] sm:max-w-xs">
        <div className="flex items-start gap-3">
          {/* Activity Indicator - Pulsing Dot */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>

          {/* Content - VAGUE & GENERIC */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 font-medium leading-snug">
              {currentActivity}
            </p>
          </div>

          {/* Close X */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 -mt-0.5"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Dismiss Forever Link */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={handleDismissForever}
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition-colors"
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
}
