import { useLandingCart } from "../../../../hooks/useLandingCart";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Download,
  Star,
  FileText,
} from "lucide-react";

export default function HeroSectW() {
  const { addMainProductToCart, formatPrice, isLoading, mainPrice } =
    useLandingCart();

  const handleAddToCart = () => {
    addMainProductToCart(false);
  };

  const scrollToLearnMore = () => {
    const element = document.getElementById("what-included");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Copy */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-gray-900">
                Science-Backed Learning
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Apps keep them busy.
              <span className="text-primary block mt-2">
                Paper builds their brain.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              A research-based workbook for ages 3–5 that teaches colors,
              numbers, and letters through hands-on learning.{" "}
              <p>
                <strong>Real skills.</strong>
              </p>
              <p>
                <strong>Real focus.</strong>
              </p>
              <p>
                <strong>Zero passive screen time.</strong>
              </p>
            </p>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              {/* Avatar Stack */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    "/images/avatar-1.jpg",
                    "/images/avatar-3.jpg",
                    "/images/avatar-5.jpg",
                    "/images/avatar-6.jpg",
                  ].map((avatar, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                    >
                      <img
                        src={avatar}
                        alt={`Happy parent ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback se immagine non esiste
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.classList.add(
                            "bg-gradient-to-br",
                            "from-primary",
                            "to-teal-400",
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  {/* 4 stelle piene */}
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  {/* Mezza stella */}
                  <div className="relative w-5 h-5">
                    <Star className="w-5 h-5 text-gray-300 fill-current absolute" />
                    <div className="overflow-hidden absolute w-1/2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">4.5/5</strong> Loved by
                  thousands of families
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="group bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:bg-gray-400"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Get Bundle - {formatPrice(mainPrice)}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={scrollToLearnMore}
                className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-primary transition-all"
              >
                Learn More
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-8 pt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                <span>Instant Download</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Hero Image */}
          <div className="relative">
            {/* Main Image Placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <img src="/color.jpg" alt="color" />
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-400 to-red-500 text-white px-6 py-3 rounded-2xl shadow-xl transform rotate-3">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatPrice(mainPrice)}
                </div>
              </div>
            </div>

            {/* Stats Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">295</div>
                  <div className="text-xs text-gray-600">Pages Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
