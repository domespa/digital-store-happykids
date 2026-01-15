import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";

export default function WhatYouGetSect() {
  const { config, isLoading } = useLandingContext();
  const landingCart = useLandingCart();

  if (isLoading || !config) {
    return (
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const { contentPreview, features } = config;

  return (
    <section
      id="what-you-get"
      className="py-16 lg:py-20 bg-slate-50 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm font-bold text-blue-600 mb-6">
            <span>📦</span>
            <span>Complete Protocol Breakdown</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {contentPreview.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {contentPreview.subtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 text-gray-700">
            <span className="font-bold text-2xl text-blue-600">
              {contentPreview.totalPages} Pages
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-semibold">
              {contentPreview.chapters.length} Core Sections
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-semibold">
              30 days of step-by-step guidance
            </span>
          </div>
        </div>

        {/* Chapter Breakdown - Accordion Style */}
        <div className="mb-12 lg:mb-16 space-y-4">
          {contentPreview.chapters.map((chapter, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                {/* Chapter Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                    {chapter.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                {/* Chapter Highlights */}
                {chapter.highlights && chapter.highlights.length > 0 && (
                  <div className="mt-6 pl-16 space-y-3">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                      What You'll Get:
                    </p>
                    {chapter.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
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
                        <span className="text-gray-700 leading-relaxed">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Why This Works - Features Grid */}
        {features.features.length > 0 && (
          <div className="mb-12 lg:mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {features.title}
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {features.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.features.map((feature, i) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-xl p-6 sm:p-8 border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-base text-gray-600 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {feature.benefits && feature.benefits.length > 0 && (
                    <div className="space-y-2 pl-14">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-sm text-gray-700">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bonus Section */}
        {features.bonuses.length > 0 && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-10 lg:p-12 text-white mb-12 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
                <span>🎁</span>
                <span>FREE Bonuses Included</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Plus, You Get These Essential Tools
              </h3>
              <p className="text-lg text-white/90">
                Total Value: $
                {features.bonuses.reduce((sum, b) => sum + b.value, 0)} • Yours
                FREE
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.bonuses.map((bonus, i) => (
                <div
                  key={bonus.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="text-3xl mb-3">{bonus.icon}</div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg">{bonus.title}</h4>
                    <span className="text-sm font-bold bg-green-400 text-green-900 px-2 py-1 rounded ml-2">
                      ${bonus.value}
                    </span>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {bonus.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bonus CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={landingCart.addMainProductToCart}
                disabled={landingCart.isLoading}
                className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50"
              >
                {landingCart.isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Get Everything Now - ${landingCart.mainPrice}
                    <span className="text-xl">→</span>
                  </span>
                )}
              </button>
              <p className="text-sm text-white/80 mt-3">
                ✓ Instant download • ✓ All bonuses included
              </p>
            </div>
          </div>
        )}

        {/* Format Info */}
        <div className="grid sm:grid-cols-3 gap-6 text-center mb-12">
          {[
            {
              icon: "📖",
              title: `${contentPreview.totalPages}+ Pages`,
              desc: "Complete step-by-step guide",
            },
            {
              icon: "📱",
              title: "Any Device",
              desc: "Read on phone, tablet, or print",
            },
            {
              icon: "⚡",
              title: "Instant Access",
              desc: "Download in 60 seconds",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-bold text-gray-900 mb-1 text-lg">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Final Trust Statement */}
        {/* <div className="text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl shadow-lg p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4 justify-center mb-4">
              <span className="text-4xl flex-shrink-0">🛡️</span>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-900 mb-2">
                  Zero Risk. 100% Guaranteed.
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  Try the complete protocol for 30 days. If you follow the guide
                  and it doesn't help you break your child's screen addiction,
                  we'll refund every penny. No questions asked, no hassle.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-green-200 mt-4">
              <p className="text-sm text-gray-600 italic">
                "The only risk is staying stuck where you are now—watching your
                child disappear into a screen while you feel helpless."
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
