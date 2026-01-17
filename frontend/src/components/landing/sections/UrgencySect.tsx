import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import { useState, useEffect } from "react";

export default function UrgencySect() {
  const landingContext = useLandingContext();
  const landingCart = useLandingCart();
  const { config, isLoading } = landingContext;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!config?.urgency?.enabled) return;

    const timer = setInterval(() => {
      const end = new Date(config.urgency.endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  const handleAddToCart = () => {
    landingCart.addMainProductToCart();
  };

  if (isLoading || !config || !config.urgency?.enabled) return null;

  return (
    <section className="py-10 bg-gradient-to-br from-teal-600 to-cyan-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#52796F] px-5 py-2 rounded-full border-2 border-white text-sm font-semibold shadow-lg">
            <span>⚡</span>
            <span>{config.urgency.message}</span>
          </div>

          <p className="text-base font-semibold">
            {config.urgency.urgencyText}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="bg-white text-teal-600 rounded-lg p-4 min-w-[70px] border border-gray-200 shadow-md"
              >
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="text-xs uppercase font-semibold tracking-wide">
                  {unit}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={landingCart.isLoading}
              className="bg-white text-teal-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {landingCart.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Add to Cart -{" "}
                      {landingCart.formatPrice(
                        landingCart.mainPrice,
                        landingCart.userCurrency,
                      )}
                    </span>
                  </>
                )}
              </span>
            </button>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-sm">
              <svg
                className="w-4 h-4 text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Instant Download • Lifetime Access
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <div className="text-left">
                  <div className="text-base font-bold">500+</div>
                  <div className="text-xs opacity-90">Customers</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span>💯</span>
                <div className="text-left">
                  <div className="text-base font-bold">4.5/5</div>
                  <div className="text-xs opacity-90">Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span>🎉</span>
                <div className="text-left">
                  <div className="text-base font-bold">63% OFF</div>
                  <div className="text-xs opacity-90">Limited Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
