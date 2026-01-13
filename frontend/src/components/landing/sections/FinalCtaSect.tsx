import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";

export default function FinalCtaSect() {
  const landingContext = useLandingContext();
  const landingCart = useLandingCart({ landingContext });
  const { config, user } = landingContext;

  if (!config || !config.finalCta) return null;

  const userCurrency = user?.currency || "USD";

  return (
    <section className="py-16 lg:py-20 bg-[#FFF4ED] relative overflow-hidden">
      {/* Subtle background - CORAL TONES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#84A98C] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-[#CAD2C5]">
          {/* Header - WARM BROWNS */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#1A1A1A] leading-tight">
              Ready to Stop Fighting Your ADHD Brain?
            </h2>

            <p className="text-lg sm:text-xl text-[#4A4A4A] leading-relaxed max-w-2xl mx-auto">
              Join 500+ women who've already transformed their relationship with
              ADHD.
            </p>
          </div>

          {/* Value Recap - CREAM BOX WITH BOOK MOCKUP */}
          <div className="bg-[#F8F9FA] rounded-xl p-6 sm:p-8 mb-8 border border-[#CAD2C5]">
            <div className="text-sm font-semibold text-[#4A4A4A] uppercase tracking-wide mb-4 text-center">
              What You're Getting Today
            </div>

            {/* Book Mockup - Small & Centered */}
            <div className="flex justify-center mb-6">
              <div className="relative max-w-[160px] sm:max-w-[180px]">
                <div className="relative bg-white rounded-lg shadow-lg p-2 sm:p-3 border border-[#CAD2C5]">
                  <img
                    src={config.hero?.image || "/cover.png"}
                    alt="ADHD Guide"
                    className="w-full rounded"
                  />
                  {/* Small floating badge */}
                  <div className="absolute -top-2 -right-2 bg-[#52796F] text-white rounded-full px-2 py-1 text-xs font-bold shadow-md">
                    200+
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { item: "30-Day ADHD Transformation Program", value: "$97" },
                { item: "Science-Based Daily Strategies", value: "$47" },
                { item: "Executive Function Tools & Templates", value: "$39" },
                { item: "Bonus: Quick-Win Techniques Guide", value: "$29" },
                { item: "Lifetime Access + Updates", value: "$67" },
              ].map((line, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-[#1A1A1A]"
                >
                  <span className="font-medium">{line.item}</span>
                  <span className="text-[#4A4A4A]">{line.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#CAD2C5]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold text-[#1A1A1A]">
                  Total Value:
                </span>
                <span className="text-xl text-[#4A4A4A] line-through">
                  {landingCart.formatPrice(
                    landingCart.originalPrice,
                    userCurrency
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#1A1A1A]">
                  Your Price Today:
                </span>
                <div className="text-right">
                  <div className="text-4xl font-bold text-[#52796F]">
                    {landingCart.formatPrice(
                      landingCart.mainPrice,
                      userCurrency
                    )}
                  </div>
                  <div className="text-sm text-[#10B981] font-semibold">
                    Save{" "}
                    {Math.round(
                      ((landingCart.originalPrice - landingCart.mainPrice) /
                        landingCart.originalPrice) *
                        100
                    )}
                    % Today
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - CORAL */}
          <button
            onClick={landingCart.addMainProductToCart}
            disabled={landingCart.isLoading}
            className="w-full bg-[#52796F] hover:bg-[#3D5A51] text-white px-8 py-5 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <span className="flex items-center justify-center gap-3">
              {landingCart.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Start Your Transformation Now</span>
                  <span className="text-2xl">🛒</span>
                </>
              )}
            </span>
          </button>

          {/* Trust Line */}
          <div className="text-center text-sm text-[#4A4A4A] mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-[#10B981]"
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
                Secure checkout • Instant access
              </span>
            </div>
            <p className="text-xs">
              One-time payment • No subscription • Lifetime access
            </p>
          </div>

          {/* Guarantee - LIGHT CORAL BOX */}
          <div className="bg-[#FFF4ED] rounded-xl p-6 border border-[#CAD2C5] mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#52796F] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-white">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">
                  30-Day Money-Back Guarantee
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  {config.finalCta.guaranteeText ||
                    "Try the guide risk-free for 30 days. If it doesn't help you manage your ADHD better, we'll refund every penny. No questions asked."}
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid - CREAM BOXES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { icon: "⚡", text: "Instant Download" },
              { icon: "📱", text: "All Devices" },
              { icon: "♾️", text: "Lifetime Access" },
              { icon: "🔄", text: "Free Updates" },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-3 bg-[#F8F9FA] rounded-lg border border-[#CAD2C5]"
              >
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs font-medium text-[#1A1A1A]">
                  {feature.text}
                </div>
              </div>
            ))}
          </div>

          {/* Final Push - Emotional */}
          <div className="text-center pt-6 border-t border-[#CAD2C5]">
            <p className="text-base text-[#4A4A4A] leading-relaxed mb-4">
              <strong className="text-[#1A1A1A]">You've read this far.</strong>{" "}
              That means something clicked. You're ready for a change.
            </p>
            <p className="text-lg font-semibold text-[#1A1A1A]">
              Your ADHD brain isn't broken. It just needs the right tools.
            </p>
          </div>
        </div>

        {/* Bottom Social Proof - CORAL AVATARS WITH GOLD STARS */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-[#CAD2C5]">
            <div className="flex -space-x-1">
              {["A", "M", "S", "J", "L"].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#84A98C] to-[#52796F] border-2 border-white shadow-sm flex items-center justify-center text-white font-semibold text-xs"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-[#FFB800] text-sm">
                    ★
                  </span>
                ))}
                <span className="relative inline-block text-sm">
                  <span className="text-gray-300">★</span>
                  <span
                    className="absolute top-0 left-0 text-[#FFB800] overflow-hidden inline-block"
                    style={{ width: "50%" }}
                  >
                    ★
                  </span>
                </span>
              </div>
              <p className="text-xs text-[#4A4A4A]">
                <strong className="text-[#1A1A1A]">500+ women</strong>{" "}
                transformed their ADHD
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
