import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormattedPrice from "./FormattedPrice";
import { useLandingAnalytics } from "../../../hooks/useLandingAnalytics";

export default function EmotionalCTA() {
  const { config } = useLandingContext();
  const landingCart = useLandingCart();
  const { trackCtaClick } = useLandingAnalytics();

  if (!config) return null;

  return (
    <section
      id="emotional-cta"
      data-section-name="emotional_cta"
      className="py-12 lg:py-16 bg-gradient-to-br from-gray-200 via-slate-100 to-gray-100 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 border-2 border-red-400">
          {/* Header - URGENT & EMOTIONAL */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full text-sm font-bold text-red-600 mb-5">
              <span>⏰</span>
              <span>Every Day Makes This Harder</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-gray-900 leading-tight">
              Your Child Is Waiting on the Other Side of This
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              <strong className="text-gray-900">
                The longer you wait, the deeper the addiction gets.
              </strong>
              <br className="hidden sm:block" />
              Every day of delay makes this harder. Start today.
            </p>
          </div>

          {/* Value Stack Box - COMPACT */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-5 sm:p-6 mb-6 border-2 border-gray-200">
            {/* Grid: Cover Left + Value Stack Right */}
            <div className="grid md:grid-cols-5 gap-5 sm:gap-6 mb-5">
              {/* LEFT: Book Mockup */}
              <div className="md:col-span-2 flex justify-center items-start">
                <div className="relative max-w-[180px] sm:max-w-[200px] w-full">
                  <div className="relative bg-white rounded-lg shadow-lg p-3 border-2 border-blue-600">
                    <img
                      src={config.hero?.image || "/cover.png"}
                      alt="Screen Detox Protocol"
                      className="w-full rounded"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full px-2.5 py-1 text-xs font-bold shadow-md">
                      117 Pages
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Value Stack List */}
              <div className="md:col-span-3 space-y-2">
                {config.pricing.valueStack &&
                config.pricing.valueStack.length > 0
                  ? config.pricing.valueStack.slice(0, 5).map((line, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-gray-900 bg-white rounded-lg px-3 py-2 border border-gray-200"
                      >
                        <span className="font-medium text-xs sm:text-sm">
                          {line.item}
                        </span>
                        <span className="text-gray-600 font-semibold text-xs sm:text-sm">
                          {line.value}
                        </span>
                      </div>
                    ))
                  : null}

                {/* "+2 more bonuses" if more than 5 */}
                {config.pricing.valueStack &&
                  config.pricing.valueStack.length > 5 && (
                    <div className="text-center pt-2">
                      <span className="text-xs text-blue-600 font-bold">
                        +{config.pricing.valueStack.length - 5} more bonuses
                        included
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Price Comparison - PROMINENT */}
            <div className="pt-5 border-t-2 border-gray-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  Total Value:
                </span>
                <span className="text-lg sm:text-xl text-gray-500 line-through">
                  {landingCart.formattedOriginalPrice}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Your Price Today:
                </span>
                <div className="text-right">
                  <FormattedPrice
                    value={landingCart.formattedMainPrice}
                    className="text-3xl sm:text-4xl font-bold text-blue-600"
                    currencyClassName="text-xl font-normal opacity-70"
                  />
                  <div className="text-xs sm:text-sm text-green-600 font-bold mt-1">
                    Save{" "}
                    {Math.round(
                      ((landingCart.originalPrice - landingCart.mainPrice) /
                        landingCart.originalPrice) *
                        100,
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - URGENT */}
          <button
            data-cta="emotional-cta"
            onClick={() => {
              trackCtaClick("emotional_cta", { location: "emotional_section" });
              landingCart.addMainProductToCart();
            }}
            disabled={landingCart.isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-5"
          >
            <span className="flex items-center justify-center gap-3">
              {landingCart.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Get The Complete Protocol Now</span>
                  <span className="text-xl sm:text-2xl">
                    <FontAwesomeIcon icon={faCartArrowDown} />
                  </span>
                </>
              )}
            </span>
          </button>

          {/* Trust Elements */}
          <div className="space-y-4">
            {/* Instant Access */}
            <div className="text-center text-xs sm:text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-gray-900">
                  Secure Checkout • Instant Download
                </span>
              </div>
              <p className="text-xs">One-time payment • Lifetime access</p>
            </div>
          </div>

          {/* Emotional Push */}
          <div className="text-center pt-6 mt-6 border-t-2 border-gray-200">
            <p className="text-base sm:text-lg font-bold text-gray-900 mb-2">
              30 days from now, your child can be building forts again.
            </p>
            <p className="text-sm sm:text-base text-gray-600 italic">
              Not the zombie staring at a screen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
