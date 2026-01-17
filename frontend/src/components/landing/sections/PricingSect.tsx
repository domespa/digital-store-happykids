import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";

interface PricingSect {
  className?: string;
}

export default function PricingSect({}: PricingSect = {}) {
  const { config, isLoading: isLoadingUser } = useLandingContext();
  const landingCart = useLandingCart();

  if (isLoadingUser || !config || landingCart.isLoadingProduct) {
    return (
      <div className="flex justify-center items-center py-20 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const savings = landingCart.calculateSaving();

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-teal-50/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-200">
            <span>💎</span>
            <span>Introductory Pricing</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {config.pricing.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            {config.pricing.subtitle}
          </p>
        </div>

        <div className="relative">
          <div className="relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-200">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-[#52796F] text-white px-5 py-2 rounded-full font-semibold text-xs shadow-md">
                Limited Time Offer
              </div>
            </div>

            {/* Loading State */}
            {(landingCart.isLoading || landingCart.isConverting) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 text-sm font-medium">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>
                    Updating prices for {landingCart.displayCurrency}...
                  </span>
                </div>
              </div>
            )}

            {/* Price Display */}
            <div className="text-center mb-8 pt-4">
              <div className="inline-block bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-5 mb-5">
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                  Regular Price
                </div>
                <div className="text-2xl font-bold text-gray-400 line-through mb-3">
                  {landingCart.formattedOriginalPrice}
                </div>
                <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">
                  Your Price Today
                </div>
                <div className="text-5xl font-bold text-teal-600">
                  {landingCart.formattedMainPrice}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-2">
                  One-time payment • Lifetime access
                </div>
              </div>

              {/* Savings Badge */}
              {savings && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-xl border border-green-200">
                  <span className="text-2xl">🎉</span>
                  <div className="text-left">
                    <div className="text-xs text-green-700 font-medium">
                      You Save
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {landingCart.formatPrice(savings.savings)} (
                      {savings.savingsPercentage}%)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="bg-teal-50 rounded-xl p-5 sm:p-6 mb-6 border border-teal-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Everything Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {config.pricing.included.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="w-5 h-5 bg-teal-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {config.pricing.highlights.map((highlight, index) => {
                const colors = [
                  { bg: "bg-teal-50", border: "border-teal-200" },
                  { bg: "bg-cyan-50", border: "border-cyan-200" },
                  { bg: "bg-blue-50", border: "border-blue-200" },
                  { bg: "bg-indigo-50", border: "border-indigo-200" },
                ];
                const color = colors[index % colors.length];

                return (
                  <div
                    key={index}
                    className={`${color.bg} rounded-lg p-4 border ${color.border}`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="text-2xl flex-shrink-0">
                        {highlight.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 text-base">
                          {highlight.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="text-center space-y-5">
              <button
                onClick={landingCart.addMainProductToCart}
                disabled={landingCart.isLoading}
                className={`
                  w-full py-5 px-8 rounded-xl text-lg font-semibold text-white 
                  transition-all transform hover:scale-[1.02] shadow-lg
                  ${
                    landingCart.isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                  }
                `}
              >
                <span className="flex items-center justify-center gap-2">
                  {landingCart.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Instant Access</span>
                      <svg
                        className="w-5 h-5"
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

              {/* Guarantees Box */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xl">🔒</span>
                  <h4 className="font-bold text-gray-900 text-base">
                    Secure Purchase
                  </h4>
                </div>
                <div className="space-y-2">
                  {config.pricing.guarantees.map((guarantee, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center gap-2 text-gray-700"
                    >
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm">{guarantee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <div className="flex items-center gap-2 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200">
                  <span>⭐</span>
                  <span className="font-semibold text-teal-700">
                    500+ Customers
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-cyan-50 px-3 py-2 rounded-lg border border-cyan-200">
                  <span>💯</span>
                  <span className="font-semibold text-cyan-700">
                    4.5/5 Rating
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <span>🔐</span>
                  <span className="font-semibold text-blue-700">
                    Secure Checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Element */}
        <div className="mt-10 text-center">
          <div className="inline-block bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200 max-w-xl">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Start in 2 Minutes
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Instant digital download. Works on any device. Lifetime access
              with all updates included.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
