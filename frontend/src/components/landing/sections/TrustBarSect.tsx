import { useLandingContext } from "../../../context/LandingContext";

export default function TrustBarSect() {
  const { config, isLoading } = useLandingContext();

  if (isLoading || !config || !config.trustBar) return null;

  const statColors = [
    {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-600",
      icon: "bg-teal-600",
    },
    {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-600",
      icon: "bg-cyan-600",
    },
    {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      icon: "bg-blue-600",
    },
    {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      icon: "bg-indigo-600",
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-sm font-semibold">
            <span>📊</span>
            <span>By the Numbers</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {config.trustBar.stats.map((stat, idx) => {
            const colors = statColors[idx % statColors.length];

            return (
              <div
                key={idx}
                className={`${colors.bg} rounded-lg p-5 border ${colors.border} hover:shadow-md transition-shadow`}
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 ${colors.icon} rounded-lg text-white text-xl mb-3`}
                >
                  {stat.icon}
                </div>

                <div
                  className={`text-2xl md:text-3xl font-bold ${colors.text} mb-1`}
                >
                  {stat.number}
                </div>

                <div className="text-xs font-medium text-gray-700 leading-tight">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {config.trustBar.trustedBy && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-5 py-2 rounded-full border border-gray-200">
              <span>💜</span>
              <p className="text-sm text-gray-700">
                {config.trustBar.trustedBy}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
