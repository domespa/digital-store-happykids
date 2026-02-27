import {
  Download,
  Printer,
  Smile,
  ArrowRight,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";
import { useLandingCart } from "../../../../hooks/useLandingCart";

export default function HowItWorksW() {
  const { addMainProductToCart, formatPrice, isLoading, mainPrice } =
    useLandingCart();

  const handleAddToCart = () => {
    addMainProductToCart(true);
  };

  const steps = [
    {
      number: 1,
      icon: Download,
      title: "Download Instantly",
      description:
        "Get immediate access to all 5 workbooks (295 pages) in PDF format. No waiting, no shipping delays.",
      time: "2 minutes",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-500",
      features: [
        "5 complete workbooks (PDF)",
        "295 pages total",
        "Instant email delivery",
      ],
    },
    {
      number: 2,
      icon: Printer,
      title: "Print What You Need",
      description:
        "Print unlimited copies at home or at a print shop. Use with multiple kids, save originals, print extras.",
      time: "5 minutes",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      iconColor: "text-purple-500",
      features: [
        "Print unlimited times",
        "Works for all your kids",
        "No subscription needed",
      ],
    },
    {
      number: 3,
      icon: Smile,
      title: "Watch Them Learn",
      description:
        "Hand them crayons and watch focus replace screen addiction. Real skills, real progress, real childhood.",
      time: "Daily joy",
      color: "from-primary to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      iconColor: "text-primary",
      features: [
        "Screen-free activities",
        "20+ minutes focused play",
        "Visible development",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Clock className="w-5 h-5" />
            Simple 3-Step Process
          </div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
            From Purchase to Progress
            <br />
            <span className="text-primary">In Under 10 Minutes</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            No complicated setup. No special equipment. Just download, print,
            and hand them crayons.
            <strong> That's it.</strong>
          </p>
        </div>

        {/* Steps - MOBILE OPTIMIZED */}
        <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative">
                {/* Connecting Line - Desktop Only */}
                {!isLast && (
                  <div className="hidden md:block absolute left-[47px] top-24 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent z-0"></div>
                )}

                {/* Card */}
                <div
                  className={`bg-gradient-to-br ${step.bgColor} rounded-2xl p-6 md:p-8 border-2 border-gray-200 shadow-sm`}
                >
                  {/* Mobile: Icon + Title Row */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Icon with Number Badge */}
                    <div className="flex-shrink-0 relative">
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${step.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>

                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                        <span className="text-xs md:text-sm font-bold text-gray-900">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Title + Time */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <div className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-gray-700 border border-gray-200">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        {step.time}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className={`w-5 h-5 ${step.iconColor} flex-shrink-0 mt-0.5`}
                        />
                        <span className="text-sm md:text-base text-gray-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card - MOBILE OPTIMIZED */}
        <div className="bg-gradient-to-br from-primary/5 to-emerald-50 rounded-2xl p-6 md:p-8 lg:p-12 border-2 border-primary/20">
          {/* Text Content */}
          <div className="text-center md:text-left mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Ready to Replace Screen Time Today?
            </h3>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
              Join 10,000+ parents who chose real learning over screen
              addiction.
              <strong> Start in the next 5 minutes.</strong>
            </p>

            {/* Trust Features */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-sm text-gray-600 mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Instant download</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Print unlimited</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>

          {/* CTA Button - Full Width on Mobile */}
          <div className="text-center">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="group bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 md:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:bg-gray-400 inline-flex items-center justify-center gap-2 w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Get Bundle - {formatPrice(mainPrice)}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Secure payment • Instant access
            </p>
          </div>
        </div>

        {/* Timeline Visual Summary - MOBILE OPTIMIZED */}
        <div className="mt-8 md:mt-12 bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200">
          <h4 className="text-center text-base md:text-lg font-bold text-gray-900 mb-6">
            Your Timeline to Screen-Free Learning
          </h4>

          {/* Mobile: Vertical Stack, Desktop: Horizontal */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1 md:flex-initial">
                <div className="font-semibold text-gray-900">Now</div>
                <div className="text-sm text-gray-600">Purchase bundle</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 md:hidden flex-shrink-0" />
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />

            {/* Step 2 */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1 md:flex-initial">
                <div className="font-semibold text-gray-900">2 minutes</div>
                <div className="text-sm text-gray-600">Download PDFs</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 md:hidden flex-shrink-0" />
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />

            {/* Step 3 */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1 md:flex-initial">
                <div className="font-semibold text-gray-900">5 minutes</div>
                <div className="text-sm text-gray-600">Print pages</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 md:hidden flex-shrink-0" />
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />

            {/* Step 4 */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div className="flex-1 md:flex-initial">
                <div className="font-semibold text-gray-900">10 minutes</div>
                <div className="text-sm text-gray-600">Learning starts!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
