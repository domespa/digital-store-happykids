import {
  BookOpen,
  FileText,
  Palette,
  PenTool,
  Shapes,
  Check,
} from "lucide-react";
import { useLandingCart } from "../../../../hooks/useLandingCart";

export default function ProductShowcaseW() {
  const { addMainProductToCart, formatPrice, isLoading, mainPrice } =
    useLandingCart();

  const handleAddToCart = () => {
    addMainProductToCart(true);
  };

  const workbooks = [
    {
      id: 1,
      icon: Palette,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      borderColor: "border-red-200",
      name: "A Rainbow of Colors",
      pages: 47,
      description:
        "Color recognition, matching, and creative expression that keeps toddlers engaged for 30+ minutes.",
      highlights: [
        "15 color-matching activities",
        "No prep needed",
        "Perfect for short attention spans",
      ],
      image: "/cover-ebook/ranibowofcolors.jpg",
    },
    {
      id: 2,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      name: "Letters and Numbers in Play",
      pages: 60,
      description:
        "Early literacy and math skills disguised as fun - because forcing ABCs doesn't work.",
      highlights: [
        "Letter tracing that doesn't feel like homework",
        "Number games that build counting skills",
        "Prepares them for kindergarten",
      ],
      image: "/cover-ebook/lettersnumbersinplay.jpg",
    },
    {
      id: 3,
      icon: PenTool,
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      name: "My First Writing Adventure",
      pages: 59,
      description:
        "Pre-writing skills that build confidence and focus - two things screens destroyed.",
      highlights: [
        "Line tracing and patterns",
        "Improves hand-eye coordination",
        "Builds focus and patience",
      ],
      image: "/cover-ebook/myfirstadventure.jpg",
    },
    {
      id: 4,
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      name: "Animals and Dinosaurs",
      pages: 64,
      description:
        "Every toddler loves animals. Use it. This workbook taps into natural curiosity.",
      highlights: [
        "Animal matching and coloring",
        "Dinosaur activities",
        "Real engagement, not passive watching",
      ],
      image: "/cover-ebook/animals.jpg",
    },
    {
      id: 5,
      icon: Shapes,
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50 to-amber-50",
      borderColor: "border-orange-200",
      name: "World of Shapes",
      pages: 65,
      description:
        "Spatial reasoning and problem-solving through hands-on activities - not passive watching.",
      highlights: [
        "Shape recognition games",
        "Critical thinking skills",
        "Independent play (you can breathe)",
      ],
      image: "/cover-ebook/worldofshapes.jpg",
    },
  ];

  return (
    <section
      id="what-included"
      className="py-16 md:py-24 bg-gray-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <BookOpen className="w-5 h-5" />
            Complete Learning System
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What's Inside: 5 Complete Workbooks
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            295 pages designed to replace screen time naturally - so your
            toddler
            <strong> chooses real play</strong> without you forcing it.
          </p>

          {/* Photo Real Products - Hero Image */}
          <div className="mt-12 mb-12">
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200">
                <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <img src="/ebooks.jpg" alt="ebooks" />
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl transform rotate-3">
                <div className="text-center">
                  <div className="text-3xl font-bold">295</div>
                  <div className="text-sm">Total Pages</div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl px-6 py-3 border-2 border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-900">
                    Instant Download
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workbooks Grid  */}
        <div className="space-y-8 mb-16">
          {workbooks.map((workbook, index) => {
            const Icon = workbook.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={workbook.id}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center`}
              >
                {/* Image - BALANCED: 35% */}
                <div className="w-full lg:w-[35%]">
                  <div
                    className={`relative bg-gradient-to-br ${workbook.bgColor} rounded-2xl p-5 border-2 ${workbook.borderColor} shadow-lg hover:shadow-xl transition-all`}
                  >
                    <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-md max-w-xs mx-auto">
                      <img
                        src={workbook.image}
                        alt={workbook.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Page Count Badge */}
                    <div
                      className={`absolute -top-3 -right-3 bg-gradient-to-br ${workbook.color} text-white px-4 py-2 rounded-xl shadow-lg font-bold`}
                    >
                      {workbook.pages} Pages
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-[65%]">
                  <div className="space-y-4">
                    {/* Icon + Title */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${workbook.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {workbook.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          Workbook #{workbook.id} • {workbook.pages} Pages
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {workbook.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-2">
                      {workbook.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Summary Box */}
        <div className="bg-gradient-to-br from-primary/5 to-emerald-50 rounded-2xl p-8 md:p-12 border-2 border-primary/20">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">295</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5</div>
              <div className="text-sm text-gray-600">Complete Workbooks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-sm text-gray-600">Engaging Activities</div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Complete Bundle: Just {formatPrice(mainPrice)}
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Get all 5 workbooks for the price of tutoring's first hour.
              <strong> Print unlimited copies.</strong> Use with multiple kids.
              Lifetime access.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="group bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:bg-gray-400 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Get Complete Bundle - {formatPrice(mainPrice)}
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Print Unlimited</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* VIDEO */}
        <div className="mt-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200">
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  poster="/video-thumbnail.jpg"
                >
                  <source src="/videos/child-coloring.mp4" type="video/mp4" />

                  {/* Fallback se browser non supporta video */}
                  <img
                    src="/video-thumbnail.jpg"
                    alt="Child coloring workbook"
                    className="w-full h-full object-cover"
                  />
                </video>
              </div>
            </div>

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-md text-center border-2 border-primary/20">
                <p className="text-lg font-semibold text-gray-900">
                  "20 Minutes of Pure Focus.
                  <br />
                  <span className="text-primary">No Screens Needed.</span>"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
