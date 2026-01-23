import { useLandingContext } from "../../../context/LandingContext";
import { useLandingCart } from "../../../hooks/useLandingCart";
import FormattedPrice from "./FormattedPrice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faStar,
  faStarHalfStroke,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function HeroSect() {
  const { config, isLoading } = useLandingContext();
  const landingCart = useLandingCart();

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
    <section className="relative min-h-screen flex items-center py-10 lg:py-10 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

      <div className="container mx-auto px-6 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ========================================
              LEFT: IMAGE 
          ======================================== */}
          <div className="relative max-w-md mx-auto lg:max-w-lg">
            <div className="relative group">
              {/* Image Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-600">
                <img
                  src={config.hero.image}
                  alt="Screen Detox Protocol"
                  className="w-full h-[500px] sm:h-[600px] lg:h-[700px] object-cover"
                  loading="eager"
                />

                {/* Gradient Overlay Scuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                {/* Quote - Testo Bianco Brillante */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/60 backdrop-blur-lg rounded-xl p-4 shadow-2xl border border-white/30">
                    <p className="text-base font-bold text-white leading-relaxed mb-2">
                      "I just want my child back. The real one, not the zombie
                      staring at a screen."
                    </p>
                    <p className="text-sm text-white/90 italic font-medium">
                      Every parent who's used this guide
                    </p>
                  </div>
                </div>

                {/* Badge Pages - Scuro */}
                <div className="absolute top-6 right-6 bg-blue-600 text-white backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border-2 border-white">
                  <p className="text-sm font-black">117 Pages</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-6 py-4 shadow-2xl border-2 border-white">
              <p className="text-lg font-black">Complete System</p>
              <p className="text-sm font-bold">Everything Inside</p>
            </div>
          </div>
          {/* ========================================
              RIGHT: CONTENT
          ======================================== */}
          <div className="space-y-6 animate-slide-up">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-4xl font-black leading-tight text-gray-900">
                Your Child Is Disappearing Into a Screen. Get Your Child Back.
              </h1>

              {/* Subheadline */}
              <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-medium">
                {config.hero.subtitle}
              </p>
            </div>
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white px-3 py-4 sm:px-5 sm:py-5 rounded-xl shadow-md border border-gray-200 text-center">
                <span className="text-3xl sm:text-4xl block mb-2">🧠</span>
                <p className="font-bold text-gray-900 text-xs sm:text-base mb-1">
                  Research-Backed
                </p>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">
                  Behavioral psychology
                </p>
              </div>

              <div className="bg-white px-3 py-4 sm:px-5 sm:py-5 rounded-xl shadow-md border border-gray-200 text-center">
                <span className="text-3xl sm:text-4xl block mb-2">⚡</span>
                <p className="font-bold text-gray-900 text-xs sm:text-base mb-1">
                  Battle-Tested
                </p>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">
                  Real-world proven
                </p>
              </div>

              <div className="bg-white px-3 py-4 sm:px-5 sm:py-5 rounded-xl shadow-md border border-gray-200 text-center">
                <span className="text-3xl sm:text-4xl block mb-2">✅</span>
                <p className="font-bold text-gray-900 text-xs sm:text-base mb-1">
                  Complete System
                </p>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">
                  Zero guesswork
                </p>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                data-cta="hero-main"
                onClick={landingCart.addMainProductToCart}
                disabled={landingCart.isLoading}
                className="btn-primary group w-full sm:w-auto text-xl py-5 px-10"
              >
                <span className="relative flex items-center justify-center gap-3">
                  {landingCart.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{config.hero.ctaText}</span>
                      <span className="text-2xl group-hover:translate-x-1 transition-transform">
                        <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={() => {
                  const previewSection =
                    document.getElementById("what-you-get");
                  if (previewSection) {
                    previewSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-5 rounded-xl transition-all w-full sm:w-auto shadow-md hover:shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>See What's Inside</span>
                  <span className="text-xl">
                    <FontAwesomeIcon icon={faArrowDown} />
                  </span>
                </span>
              </button>
            </div>
            {/* Price & Value */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 space-y-4 border-2 border-blue-200 shadow-lg">
              {landingCart.isLoading ||
              landingCart.isConverting ||
              landingCart.mainPrice === 0 ? (
                // SKELETON LOADING
                <div className="space-y-4 animate-pulse">
                  <div className="flex items-baseline gap-3 flex-wrap justify-center">
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-green-200 rounded-full"></div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                // PREZZI REALI
                <>
                  <div className="flex items-baseline gap-3 flex-wrap justify-center">
                    {/* PREZZO PRINCIPALE - Grande con codice piccolo */}
                    <FormattedPrice
                      value={landingCart.formattedMainPrice}
                      className="text-4xl font-bold text-gray-900"
                      currencyClassName="text-xl font-normal opacity-60 ml-1"
                    />

                    {/* PREZZO ORIGINALE BARRATO - Medio con codice piccolo */}
                    <span className="text-2xl text-gray-600 line-through font-medium">
                      {landingCart.formattedOriginalPrice.split(" ")[0]}
                    </span>

                    <span className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-full text-base font-bold shadow-lg">
                      Save{" "}
                      {Math.round(
                        ((landingCart.originalPrice - landingCart.mainPrice) /
                          landingCart.originalPrice) *
                          100,
                      )}
                      %
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-base">
                    {[
                      {
                        icon: <FontAwesomeIcon icon={faDownload} />,
                        text: "Instant download",
                        color: "text-blue-500",
                      },
                      {
                        icon: "♾️",
                        text: "Lifetime access",
                        color: "text-blue-500",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-gray-900 font-bold"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {config.trustBar.stats.map((stat, i) => (
                <div key={i} className="card-modern p-4 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="font-black text-2xl text-blue-600 mb-1">
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
        {/* Trust Statement */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-5xl">💪</div>
                <p className="text-sm font-black text-blue-600 uppercase tracking-wider">
                  From a Parent Who's Been There
                </p>
              </div>

              <p className="text-lg text-gray-800 leading-relaxed text-center font-medium">
                I watched my 7-year-old turn into a stranger. Glassy eyes.
                Tantrums. No interest in anything real. I tried limits, rewards,
                negotiations...
                <span className="font-black text-gray-900">nothing worked</span>
                .
              </p>

              <p className="text-lg text-gray-800 leading-relaxed text-center font-medium">
                So I stopped guessing and built a protocol that actually worked.
                <p className="font-black text-gray-900 text-2xl">
                  30 days later, I had my son back.
                </p>
              </p>

              <div className="pt-6 border-t-2 border-gray-200">
                <p className="text-base text-gray-700 italic text-center font-medium">
                  This guide is everything I learned the hard way, so you don't
                  have to.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
