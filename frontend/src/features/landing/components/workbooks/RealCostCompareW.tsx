import {
  Brain,
  Heart,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLandingCart } from "../../../../hooks/useLandingCart";

export default function RealCostCompareW() {
  const { addMainProductToCart, formatPrice, isLoading, mainPrice } =
    useLandingCart();

  const handleAddToCart = () => {
    addMainProductToCart(true);
  };

  const baseRatio = mainPrice / 25;
  const appsAnnualCost = Math.round(180 * baseRatio);

  const savings = appsAnnualCost - mainPrice;
  const savingsPercent = Math.round((savings / appsAnnualCost) * 100);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm border border-red-500/30">
            <AlertTriangle className="w-5 h-5" />
            The Hidden Cost
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Educational Apps vs Real Learning:
            <br />
            <span className="text-red-400">What You're Actually Paying</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Beyond subscription fees, screen time costs your child something
            priceless:
            <strong className="text-white">
              {" "}
              brain development during critical years 3-5.
            </strong>
          </p>
        </div>

        {/* Main Comparison Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-slate-700 overflow-hidden mb-12">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 p-6 bg-slate-900/50 border-b border-slate-700">
            <div className="text-gray-400 font-semibold text-sm"></div>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/20">
                <TrendingDown className="w-5 h-5" />
                <span className="font-bold">Educational Apps</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20">
                <Brain className="w-5 h-5" />
                <span className="font-bold">Our Workbooks</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: BRAIN DEVELOPMENT */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-center gap-2 text-white font-bold mb-6">
              <Brain className="w-5 h-5 text-purple-400" />
              Brain Development Impact
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center">
              <div className="text-gray-300 font-semibold">
                Neural Activation
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  Single-channel,
                  <br />
                  passive
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">3x more areas</strong>
                  <br />
                  activated
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30">
              <div className="text-gray-300 font-semibold">
                Memory Retention
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  Temporary,
                  <br />
                  shallow
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">42% better</strong>
                  <br />
                  retention
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30">
              <div className="text-gray-300 font-semibold">
                Fine Motor Skills
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  Tap & swipe
                  <br />
                  only
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Pencil control,</strong>
                  <br />
                  coordination
                </span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30">
              <div className="text-gray-300 font-semibold">Attention Span</div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-red-400">Reduced 40%</strong>
                  <br />
                  (AAP study)
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Builds focus</strong>
                  <br />
                  15-20 minutes
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: LIFESTYLE IMPACT */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-center gap-2 text-white font-bold mb-6">
              <Heart className="w-5 h-5 text-red-400" />
              Daily Life Impact
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center">
              <div className="text-gray-300 font-semibold">Screen Time</div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-red-400">+2 hours</strong>
                  <br />
                  more screens/day
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Zero</strong>
                  <br />
                  screen time
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30">
              <div className="text-gray-300 font-semibold">Sleep Quality</div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  Blue light
                  <br />
                  disrupts melatonin
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Calming</strong>
                  <br />
                  activities
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30">
              <div className="text-gray-300 font-semibold">Independence</div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  Passive
                  <br />
                  consumption
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Self-directed</strong>
                  <br />
                  play
                </span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30">
              <div className="text-gray-300 font-semibold">Flexibility</div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  WiFi required,
                  <br />
                  device dependent
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Anytime,</strong>
                  <br />
                  anywhere
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: COST & VALUE */}
          <div className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
            <div className="flex items-center justify-center gap-2 text-white font-bold mb-6">
              <DollarSign className="w-5 h-5 text-amber-400" />
              Financial Cost
            </div>

            {/* Row 1 - HIGHLIGHT */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-6 items-center bg-slate-900/50 rounded-xl px-4">
              <div className="text-white font-bold text-lg">Annual Cost</div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-red-400">
                  {formatPrice(appsAnnualCost)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  per year, recurring
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(mainPrice)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  one-time, forever
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30 mt-4">
              <div className="text-gray-300 font-semibold">Payment Model</div>
              <div className="flex flex-col items-center justify-center text-center">
                <Calendar className="w-6 h-6 text-red-400 mb-2" />
                <span className="text-sm text-gray-300">
                  Recurring
                  <br />
                  subscription
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Check className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Lifetime</strong>
                  <br />
                  access
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 py-4 items-center border-t border-slate-700/30">
              <div className="text-gray-300 font-semibold">Multiple Kids</div>
              <div className="flex flex-col items-center justify-center text-center">
                <X className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-sm text-gray-300">
                  Per device
                  <br />
                  only
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Users className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-gray-300">
                  <strong className="text-white">Unlimited</strong>
                  <br />
                  prints for all
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Summary Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Educational Apps - THE REAL COST */}
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Educational Apps:
              <br />
              The Real Cost
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <DollarSign className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    {formatPrice(appsAnnualCost)}/year
                  </div>
                  <div className="text-sm text-gray-400">Recurring forever</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-white font-bold">
                    Developmental Delays
                  </div>
                  <div className="text-sm text-gray-400">
                    40% reduced attention, motor skill gaps
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-white font-bold">
                    +2 Hours Screen Time Daily
                  </div>
                  <div className="text-sm text-gray-400">
                    Sleep issues, behavioral problems
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-center">
              <p className="text-sm text-gray-300">
                <strong className="text-red-400">Total Hidden Cost:</strong>
                <br />
                Hundreds in subscriptions + unmeasurable developmental impact
              </p>
            </div>
          </div>

          {/* Our Workbooks - THE SMART CHOICE */}
          <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Our Workbooks:
              <br />
              The Smart Choice
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    {formatPrice(mainPrice)} One-Time
                  </div>
                  <div className="text-sm text-gray-400">No renewals, ever</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-white font-bold">
                    3x Brain Development
                  </div>
                  <div className="text-sm text-gray-400">
                    Research-proven neural activation
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-white font-bold">Zero Screen Time</div>
                  <div className="text-sm text-gray-400">
                    Better sleep, focus, development
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 text-center">
              <p className="text-sm text-gray-300">
                <strong className="text-primary">Total Value:</strong>
                <br />
                {formatPrice(mainPrice)} once + optimal development + unlimited
                reuse
              </p>
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl border-2 border-primary/30">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h3 className="text-3xl md:text-4xl font-bold">
              Save {formatPrice(savings)} First Year Alone
            </h3>
            <Sparkles className="w-8 h-8" />
          </div>

          <p className="text-xl md:text-2xl text-white/90 mb-8">
            <strong>{savingsPercent}% savings</strong> compared to app
            subscriptions - plus immeasurable benefits in brain development and
            screen-free childhood.
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="group bg-white text-primary font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:bg-gray-400 inline-flex items-center gap-2 text-lg hover:bg-gray-100"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                Loading...
              </>
            ) : (
              <>
                Get Complete Bundle - {formatPrice(mainPrice)}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-sm text-white/70 mt-4">
            Instant Download • Lifetime Access
          </p>
        </div>

        {/* Research Citation */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500 mb-2">Research Sources:</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <span>American Academy of Pediatrics</span>
            <span>•</span>
            <span>Stanford Research (2022)</span>
            <span>•</span>
            <span>MIT Press (2021)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
