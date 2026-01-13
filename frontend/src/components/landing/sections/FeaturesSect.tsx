import { useLandingContext } from "../../../context/LandingContext";

export default function FeaturesSect() {
  const { config, isLoading } = useLandingContext();

  if (isLoading || !config) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const featureColors = [
    {
      gradient: "from-teal-500 to-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-200",
    },
    {
      gradient: "from-cyan-500 to-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
    },
    {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      gradient: "from-[#52796F] to-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-teal-50/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-200">
            <span>💪</span>
            <span>What Makes This Different</span>
          </div>
        </div>

        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {config.features.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {config.features.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12 lg:mb-16">
          {config.features.features.map((feature, index) => {
            const colors = featureColors[index % featureColors.length];

            return (
              <div
                key={feature.id}
                className={`${colors.bg} rounded-xl shadow-md p-6 lg:p-8 border ${colors.border} transition-shadow hover:shadow-lg`}
              >
                <div className="flex items-start mb-5">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-lg flex items-center justify-center text-2xl mr-4 flex-shrink-0 shadow-sm`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="flex items-start bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded bg-gradient-to-br ${colors.gradient} flex items-center justify-center mr-3 mt-0.5`}
                      >
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
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {/* WEEK ROADMAP */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-200">
              <span>🗓️</span>
              <span>Your 30-Day Roadmap</span>
            </div>
          </div>

          <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-3">
            Your 30-Day Journey
          </h3>
          <p className="text-center text-gray-600 text-base mb-8 max-w-2xl mx-auto">
            Each week builds on the last - from stopping chaos to maintaining
            systems that last
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {/* WEEK 1 */}
            <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg mr-3 text-sm">
                  Week 1
                </div>
                <h4 className="font-bold text-teal-700 text-lg">Total Reset</h4>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Stop daily emergencies. Create your Safe Zone, build your
                Anti-Forgetting Station, and do your first Brain Dump.
              </p>
              <div className="flex items-center gap-2 text-xs text-teal-700 font-medium">
                <span>📅</span>
                <span>Days 1-7 • Chaos reduction focus</span>
              </div>
            </div>

            {/* WEEK 2 */}
            <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-cyan-600 text-white font-semibold px-4 py-2 rounded-lg mr-3 text-sm">
                  Week 2
                </div>
                <h4 className="font-bold text-cyan-700 text-lg">
                  Anti-Procrastination
                </h4>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Master the 2-Minute Rule, use Body Doubling, and learn to finish
                things at 60% instead of abandoning them.
              </p>
              <div className="flex items-center gap-2 text-xs text-cyan-700 font-medium">
                <span>🚀</span>
                <span>Days 8-14 • Momentum building</span>
              </div>
            </div>

            {/* WEEK 3 */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg mr-3 text-sm">
                  Week 3
                </div>
                <h4 className="font-bold text-blue-700 text-lg">
                  Overload Management
                </h4>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Learn to say no, manage sensory overload, achieve Email Zero,
                and batch tasks to stop context-switching.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                <span>🛡️</span>
                <span>Days 15-21 • Protection systems</span>
              </div>
            </div>

            {/* WEEK 4 */}
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg mr-3 text-sm">
                  Week 4
                </div>
                <h4 className="font-bold text-indigo-700 text-lg">
                  Sustainability
                </h4>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Build habit stacks, create your Sunday Reset, and learn the
                Comeback Protocol for when you fall off track.
              </p>
              <div className="flex items-center gap-2 text-xs text-indigo-700 font-medium">
                <span>🔄</span>
                <span>Days 22-30 • Long-term systems</span>
              </div>
            </div>
          </div>
        </div>

        {/* BONUSES (if any) */}
        {config.features.bonuses && config.features.bonuses.length > 0 && (
          <div className="mb-12 lg:mb-16">
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-8 lg:p-10 text-white shadow-lg border border-teal-500">
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                  Everything Included
                </h3>
                <p className="text-base text-teal-100">
                  No upsells. No hidden fees.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {config.features.bonuses.map((bonus) => (
                  <div
                    key={bonus.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl">{bonus.icon}</div>
                      <div className="bg-yellow-400 text-teal-900 px-3 py-1 rounded-full text-xs font-bold">
                        ${bonus.value}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{bonus.title}</h4>
                    <p className="text-sm text-teal-100 leading-relaxed">
                      {bonus.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-sm text-teal-100 mb-2">Total Value:</p>
                <div className="text-4xl font-bold text-yellow-400 mb-3">
                  $
                  {config.features.bonuses.reduce(
                    (total, bonus) => total + bonus.value,
                    0
                  )}
                </div>
                <div className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full font-semibold text-sm">
                  <span>✨</span>
                  <span>All included at no extra cost</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FINAL CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white rounded-xl p-8 lg:p-10 max-w-4xl mx-auto shadow-lg border border-teal-500">
            <div className="text-5xl mb-5">🎯</div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              200 Pages. 30 Days. Lifetime Transformation.
            </h3>
            <p className="text-base sm:text-lg mb-8 text-teal-100 max-w-2xl mx-auto">
              From chaos to clarity, procrastination to momentum, overwhelm to
              calm - everything you need in one complete system.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: "📖", number: "200 Pages", label: "Complete program" },
                { icon: "📅", number: "30 Days", label: "Structured journey" },
                { icon: "📝", number: "50+ Worksheets", label: "Ready to use" },
                {
                  icon: "🔄",
                  number: "Restart Protocols",
                  label: "When you fall off",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="font-bold text-base mb-1">{stat.number}</div>
                  <div className="text-xs text-teal-100">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="text-2xl">⚡</span>
                <div>
                  <strong>Instant Download</strong> - Start your transformation
                  in 2 minutes. Works on any device. Lifetime updates included.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
