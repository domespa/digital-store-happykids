import {
  ArrowRight,
  Check,
  Sparkles,
  Clock,
  Shield,
  Download,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { useLandingCart } from "../../../../hooks/useLandingCart";

export default function FinalCtaW() {
  const { addMainProductToCart, formatPrice, isLoading, mainPrice } =
    useLandingCart();

  const handleAddToCart = () => {
    addMainProductToCart(true);
  };

  // Calculate apps cost proportionally
  const baseRatio = mainPrice / 25;
  const appsAnnualCost = Math.round(180 * baseRatio);
  const savings = appsAnnualCost - mainPrice;

  const benefits = [
    "5 complete workbooks (295 pages)",
    "Unlimited prints for all your kids",
    "Lifetime access, no renewals",
    "Instant download (2 minutes)",
    "Zero screen time activities",
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Main Content Box */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top Section - Urgency */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-sm md:text-base">
                Every day without this = another day of screen battles
              </span>
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Your Child's Brain Is Wired for This
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                Not for screens. Not for instant rewards. For{" "}
                <strong className="text-primary">hands-on learning</strong> that
                builds real skills during the most critical years (ages 3-5).
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
              {/* Left: What You Get */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  What You're Getting Today
                </h3>

                <ul className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                  <p className="text-sm text-gray-700">
                    <strong className="text-primary">
                      Real parents report:
                    </strong>{" "}
                    Kids asking for workbooks instead of iPads within 2-3 weeks.
                    Not because we force it, but because accomplishment feels
                    better than empty screen time.
                  </p>
                </div>
              </div>

              {/* Right: Pricing Summary */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  Your Investment
                </h3>

                {/* Price Comparison */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                  {/* Educational Apps */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Educational Apps</span>
                      <span className="text-gray-400 line-through text-lg">
                        {formatPrice(appsAnnualCost)}/year
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Recurring forever + more screen time
                    </p>
                  </div>

                  {/* Our Price */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-900 font-bold">
                        Complete Bundle
                      </span>
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(mainPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      One-time payment • Lifetime access
                    </p>
                  </div>

                  {/* Savings */}
                  <div className="bg-primary/10 rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-primary">
                      You Save {formatPrice(savings)} First Year Alone
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button Section */}
            <div className="border-t-2 border-gray-200 pt-8">
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-2">
                  <strong className="text-gray-900">10,000+ parents</strong>{" "}
                  have already made this choice.
                </p>
                <p className="text-gray-600">
                  Will you be next? Or will tomorrow be another screen battle?
                </p>
              </div>

              {/* Main CTA Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="group bg-primary hover:bg-primary-hover text-white font-bold py-5 px-10 md:px-12 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:bg-gray-400 inline-flex items-center justify-center gap-3 text-lg md:text-xl w-full md:w-auto mb-4"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      <span>
                        Get Complete Bundle - {formatPrice(mainPrice)}
                      </span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="bg-gray-900 px-6 py-4 text-center">
            <p className="text-white text-sm">
              <strong>Limited Time:</strong> All 5 workbooks at this price.
              Individual workbooks cost more.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm max-w-2xl mx-auto">
            Questions? Email us at{" "}
            <a
              href="mailto:H4ppyKids@H4ppyKids.com"
              className="underline font-semibold hover:text-white"
            >
              H4ppyKids@H4ppyKids.com
            </a>{" "}
            - We respond within 24 hours. Your child's development is too
            important to leave to chance.
          </p>
        </div>
      </div>
    </section>
  );
}
