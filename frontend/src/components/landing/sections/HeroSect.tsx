import { useLandingContext } from "../../../context/LandingContext";

export default function HeroSectV4() {
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* ========================================
            TOP: IMAGE (left) + TEXT (right)
        ======================================== */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-10 lg:mb-12">
          {/* LEFT: IMAGE */}
          <div className="relative max-w-md mx-auto lg:max-w-full">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img
                src="/1.jpg"
                alt="Child lost in screen addiction"
                className="w-full h-auto object-cover"
                loading="eager"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Quote Overlay */}
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
          <div className="space-y-4 lg:space-y-5">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black leading-tight text-gray-50">
              "I Just Want My Child Back"
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed font-medium">
              The Step-by-Step Protocol That Breaks Screen Addiction
              <span className="block mt-1 text-gray-300 font-bold">
                Without Losing Your Sanity (Or Their Love)
              </span>
            </p>

            {/* Pain Recognition Box */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-5">
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
            {/* Trust Cards + CTA Grid */}
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto m-auto">
                {/* Trust Badge 1 */}
                <div className="bg-white px-3 py-4 rounded-lg shadow-md border border-gray-200 text-center">
                  <span className="text-3xl block mb-1.5">🧠</span>
                  <p className="font-bold text-gray-900 text-sm mb-0.5">
                    Research-Backed
                  </p>
                  <p className="text-xs text-gray-700 font-medium">
                    Behavioral psychology
                  </p>
                </div>

                {/* Trust Badge 2 */}
                <div className="bg-white px-3 py-4 rounded-lg shadow-md border border-gray-200 text-center">
                  <span className="text-3xl block mb-1.5">⚡</span>
                  <p className="font-bold text-gray-900 text-sm mb-0.5">
                    Battle-Tested
                  </p>
                  <p className="text-xs text-gray-700 font-medium">
                    Real-world proven
                  </p>
                </div>

                {/* Trust Badge 3 */}
                <div className="bg-white px-3 py-4 rounded-lg shadow-md border border-gray-200 text-center">
                  <span className="text-3xl block mb-1.5">✅</span>
                  <p className="font-bold text-gray-900 text-sm mb-0.5">
                    Complete System
                  </p>
                  <p className="text-xs text-gray-700 font-medium">
                    Zero guesswork
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            BOTTOM: FULL WIDTH - CARDS + CTA
        ======================================== */}
        <div className="space-y-6 lg:space-y-8">
          {/* Trust Statement */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-amber-500 rounded-xl p-5 sm:p-6 border-2 border-gray-200 shadow-md">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center gap-2.5">
                  <div className="text-4xl sm:text-3xl">⚠️</div>
                  <p className="text-xs font-black text-red-800 uppercase tracking-wider">
                    From a Parent Who's Been There
                  </p>
                  <div className="text-4xl sm:text-3xl">⚠️</div>
                </div>

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

                <p className="font-black text-gray-900 text-lg sm:text-xl text-center">
                  30 days later, I had my child back.
                </p>

                <div className="pt-3 border-t-2 border-black">
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
            {config.trustBar.stats.map((stat, i) => (
              <div
                key={i}
                className="text-center bg-white rounded-lg p-3 shadow-sm border border-gray-100"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-black text-base sm:text-lg text-blue-600 mb-0.5">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-700 font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
