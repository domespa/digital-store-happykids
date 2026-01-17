import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FinalCtaSect() {
  const { config } = useLandingContext();
  const landingCart = useLandingCart();

  if (!config || !config.finalCta) return null;

  return (
    <section
      id="final-cta"
      className="py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border-2 border-blue-600">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
              {config.finalCta.title}
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {config.finalCta.subtitle}
            </p>
          </div>

          {/* Value Recap */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 sm:p-8 mb-8 border-2 border-gray-200">
            <div className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-6 text-center">
              📦 Everything You're Getting Today
            </div>

            {/* Book Mockup - Centered */}
            <div className="flex justify-center mb-6">
              <div className="relative max-w-[180px] sm:max-w-[200px]">
                <div className="relative bg-white rounded-lg shadow-xl p-3 border-2 border-blue-600">
                  <img
                    src={config.hero?.image || "/cover.png"}
                    alt="Screen Detox Protocol"
                    className="w-full rounded"
                  />
                  {/* Badge */}
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    117 Pages
                  </div>
                </div>
              </div>
            </div>

            {/* Value Stack */}
            <div className="space-y-3 mb-6">
              {config.pricing.valueStack &&
              config.pricing.valueStack.length > 0 ? (
                config.pricing.valueStack.map((line, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-gray-900 bg-white rounded-lg px-4 py-2 border border-gray-200"
                  >
                    <span className="font-medium">{line.item}</span>
                    <span className="text-gray-600 font-semibold">
                      {line.value}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center text-gray-900">
                    <span className="font-medium">
                      Complete 117-Page Protocol
                    </span>
                    <span className="text-gray-600">$197</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900">
                    <span className="font-medium">
                      50 Screen-Free Activities
                    </span>
                    <span className="text-gray-600">$19</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900">
                    <span className="font-medium">
                      Crisis Management Scripts
                    </span>
                    <span className="text-gray-600">$17</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900">
                    <span className="font-medium">Quick Reference Guides</span>
                    <span className="text-gray-600">$27</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900">
                    <span className="font-medium">
                      Lifetime Access + Updates
                    </span>
                    <span className="text-gray-600">Priceless</span>
                  </div>
                </>
              )}
            </div>

            {/* Price Comparison */}
            <div className="pt-6 border-t-2 border-gray-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold text-gray-900">
                  Total Value:
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {landingCart.formattedOriginalPrice}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">
                  Your Price Today:
                </span>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">
                    {landingCart.formattedMainPrice}
                  </div>
                  <div className="text-sm text-green-600 font-bold">
                    Save{" "}
                    {Math.round(
                      ((landingCart.originalPrice - landingCart.mainPrice) /
                        landingCart.originalPrice) *
                        100,
                    )}
                    % Today
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            data-cta="final-cta"
            onClick={landingCart.addMainProductToCart}
            disabled={landingCart.isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <span className="flex items-center justify-center gap-3">
              {landingCart.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{config.finalCta.ctaText}</span>
                  <span className="text-2xl">
                    <FontAwesomeIcon icon={faCartArrowDown} />
                  </span>
                </>
              )}
            </span>
          </button>

          {/* Trust Line */}
          <div className="text-center text-sm text-gray-600 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-green-500"
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
            <p className="text-xs">
              One-time payment • No subscription • Lifetime access
            </p>
          </div>

          {/* Guarantee Box */}
          {/* <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-300 mb-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-3xl text-white">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  30-Day Money-Back Guarantee
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {config.finalCta.guaranteeText}
                </p>
              </div>
            </div>
          </div> */}

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { icon: "⚡", text: "Instant Download" },
              { icon: "📱", text: "All Devices" },
              { icon: "♾️", text: "Lifetime Access" },
              { icon: "🔄", text: "Free Updates" },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-3 bg-slate-50 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs font-medium text-gray-900">
                  {feature.text}
                </div>
              </div>
            ))}
          </div>

          {/* Final Emotional Push */}
          <div className="text-center pt-6 border-t-2 border-gray-200">
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              <strong className="text-gray-900">You've read this far.</strong>{" "}
              That means you know your child needs this. You're ready to act.
            </p>
            <p className="text-lg font-bold text-gray-900 mb-2">
              Your child is waiting on the other side of this.
            </p>
            <p className="text-base text-gray-600 italic">
              30 days from now, they can be the kid who builds forts again, not
              the zombie staring at a screen.
            </p>
          </div>

          {/* Stats */}
          {config.finalCta.stats && config.finalCta.stats.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              {config.finalCta.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
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

        {/* Bottom Social Proof */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-blue-600">
            <div className="flex -space-x-1">
              {["J", "M", "S", "D", "A"].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white shadow-sm flex items-center justify-center text-white font-semibold text-xs"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">
                    ★
                  </span>
                ))}
                <span className="relative inline-block text-sm">
                  <span className="text-gray-300">★</span>
                  <span
                    className="absolute top-0 left-0 text-yellow-400 overflow-hidden inline-block"
                    style={{ width: "80%" }}
                  >
                    ★
                  </span>
                </span>
              </div>
              <p className="text-xs text-gray-600">
                <strong className="text-gray-900">2,000+ parents</strong> got
                their kids back
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
