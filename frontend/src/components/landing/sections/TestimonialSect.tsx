import { useLandingContext } from "../../../context/LandingContext";

export default function ParentStrugglesSection() {
  const { config } = useLandingContext();

  if (!config) return null;

  // Real parent struggles - NO fake testimonials, just recognition
  const struggles = [
    {
      id: "tried-everything",
      quote:
        "I tried everything: timers, rewards, negotiations. Nothing works. The tantrums just get worse.",
      context: "Every limit you set fails",
    },
    {
      id: "partner-undermines",
      quote:
        "My partner thinks I'm overreacting. Or they undermine my limits. I'm fighting this battle alone.",
      context: "No family alignment",
    },
    {
      id: "expert-advice",
      quote:
        "Every parenting 'expert' says 'just set boundaries.' Yeah, thanks. That totally works when your child is screaming and you haven't slept in days.",
      context: "Advice doesn't match reality",
    },
    {
      id: "guilt",
      quote:
        "I gave them screens because I needed a break. Now I'm watching them lose their childhood in real-time.",
      context: "The crushing guilt",
    },
    {
      id: "cant-play",
      quote:
        "My child can't play independently anymore. 'I'm bored' becomes a constant refrain. They've forgotten how to entertain themselves.",
      context: "Lost ability to play",
    },
    {
      id: "workarounds",
      quote:
        "I tried parental controls. They found workarounds. I tried screen time limits. The tantrums got worse. I'm out of ideas.",
      context: "Everything failed",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-200 via-slate-100 to-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full text-base font-bold text-red-600 mb-5">
            <span>💔</span>
            <span>Does This Sound Like You?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            You're Not Alone in This Battle
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Every parent fighting screen addiction faces these exact struggles.
            The exhaustion. The guilt. The feeling that nothing works.
          </p>
        </div>

        {/* Struggles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 lg:mb-12">
          {struggles.map((struggle) => (
            <div
              key={struggle.id}
              className="bg-white rounded-xl p-5 sm:p-6 border-2 border-gray-200 hover:border-red-400 shadow-sm hover:shadow-md transition-all"
            >
              {/* Quote Icon */}
              <div className="text-red-200 text-4xl leading-none mb-3">"</div>

              {/* Struggle Quote */}
              <blockquote className="text-gray-900 text-sm sm:text-base leading-relaxed mb-4 font-medium">
                {struggle.quote}
              </blockquote>

              {/* Context Label */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {struggle.context}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recognition + Hope Box */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-green-50 rounded-xl p-6 sm:p-8 border-2 border-gray-200 shadow-md">
            <div className="text-center space-y-4">
              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed">
                If you recognized yourself in even one of these... you're
                exactly who this protocol was built for.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Not perfect parents. Not parents with unlimited time and energy.
              </p>

              <p className="text-lg sm:text-xl font-black text-gray-900">
                Exhausted, desperate parents who need a system that actually
                works.
              </p>

              <div className="pt-5 border-t-2 border-gray-300 mt-6">
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                  <span className="text-green-600 font-bold text-sm">
                    ✓ You're in the right place
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats - HONEST VERSION */}
        <div className="mt-10 lg:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          <div className="text-center p-4 sm:p-5 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
            <div className="text-3xl sm:text-4xl mb-2">📅</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
              30
            </div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">
              Days to Reset
            </div>
          </div>

          <div className="text-center p-4 sm:p-5 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
            <div className="text-3xl sm:text-4xl mb-2">📖</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
              117
            </div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">
              Pages Complete
            </div>
          </div>

          <div className="text-center p-4 sm:p-5 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
            <div className="text-3xl sm:text-4xl mb-2">🧠</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
              100%
            </div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">
              Research-Backed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
