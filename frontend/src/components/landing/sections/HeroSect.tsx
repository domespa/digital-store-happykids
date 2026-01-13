import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";

export default function HeroSectEmotional() {
  const landingContext = useLandingContext();
  const landingCart = useLandingCart({ landingContext });
  const { config, user, isLoading } = landingContext;

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52796F] mx-auto mb-4"></div>
          <p className="text-[#4A4A4A]">Loading...</p>
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

  const userCurrency = user?.currency || "USD";

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-[#F8F9FA] to-white relative overflow-hidden flex items-center py-8 lg:py-12">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#84A98C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Mobile-First Layout: Image First */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* IMAGE SECTION - First on mobile, right on desktop */}
          <div className="w-full order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#52796F]">
              <img
                src="/images/adhd-overwhelm-woman.jpg"
                alt="Woman with ADHD feeling overwhelmed"
                className="w-full h-auto"
              />
              {/* Overlay with emotion label */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <p className="text-xs text-[#4A4A4A] leading-relaxed">
                    Staring at your to-do list, feeling paralyzed, wondering why
                    everyone else seems to have it together...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION - Second on mobile, left on desktop */}
          <div className="w-full order-2 lg:order-1 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#52796F]/10 px-4 py-2 rounded-full text-sm font-semibold text-[#52796F]">
              <span>💚</span>
              <span>For Women with ADHD</span>
            </div>

            {/* Main Headline - Emotional Hook */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-[#1A1A1A]">
                Stop fighting your brain.
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#52796F]">
                Start working <em>with</em> it.
              </h2>
            </div>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#4A4A4A] leading-relaxed">
              A 30-day system designed specifically for women's ADHD brains -
              because you're not broken, you just need tools that actually work.
            </p>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-6 text-base text-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {["A", "M", "S", "J", "L"].map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#84A98C] to-[#52796F] border-2 border-white shadow-sm flex items-center justify-center text-white font-semibold text-xs"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span className="font-semibold">500+ women</span>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-[#FFB800] text-lg">
                    ★
                  </span>
                ))}
                <span className="relative inline-block text-lg">
                  <span className="text-gray-300">★</span>
                  <span
                    className="absolute top-0 left-0 text-[#FFB800] overflow-hidden inline-block"
                    style={{ width: "50%" }}
                  >
                    ★
                  </span>
                </span>
                <span className="ml-1 font-semibold">4.5/5</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                data-cta="main"
                onClick={landingCart.addMainProductToCart}
                disabled={landingCart.isLoading}
                className="group relative bg-[#52796F] hover:bg-[#3D5A51] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {landingCart.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Get the Guide</span>
                      <span className="text-xl">🛒</span>
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={() => {
                  const previewSection =
                    document.getElementById("what-you-get");
                  if (previewSection) {
                    const elementPosition =
                      previewSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="bg-transparent border-2 border-[#52796F] text-[#52796F] hover:bg-[#52796F] hover:text-white font-semibold text-base px-6 py-4 rounded-xl transition-all w-full sm:w-auto"
              >
                See What's Inside
              </button>
            </div>

            {/* Price & Value */}
            <div className="pt-2 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#1A1A1A]">
                  {landingCart.formatPrice(landingCart.mainPrice, userCurrency)}
                </span>
                <span className="text-xl text-[#4A4A4A] line-through opacity-60">
                  {landingCart.formatPrice(
                    landingCart.originalPrice,
                    userCurrency
                  )}
                </span>
                <span className="inline-flex items-center bg-[#52796F] text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save{" "}
                  {Math.round(
                    (1 - landingCart.mainPrice / landingCart.originalPrice) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#4A4A4A]">
                <div className="flex items-center gap-2">
                  <span className="text-[#52796F]">✓</span>
                  <span>Instant download</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#52796F]">✓</span>
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#52796F]">✓</span>
                  <span>30-day program</span>
                </div>
              </div>
            </div>

            {/* Trust Badges - Compact */}
            <div className="flex flex-wrap gap-4 text-sm pt-2">
              {[
                { text: "200+ Pages", icon: "📖" },
                { text: "Science-Based", icon: "🧬" },
                { text: "Digital Format", icon: "📱" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[#4A4A4A]">
                  <span className="text-base">{badge.icon}</span>
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Founder Story - Below on mobile, integrated */}
        <div className="mt-12 lg:mt-16 max-w-3xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-[#CAD2C5] shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-3xl">💭</div>
                <p className="text-sm font-semibold text-[#52796F] uppercase tracking-wide">
                  From Someone Who Gets It
                </p>
              </div>
              <p className="text-base text-[#1A1A1A] leading-relaxed text-center">
                I was diagnosed with ADHD at 29, after years of thinking I was
                just "lazy." Everything changed when I stopped trying to fix
                myself and started working <em>with</em> my brain. This guide is
                everything I wish someone had told me back then.
              </p>
              <p className="text-sm text-[#4A4A4A] italic text-center">
                - Created by a woman with ADHD, for women with ADHD
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
