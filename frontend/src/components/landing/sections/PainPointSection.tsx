import { useLandingContext } from "../../../context/LandingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";

export default function PainPointSection() {
  const { config } = useLandingContext();

  if (!config) return null;

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-200 via-slate-100 to-gray-100 relative overflow-hidden">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full text-base font-bold text-red-600 mb-5">
            <span>
              <FontAwesomeIcon icon={faHeartCrack} />
            </span>
            <span>The Reality Check</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
            {config.problems.title}
          </h2>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            {config.problems.subtitle}
          </p>

          {/* Emotional Hook Box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5 sm:p-6">
            <p className="text-lg sm:text-xl font-bold text-gray-900 italic leading-relaxed">
              "{config.problems.emotionalHook}"
            </p>
          </div>
        </div>

        {/* Pain Points Grid */}
        {config.problems.problems.length > 0 && (
          <div className="mt-10 lg:mt-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
              Sound Familiar? You're Not Alone.
            </h3>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {config.problems.problems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-red-400 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
                >
                  {/* Problem Header */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <span className="text-3xl sm:text-4xl flex-shrink-0">
                      {problem.icon}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {problem.title}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  {/* Pain Points List */}
                  <div className="pl-10 sm:pl-12 space-y-2">
                    {problem.painPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="text-red-500 font-black mt-0.5 flex-shrink-0 text-base">
                          ✗
                        </span>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
