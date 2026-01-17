import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import { useState, useEffect, useRef } from "react";

export default function StickyCtaBar() {
  const landingContext = useLandingContext();
  const landingCart = useLandingCart();
  const { config, user } = landingContext;
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Mostra solo dopo 800px
      if (currentScrollY < 800) {
        setIsVisible(false);
        return;
      }

      // Nasconde durante scroll attivo
      setIsScrolling(true);
      setIsVisible(false);

      // Clear timeout precedente
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Mostra dopo 1.5 secondi di inattività scroll
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        setIsVisible(true);
      }, 1500);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY]);

  if (!config || !config.stickyBar?.enabled) return null;

  const savingsPercent = Math.round(
    ((landingCart.originalPrice - landingCart.mainPrice) /
      landingCart.originalPrice) *
      100
  );

  return (
    <div
      id="sticky-cta-bar"
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 z-[40] transition-all duration-300 ${
        isVisible && !isScrolling ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex w-10 h-10 bg-teal-100 rounded-lg items-center justify-center flex-shrink-0">
              <span className="text-lg">🚀</span>
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {config.stickyBar.text}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-teal-600">
                  {landingCart.formattedMainPrice}
                </span>
                <span className="text-gray-400 line-through hidden sm:inline">
                  {landingCart.formattedOriginalPrice}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  {savingsPercent}% OFF
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={landingCart.addMainProductToCart}
            disabled={landingCart.isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0"
          >
            <span className="flex items-center gap-2">
              {landingCart.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Loading...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {config.stickyBar.ctaText}
                  </span>
                  <span className="sm:hidden">Add to Cart</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
