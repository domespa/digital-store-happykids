import { useLandingContext } from "../../../context/LandingContext";

export default function ProblemsSect() {
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

  const problemColors = [
    {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "bg-red-500",
      dot: "text-red-500",
    },
    {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "bg-orange-500",
      dot: "text-orange-500",
    },
    {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "bg-amber-500",
      dot: "text-amber-500",
    },
    {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "bg-rose-500",
      dot: "text-rose-500",
    },
    {
      bg: "bg-pink-50",
      border: "border-pink-200",
      icon: "bg-pink-500",
      dot: "text-pink-500",
    },
    {
      bg: "bg-[#52796F]/10",
      border: "border-[#52796F]/20",
      icon: "bg-[#52796F]",
      dot: "text-[#52796F]",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-red-50/30 via-orange-50/30 to-yellow-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-semibold border border-red-200">
            <span>😰</span>
            <span>The ADHD Struggle</span>
          </div>
        </div>

        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {config.problems.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed mb-6">
            {config.problems.subtitle}
          </p>

          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 max-w-xl mx-auto border border-gray-200">
            <div className="text-4xl text-orange-200 leading-none mb-2">"</div>
            <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed mb-3">
              I always feel like I'm running behind, disorganized, like everyone
              else got a manual for life... and I didn't.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-semibold text-xs">
                S
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-900">Sarah, 32</p>
                <p className="text-xs text-gray-500">
                  Diagnosed with ADHD at 29
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-10 lg:mb-12">
          {config.problems.problems.map((problem, index) => {
            const colors = problemColors[index % problemColors.length];

            return (
              <div
                key={problem.id}
                className={`${colors.bg} rounded-xl shadow-md p-5 sm:p-6 border ${colors.border} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start mb-4">
                  <div
                    className={`${colors.icon} rounded-lg w-12 h-12 flex items-center justify-center text-2xl shadow-sm mr-3 flex-shrink-0`}
                  >
                    {problem.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {problem.title}
                  </h3>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  {problem.description}
                </p>

                <ul className="space-y-2">
                  {problem.painPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <span
                        className={`${colors.dot} mr-2 mt-1 flex-shrink-0 text-base`}
                      >
                        •
                      </span>
                      <span className="text-gray-700 text-xs leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="relative mb-10 lg:mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-200 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 mb-4 text-sm font-semibold">
              <span>✨</span>
              <span>There's Hope</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              You Don't Have to Live Like This
            </h3>

            <p className="text-sm sm:text-base text-gray-600 mb-5 max-w-xl mx-auto leading-relaxed">
              500+ women have already transformed their ADHD life from chaos to
              control.
            </p>

            <div className="inline-flex items-center gap-2 bg-green-50 px-5 py-3 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-green-700 font-semibold text-sm">
                Discover how you can do it too
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              number: "500+",
              label: "Women Transformed",
              icon: "👥",
              color: "teal",
            },
            {
              number: "4.5/5",
              label: "Average Rating",
              icon: "⭐",
              color: "cyan",
            },
            {
              number: "98%",
              label: "See Results by Week 2",
              icon: "💯",
              color: "blue",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-5 shadow-md border ${
                stat.color === "teal"
                  ? "border-teal-200"
                  : stat.color === "cyan"
                  ? "border-cyan-200"
                  : "border-blue-200"
              } hover:shadow-lg transition-shadow`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div
                className={`text-2xl sm:text-3xl font-bold mb-1 ${
                  stat.color === "teal"
                    ? "text-teal-600"
                    : stat.color === "cyan"
                    ? "text-cyan-600"
                    : "text-blue-600"
                }`}
              >
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-gray-700 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
