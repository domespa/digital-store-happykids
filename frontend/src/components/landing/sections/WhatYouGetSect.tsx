import { faBox } from "@fortawesome/free-solid-svg-icons";
import { useLandingContext } from "../../../context/LandingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function WhatYouGetSect() {
  const { config, isLoading } = useLandingContext();

  if (isLoading || !config) {
    return (
      <section className="py-12 bg-gray-200">
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
      className="py-12 lg:py-16 bg-gradient-to-br from-gray-200 via-slate-100 to-gray-100 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-base font-bold text-blue-600 mb-5">
            <span>
              <FontAwesomeIcon icon={faBox} />
            </span>
            <span>Complete Protocol Breakdown</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {contentPreview.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {contentPreview.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm sm:text-base text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl sm:text-2xl text-blue-600">
                {contentPreview.totalPages}
              </span>
              <span className="font-semibold">Pages</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl sm:text-2xl text-blue-600">
                {contentPreview.chapters.length}
              </span>
              <span className="font-semibold">Core Sections</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="font-semibold">30-Day System</span>
          </div>
        </div>

        {/* Chapter Breakdown - Compact */}
        <div className="mb-10 lg:mb-12 space-y-4">
          {contentPreview.chapters.map((chapter, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                {/* Chapter Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-md">
                    {chapter.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {chapter.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                {/* Chapter Highlights */}
                {chapter.highlights && chapter.highlights.length > 0 && (
                  <div className="mt-4 pl-12 sm:pl-16 space-y-2">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
                      What You'll Get:
                    </p>
                    {chapter.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
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

        {/* Bonuses Section - Compact */}
        {features.bonuses && features.bonuses.length > 0 && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 sm:p-8 text-white shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold mb-3">
                <span>🎁</span>
                <span>FREE Bonuses Included</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                Plus, You Get These Essential Tools
              </h3>
              <p className="text-sm sm:text-base text-white/90">
                Total Value: $
                {features.bonuses.reduce((sum, b) => sum + b.value, 0)} • Yours
                FREE
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {features.bonuses.map((bonus) => (
                <div
                  key={bonus.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 border-2 border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="text-2xl sm:text-3xl mb-2">{bonus.icon}</div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-base sm:text-lg leading-tight">
                      {bonus.title}
                    </h4>
                    <span className="text-xs font-bold bg-green-400 text-green-900 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                      ${bonus.value}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    {bonus.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Info Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-10 lg:mt-12">
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
              className="p-4 sm:p-5 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-center"
            >
              <div className="text-3xl sm:text-4xl mb-2">{feature.icon}</div>
              <h4 className="font-bold text-gray-900 mb-1 text-base sm:text-lg">
                {feature.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
