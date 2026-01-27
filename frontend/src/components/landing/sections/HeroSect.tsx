import { useLandingContext } from "../../../context/LandingContext";
import {
  Brain,
  BrainCog,
  CircleCheckBig,
  Swords,
  Zap,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function HeroSect() {
  const { config, isLoading } = useLandingContext();

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (!config) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center text-red-600">
          <h1 className="text-xl font-bold">Configuration Error</h1>
          <p className="text-sm mt-2">Please contact support</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-8 sm:py-12 lg:py-16 overflow-hidden bg-[#122334]">
      <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>

      {/* CSS  */}
      <style>{`
          @keyframes dangerGlow {
            0%, 100% { 
              box-shadow: 0 0 30px rgba(239, 68, 68, 0.4),
                          0 0 60px rgba(239, 68, 68, 0.2);
            }
            50% { 
              box-shadow: 0 0 50px rgba(239, 68, 68, 0.6),
                          0 0 100px rgba(239, 68, 68, 0.3);
            }
          }

          @keyframes alertPulse {
            0%, 100% { 
              border-color: rgb(254, 202, 202);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
            }
            50% { 
              border-color: rgb(239, 68, 68);
              box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
            }
          }

          @keyframes textGlitch {
            0%, 96%, 100% { 
              transform: translate(0);
              opacity: 1;
            }
            97% { 
              transform: translate(-2px, 1px);
              opacity: 0.8;
            }
            98% { 
              transform: translate(2px, -1px);
              opacity: 0.9;
            }
            99% { 
              transform: translate(-1px, 2px);
              opacity: 0.85;
            }
          }

          .danger-glow {
            animation: dangerGlow 2.5s ease-in-out infinite;
          }

          .alert-pulse {
            animation: alertPulse 2s ease-in-out infinite;
          }

          .text-glitch {
            animation: textGlitch 15s ease-in-out infinite;
          }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-10 lg:mb-12">
          {/* LEFT: IMAGE */}
          <div className="relative max-w-md mx-auto lg:max-w-full">
            <div className="relative rounded-xl overflow-hidden shadow-xl danger-glow">
              <img
                src="/1.jpg"
                alt="Child lost in screen addiction"
                className="w-full h-auto object-cover"
                loading="eager"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                <div className="bg-black/70 backdrop-blur-md rounded-lg p-2.5 sm:p-3 shadow-xl border border-white/20">
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                    "I just want my child back. The real one."
                  </p>
                  <p className="text-xs text-white/90 italic font-medium mt-0.5">
                    Every parent fighting this
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: HEADLINE + PAIN BOX */}
          <div className="flex flex-col justify-center space-y-4 lg:space-y-5">
            {/* Main Headline  */}
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black leading-tight text-gray-50 text-glitch text-center">
              "I Just Want My Child Back"
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed font-medium text-center">
              The Step-by-Step Protocol That Breaks Screen Addiction
              <span className="block mt-1 text-gray-300 font-bold">
                Without Losing Your Sanity (Or Their Love)
              </span>
            </p>

            {/* Pain Recognition Box */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-5 alert-pulse">
              <p className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                Does this sound painfully familiar?
              </p>
              <div className="space-y-2.5 text-sm sm:text-base">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-black mt-0.5 text-base flex-shrink-0">
                    ✗
                  </span>
                  <p className="text-gray-800 font-medium">
                    90-minute tantrums when you take the tablet away
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-black mt-0.5 text-base flex-shrink-0">
                    ✗
                  </span>
                  <p className="text-gray-800 font-medium">
                    Glazed eyes, zombie mode, won't respond when you call
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-black mt-0.5 text-base flex-shrink-0">
                    ✗
                  </span>
                  <p className="text-gray-800 font-medium">
                    Can't play alone, constantly "I'm bored" without screens
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-black mt-0.5 text-base flex-shrink-0">
                    ✗
                  </span>
                  <p className="text-gray-800 font-medium">
                    Every limit you set fails. Every timer ends in a meltdown.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Cards */}
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
                {/* Trust Badge 1 */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 px-3 py-4 rounded-xl shadow-md border-2 border-blue-200 text-center hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <BrainCog
                          className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    <p className="font-black text-gray-900 text-sm mb-0.5">
                      Research-Backed
                    </p>
                    <p className="text-xs text-gray-700 font-medium">
                      Behavioral psychology
                    </p>

                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-green-500">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Trust Badge 2 */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 px-3 py-4 rounded-xl shadow-md border-2 border-orange-200 text-center hover:border-orange-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <Swords
                          className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    <p className="font-black text-gray-900 text-sm mb-0.5">
                      Battle-Tested
                    </p>
                    <p className="text-xs text-gray-700 font-medium">
                      Real-world proven
                    </p>

                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-green-500">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Trust Badge 3 */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-4 rounded-xl shadow-md border-2 border-green-200 text-center hover:border-green-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors">
                        <CircleCheckBig
                          className="w-6 h-6 text-green-600 group-hover:text-white transition-colors"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    <p className="font-black text-gray-900 text-sm mb-0.5">
                      Complete System
                    </p>
                    <p className="text-xs text-gray-700 font-medium">
                      Zero guesswork
                    </p>

                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-green-500">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
                          BOTTOM
        ======================================== */}
        <div className="space-y-6 lg:space-y-8">
          {/* Trust Statement */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 sm:p-7 border-2 border-red-200 shadow-lg">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-center gap-2.5 pb-3 border-b border-red-200">
                  <div className="text-3xl">⚠️</div>
                  <p className="text-xs font-black text-red-700 uppercase tracking-wider">
                    From a Parent Who's Been There
                  </p>
                  <div className="text-3xl">⚠️</div>
                </div>

                {/* Storia */}
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed text-center font-medium">
                  I watched my child turn into a stranger. <b>Glassy eyes</b>.{" "}
                  <b>Tantrums</b>. No interest in anything real. I tried limits,
                  rewards, negotiations...
                  <span className="font-black text-gray-900">
                    {" "}
                    nothing worked
                  </span>
                  .
                </p>

                <p className="text-sm sm:text-base text-gray-800 leading-relaxed text-center font-medium">
                  So I stopped guessing and built a protocol that actually
                  worked.
                </p>

                {/* Risultato */}
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <p className="font-black text-green-900 text-lg sm:text-xl text-center">
                    30 days later, I had my child back.
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-red-200">
                  <p className="text-xs sm:text-sm text-gray-700 italic text-center font-medium">
                    This guide is everything I learned the hard way, so you
                    don't have to.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {config.trustBar.stats.map((stat, i) => {
              const icons = [Brain, Zap, CheckCircle2, Users];
              const Icon = icons[i];

              const colors = [
                {
                  bg: "from-blue-50 to-cyan-50",
                  circle: "bg-blue-100",
                  circleHover: "group-hover:bg-blue-500",
                  icon: "text-blue-600",
                  iconHover: "group-hover:text-white",
                  border: "border-blue-200",
                  hover: "hover:border-blue-400",
                  text: "text-blue-600",
                  shadow: "shadow-blue-200/50",
                },
                {
                  bg: "from-orange-50 to-red-50",
                  circle: "bg-orange-100",
                  circleHover: "group-hover:bg-orange-500",
                  icon: "text-orange-600",
                  iconHover: "group-hover:text-white",
                  border: "border-orange-200",
                  hover: "hover:border-orange-400",
                  text: "text-orange-600",
                  shadow: "shadow-orange-200/50",
                },
                {
                  bg: "from-green-50 to-emerald-50",
                  circle: "bg-green-100",
                  circleHover: "group-hover:bg-green-500",
                  icon: "text-green-600",
                  iconHover: "group-hover:text-white",
                  border: "border-green-200",
                  hover: "hover:border-green-400",
                  text: "text-green-600",
                  shadow: "shadow-green-200/50",
                },
                {
                  bg: "from-purple-50 to-pink-50",
                  circle: "bg-purple-100",
                  circleHover: "group-hover:bg-purple-500",
                  icon: "text-purple-600",
                  iconHover: "group-hover:text-white",
                  border: "border-purple-200",
                  hover: "hover:border-purple-400",
                  text: "text-purple-600",
                  shadow: "shadow-purple-200/50",
                },
              ];

              return (
                <div key={i} className="relative group">
                  <div
                    className={`text-center bg-gradient-to-br ${colors[i].bg} rounded-xl p-4 shadow-lg ${colors[i].shadow} border-2 ${colors[i].border} ${colors[i].hover} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105`}
                  >
                    {/* Icon Circle */}
                    <div className="flex justify-center mb-3">
                      <div
                        className={`w-14 h-14 ${colors[i].circle} ${colors[i].circleHover} rounded-full flex items-center justify-center transition-colors`}
                      >
                        <Icon
                          className={`w-7 h-7 ${colors[i].icon} ${colors[i].iconHover} transition-colors`}
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    <div
                      className={`font-black text-xl sm:text-2xl ${colors[i].text} mb-1`}
                    >
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-700 font-bold leading-tight">
                      {stat.label}
                    </div>

                    {/* Badge angolo */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-green-500">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
