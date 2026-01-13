import { useState, useEffect } from "react";

export default function SocialProofNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<{
    name: string;
    location: string;
    action: string;
    timeAgo: string;
  } | null>(null);

  // Expanded list of cities from different countries
  const locations = [
    // USA
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "Austin, TX",
    "Seattle, WA",
    "Denver, CO",
    "Boston, MA",
    "Portland, OR",
    "Nashville, TN",
    "Atlanta, GA",
    "Miami, FL",
    "Las Vegas, NV",
    // Canada
    "Toronto, ON",
    "Vancouver, BC",
    "Montreal, QC",
    "Calgary, AB",
    // UK
    "London, UK",
    "Manchester, UK",
    "Edinburgh, UK",
    "Birmingham, UK",
    // Europe
    "Paris, France",
    "Berlin, Germany",
    "Rome, Italy",
    "Madrid, Spain",
    "Amsterdam, Netherlands",
    "Barcelona, Spain",
    "Munich, Germany",
    "Vienna, Austria",
    "Dublin, Ireland",
    "Brussels, Belgium",
    // Australia
    "Sydney, Australia",
    "Melbourne, Australia",
    "Brisbane, Australia",
  ];

  // Diverse names (women-focused for ADHD audience)
  const names = [
    "Sarah",
    "Emily",
    "Jessica",
    "Amanda",
    "Rachel",
    "Jennifer",
    "Michelle",
    "Lauren",
    "Ashley",
    "Megan",
    "Stephanie",
    "Nicole",
    "Danielle",
    "Rebecca",
    "Samantha",
    "Katherine",
    "Elizabeth",
    "Christina",
    "Maria",
    "Lisa",
    "Amy",
    "Emma",
    "Olivia",
    "Sophia",
    "Isabella",
    "Charlotte",
    "Amelia",
    "Harper",
    "Evelyn",
    "Abigail",
    "Ella",
    "Scarlett",
    "Grace",
    "Chloe",
    "Victoria",
    "Riley",
    "Aria",
    "Lily",
    "Aubrey",
    "Zoey",
    "Nora",
    "Hannah",
    "Madison",
    "Layla",
    "Zoe",
    "Penelope",
    "Lillian",
    "Addison",
  ];

  const actions = [
    "just purchased the guide",
    "downloaded the ADHD guide",
    "joined the program",
    "started their transformation",
    "got instant access",
  ];

  const timeFrames = [
    "2 minutes ago",
    "5 minutes ago",
    "8 minutes ago",
    "12 minutes ago",
    "15 minutes ago",
    "18 minutes ago",
    "23 minutes ago",
    "28 minutes ago",
    "35 minutes ago",
    "42 minutes ago",
    "1 hour ago",
    "2 hours ago",
  ];

  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const generateNotification = () => {
    return {
      name: getRandomItem(names),
      location: getRandomItem(locations),
      action: getRandomItem(actions),
      timeAgo: getRandomItem(timeFrames),
    };
  };

  useEffect(() => {
    // Initial delay: 10-15 secondi (era 5-10)
    const initialDelay = Math.random() * 5000 + 10000; // 10-15 sec

    const initialTimer = setTimeout(() => {
      setCurrentNotification(generateNotification());
      setIsVisible(true);

      // Mostra per 6 secondi (era 5)
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    }, initialDelay);

    // Recurring: ogni 30-45 secondi (era 15-25)
    const recurringInterval = setInterval(() => {
      setCurrentNotification(generateNotification());
      setIsVisible(true);

      // Mostra per 6 secondi
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    }, Math.random() * 15000 + 30000); // 30-45 sec

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringInterval);
    };
  }, []);

  if (!currentNotification) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-[#CAD2C5] p-4 max-w-sm">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#84A98C] to-[#52796F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {currentNotification.name.charAt(0)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#1A1A1A] font-medium mb-1">
              <span className="font-semibold">{currentNotification.name}</span>{" "}
              <span className="text-[#4A4A4A]">from</span>{" "}
              <span className="font-semibold">
                {currentNotification.location}
              </span>
            </p>
            <p className="text-xs text-[#4A4A4A] mb-1">
              {currentNotification.action}
            </p>
            <p className="text-xs text-[#52796F] font-medium">
              🕐 {currentNotification.timeAgo}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
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

        {/* Trust badge */}
        <div className="mt-3 pt-3 border-t border-[#CAD2C5] flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-[#4A4A4A]">Verified purchase</span>
        </div>
      </div>
    </div>
  );
}
