import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormattedPrice from "./FormattedPrice";

export default function FinalCTA() {
  const { config } = useLandingContext();
  const landingCart = useLandingCart();

  if (!config || !config.finalCta) return null;

  return (
    <section
      id="final-cta"
      className="py-12 lg:py-16 bg-gradient-to-br from-gray-200 via-slate-100 to-gray-100 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 border-2 border-blue-600">
          {/* Header - CONFIDENT & LOGICAL */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm font-bold text-blue-600 mb-5">
              <span>✓</span>
              <span>You've Seen Everything</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-gray-900 leading-tight">
              Ready to Get Your Child Back?
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              You know what's inside. You know this works. You know your child
              needs this.
              <br className="hidden sm:block" />
              <strong className="text-gray-900">
                Now it's just a decision.
              </strong>
            </p>
          </div>

          {/* Recap Box - CLEAN */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-5 sm:p-6 mb-6 border-2 border-blue-200">
            <div className="text-center mb-5">
              <p className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wide mb-3">
                Everything You Get Today
              </p>
            </div>

            {/* Value Recap - COMPACT LIST */}
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Complete 30-Day Protocol
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    117 pages of step-by-step guidance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    50+ Tools & Scripts
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Activities, crisis management, word-for-word scripts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Crisis Management System
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    15 scenarios with exact solutions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Family Alignment Tools
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Co-parent worksheets & grandparent scripts
                  </p>
                </div>
              </div>
            </div>

            {/* Price - CLEAR */}
            <div className="pt-5 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Complete System
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    One-Time Payment:
                  </p>
                </div>
                <div className="text-right">
                  <FormattedPrice
                    value={landingCart.formattedMainPrice}
                    className="text-3xl sm:text-4xl font-bold text-blue-600"
                    currencyClassName="text-lg font-normal opacity-70"
                  />
                  <p className="text-xs text-gray-500 line-through mt-1">
                    {landingCart.formattedOriginalPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - CONFIDENT */}
          <button
            data-cta="final-cta"
            onClick={landingCart.addMainProductToCart}
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
                  <span>Yes, I Want The Complete System</span>
                  <span className="text-xl sm:text-2xl">
                    <FontAwesomeIcon icon={faCartArrowDown} />
                  </span>
                </>
              )}
            </span>
          </button>

          {/* Trust Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
            {[
              { icon: "⚡", text: "Instant Download" },
              { icon: "📱", text: "All Devices" },
              { icon: "♾️", text: "Lifetime Access" },
              { icon: "🔄", text: "Free Updates" },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-gray-200"
              >
                <div className="text-xl sm:text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs font-medium text-gray-900">
                  {feature.text}
                </div>
              </div>
            ))}
          </div>

          {/* Final Push - LOGICAL */}
          <div className="text-center pt-6 border-t-2 border-gray-200">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
              <strong className="text-gray-900">You've read everything.</strong>{" "}
              You know this is the system you need.
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900 mb-2">
              The only question left: Are you ready to act?
            </p>
            <p className="text-sm sm:text-base text-gray-600 italic">
              Join parents who decided to fix this instead of wait.
            </p>
          </div>

          {/* Stats Footer */}
          {config.finalCta.stats && config.finalCta.stats.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
              {config.finalCta.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
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
                  <span className="font-medium text-gray-900">{stat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-5 sm:px-6 py-3 rounded-full shadow-md border-2 border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-base sm:text-lg">
                ✓
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                Complete 30-Day System
              </p>
              <p className="text-xs text-gray-600">
                Research-backed • Battle-tested
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
