import { useLandingContext } from "../../../context/LandingContext";
import { useState } from "react";

export default function ContentPreviewSect() {
  const { config, isLoading } = useLandingContext();
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  if (isLoading || !config || !config.contentPreview) return null;

  const chapterColors = [
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
      gradient: "from-teal-500 to-cyan-500",
      bg: "bg-teal-50",
      border: "border-teal-200",
    },
    {
      gradient: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
    },
    {
      gradient: "from-[#52796F] to-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      border: "border-green-200",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-teal-50/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-64 h-64 bg-teal-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-cyan-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-200 mb-4">
            <span>📚</span>
            <span>Inside the Program</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {config.contentPreview.title}
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {config.contentPreview.subtitle}
          </p>

          <div className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-base shadow-md">
            <span>{config.contentPreview.totalPages}+ Pages</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {config.contentPreview.chapters.map((chapter, index) => {
            const colors = chapterColors[index % chapterColors.length];
            const isExpanded = expandedChapter === chapter.number;

            return (
              <div
                key={chapter.number}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border ${
                  colors.border
                } ${isExpanded ? "ring-2 ring-teal-200" : ""}`}
              >
                <button
                  onClick={() =>
                    setExpandedChapter(isExpanded ? null : chapter.number)
                  }
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-lg flex flex-col items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm`}
                    >
                      <span className="text-xs opacity-80">Week</span>
                      <span className="text-lg">{chapter.number}</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {chapter.description}
                      </p>
                    </div>
                  </div>

                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isExpanded && chapter.highlights && (
                  <div
                    className={`px-5 sm:px-6 pb-5 sm:pb-6 border-t ${colors.border} ${colors.bg}`}
                  >
                    <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 mt-4">
                      What You'll Learn:
                    </div>

                    <ul className="space-y-2">
                      {chapter.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-start bg-white rounded-lg p-3 border border-gray-200"
                        >
                          <div
                            className={`w-5 h-5 bg-gradient-to-br ${colors.gradient} rounded flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}
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
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 lg:mt-12">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Ready to Start?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join 500+ women who've transformed their ADHD life
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                { text: "Instant Access", icon: "⚡" },
                { text: "Lifetime Updates", icon: "♾️" },
                { text: "All Devices", icon: "📱" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
                >
                  <span>{badge.icon}</span>
                  <span className="font-medium text-gray-700">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
