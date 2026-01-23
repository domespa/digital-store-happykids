import { useState, useEffect } from "react";
import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import FormattedPrice from "../sections/FormattedPrice";

export default function MobileStickyBar() {
  const [show, setShow] = useState(false);
  const { config } = useLandingContext();
  const landingCart = useLandingCart();

  useEffect(() => {
    const handleScroll = () => {
      // Show after 300px scroll (easier to trigger)
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show || !config) return null;

  const savingsPercent = Math.round(
    ((landingCart.originalPrice - landingCart.mainPrice) /
      landingCart.originalPrice) *
      100,
  );

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-gray-200 shadow-xl z-[40] transition-all duration-300">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Price Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <FormattedPrice
                value={landingCart.formattedMainPrice}
                className="text-2xl font-black text-blue-600"
                currencyClassName="text-lg font-bold opacity-80"
              />
              <span className="text-sm text-gray-400 line-through">
                {landingCart.formattedOriginalPrice}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600 font-medium">
                {config.contentPreview?.totalPages || 117}-page protocol
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold text-xs">
                Save {savingsPercent}%
              </span>
            </div>
          </div>

          {/* Right: CTA Button */}
          <button
            onClick={landingCart.addMainProductToCart}
            disabled={landingCart.isLoading}
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3.5 rounded-lg font-bold text-base shadow-lg transition-all disabled:opacity-50"
          >
            {landingCart.isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>...</span>
              </div>
            ) : (
              "Buy Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
