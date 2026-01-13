import { useLandingContext } from "../../../context/LandingContext";

export default function WhatYouGetSect() {
  const { config, isLoading } = useLandingContext();

  if (isLoading || !config) {
    return (
      <section className="py-12 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-[#CAD2C5] rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-[#CAD2C5] rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="what-you-get"
      className="py-16 lg:py-20 bg-[#F8F9FA] relative overflow-hidden"
    >
      {/* Subtle background  */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#84A98C] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            What's Inside the Guide
          </h2>
          <p className="text-lg sm:text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            A complete 30-day system designed specifically for women's ADHD
            brains.
          </p>
        </div>

        {/* Value Grid  */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 mb-12 border border-[#CAD2C5] shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Week by Week */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                30-Day Transformation
              </h3>

              <div className="space-y-4">
                {[
                  {
                    week: "Week 1",
                    title: "Reset Your Brain",
                    desc: "Understand your ADHD and stop fighting it",
                  },
                  {
                    week: "Week 2",
                    title: "Build Your System",
                    desc: "Simple tools that actually work for ADHD",
                  },
                  {
                    week: "Week 3",
                    title: "Handle Emotions",
                    desc: "Manage overwhelm without medication",
                  },
                  {
                    week: "Week 4",
                    title: "Stay Consistent",
                    desc: "Make it stick long-term",
                  },
                ].map((week, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-[#F8F9FA] rounded-xl border border-[#CAD2C5]"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#52796F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#52796F] uppercase tracking-wide mb-1">
                        {week.week}
                      </div>
                      <h4 className="font-bold text-[#1A1A1A] mb-1">
                        {week.title}
                      </h4>
                      <p className="text-sm text-[#4A4A4A]">{week.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: What You'll Learn */}
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                What You'll Master
              </h3>

              <div className="space-y-3">
                {[
                  "The 2-Minute Rule (stop procrastinating instantly)",
                  "Brain Dump Method (clear mental clutter)",
                  "Time Blocking for ADHD (that actually works)",
                  "Emotional Regulation Techniques (calm overwhelm)",
                  "Executive Function Tools (organize your life)",
                  "Hyperfocus Hacks (use it to your advantage)",
                  "Routine Building (without feeling trapped)",
                  "Self-Compassion Practices (stop beating yourself up)",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-[#52796F] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-[#1A1A1A] leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Section  */}
        <div className="bg-gradient-to-br from-[#52796F] to-[#3D5A51] rounded-2xl p-8 sm:p-10 text-white mb-12 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span>🎁</span>
              <span>Bonus Content</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              Plus, You'll Get These Free Bonuses
            </h3>
            <p className="text-lg text-white/90">
              Worth $67 • Yours free with the guide
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Quick-Win Techniques",
                desc: "20 strategies you can use today",
                value: "$29",
              },
              {
                title: "Daily Tracker Templates",
                desc: "Printable habit & mood trackers",
                value: "$19",
              },
              {
                title: "Emergency Toolkit",
                desc: "For meltdowns & overwhelm moments",
                value: "$19",
              },
              {
                title: "Lifetime Updates",
                desc: "New strategies added regularly",
                value: "Free",
              },
            ].map((bonus, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-lg">{bonus.title}</h4>
                  <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
                    {bonus.value}
                  </span>
                </div>
                <p className="text-sm text-white/80">{bonus.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Format Info */}
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: "📖",
              title: "200+ Pages",
              desc: "Comprehensive guide",
            },
            {
              icon: "📱",
              title: "Digital Format",
              desc: "Read on any device",
            },
            {
              icon: "⚡",
              title: "Instant Access",
              desc: "Download immediately",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-[#CAD2C5] shadow-sm"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-bold text-[#1A1A1A] mb-1">{feature.title}</h4>
              <p className="text-sm text-[#4A4A4A]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Final Note */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 max-w-2xl mx-auto border border-[#CAD2C5]">
            <p className="text-lg text-[#1A1A1A] leading-relaxed">
              <strong className="text-[#1A1A1A]">
                This isn't just information.
              </strong>{" "}
              It's a complete system you can start using today - designed by
              someone with ADHD, for women with ADHD.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
