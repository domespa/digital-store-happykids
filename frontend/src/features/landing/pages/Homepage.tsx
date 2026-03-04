import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { LandingProvider } from "../../../context/LandingContext";
import { useLandingContext } from "../../../context/LandingContext";
import type { LandingConfig } from "../../../types/landing";
import CartSlideBar from "../../../components/cart/CartSlideBar";
import Footer from "../components/detox/Footer";

function HomePageContent() {
  const { user, isLoading: isLoadingContext } = useLandingContext();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currency = user?.currency || "EUR";

  useEffect(() => {
    if (isLoadingContext) {
      console.log("⏳ Still loading context...");
      return;
    }

    console.log("🌍 Fetching products with currency:", currency);

    const url = `${import.meta.env.VITE_API_URL}/api/products?currency=${currency}`;
    console.log("📡 API URL:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Products response:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        setProducts([]);
        setLoading(false);
      });
  }, [currency, isLoadingContext]);

  if (loading || isLoadingContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PRODUCTS */}
      <section id="products" className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h2>
            <p className="text-xl text-gray-600">
              Browse our educational materials
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No products available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all border overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <BookOpen className="w-20 h-20 text-gray-300" />
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl text-black font-bold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {product.formattedPrice ||
                          `${currency}${product.price}`}
                      </span>
                      <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default function HomePage() {
  const config: LandingConfig = {
    productId: "",
    hero: { title: "", subtitle: "", image: "", ctaText: "" },
    problems: { title: "", subtitle: "", problems: [], emotionalHook: "" },
    features: { title: "", subtitle: "", features: [], bonuses: [] },
    testimonials: { title: "", subtitle: "", testimonials: [] },
    faq: { title: "", subtitle: "", faqs: [] },
    pricing: {
      title: "",
      subtitle: "",
      mainPrice: 0,
      originalPrice: 0,
      currency: "EUR",
      included: [],
      highlights: [],
      guarantees: [],
    },
    settings: {
      theme: "default",
      colors: { primary: "", secondary: "", accent: "" },
      currency: "EUR",
    },
    trustBar: { stats: [] },
    urgency: { enabled: false, endDate: "", message: "", urgencyText: "" },
    contentPreview: { title: "", subtitle: "", totalPages: 0, chapters: [] },
    finalCta: {
      title: "",
      subtitle: "",
      ctaText: "",
      guaranteeText: "",
      stats: [],
    },
    stickyBar: { enabled: false, text: "", ctaText: "", showTimer: false },
  };

  return (
    <LandingProvider config={config}>
      <HomePageContent />
      <CartSlideBar />
      <Footer />
    </LandingProvider>
  );
}
