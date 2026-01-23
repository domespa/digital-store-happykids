import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import { useState, useEffect } from "react";
import FormattedPrice from "./FormattedPrice";

export default function StickyCtaBar() {
  const landingContext = useLandingContext();
  const landingCart = useLandingCart();
  const { config } = landingContext;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // DEBUG
      console.log("📊 Scroll Y:", currentScrollY);

      // Lower threshold for easier testing: 300px instead of 800px
      if (currentScrollY > 300) {
        console.log("✅ Sticky bar should SHOW");
        setIsVisible(true);
      } else {
        console.log("❌ Sticky bar should HIDE");
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!config || !config.stickyBar?.enabled) {
    console.log("⚠️ StickyBar: Config disabled or missing");
    return null;
  }

  console.log("🎯 StickyBar render - isVisible:", isVisible);

  const savingsPercent = Math.round(
    ((landingCart.originalPrice - landingCart.mainPrice) /
      landingCart.originalPrice) *
      100,
  );

  return (
    <div
      id="sticky-cta-bar"
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t-2 border-gray-200 z-[40] transition-all duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>

      <div className="container mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            {/* Icon */}
            <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-lg items-center justify-center flex-shrink-0 border border-blue-200">
              <span className="text-2xl">📖</span>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 text-base sm:text-lg truncate">
                {config.stickyBar.text}
              </p>
              <div className="flex items-center gap-2 text-sm">
                {/* Price with FormattedPrice component */}
                <FormattedPrice
                  value={landingCart.formattedMainPrice}
                  className="font-bold text-blue-600 text-base"
                  currencyClassName="text-sm opacity-80"
                />

                {/* Original Price - strikethrough */}
                <span className="text-gray-400 line-through hidden sm:inline text-sm">
                  {landingCart.formattedOriginalPrice}
                </span>

                {/* Savings Badge */}
                <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold text-xs">
                  Save {savingsPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <button
            onClick={landingCart.addMainProductToCart}
            disabled={landingCart.isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex-shrink-0"
          >
            <span className="flex items-center gap-2">
              {landingCart.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Loading...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Get Protocol</span>
                  <span className="sm:hidden">Buy Now</span>
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
