import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import workbooksConfig from "../../../config/landing-config/workbooksConfig";
import CartSlideBar from "../../../components/cart/CartSlideBar";
import { useLandingCart } from "../../../hooks/useLandingCart";
import { useLandingContext } from "../../../context/LandingContext";
import MinimalHeader from "../../../components/common/MinimalHeader";
import { useSavings } from "../../../hooks/useSavings";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [, setToastMessage] = useState("");
  const [bundleProduct, setBundleProduct] = useState<any>(null);
  const bundleSavings = useSavings(bundleProduct);
  const [otherWorkbooksBackend, setOtherWorkbooksBackend] = useState<any[]>([]);

  const {
    addMainProductToCart,
    formatPrice,
    isLoading,
    backendProduct,
    cartActions,
  } = useLandingCart();

  const { user } = useLandingContext();

  // CARICHIAMO IL BUNDLE
  useEffect(() => {
    const fetchBundleProduct = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(
          `${apiUrl}/api/products/cml87a3250000140vhvtptbd6`,
          {
            headers: {
              "X-User-Currency": user?.currency || "EUR",
            },
          },
        );
        const data = await response.json();
        setBundleProduct(data.product || data.data);
      } catch (error) {
        console.error("Errore nel caricamento del bundle:", error);
      }
    };

    if (user?.currency) {
      fetchBundleProduct();
    }
  }, [user?.currency]);

  // CARICHIAMO TUTTI GLI ALTRI WORKBOOKS DAL BACKEND
  useEffect(() => {
    const fetchOtherWorkbooks = async () => {
      if (!user?.currency || !id) return;

      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const otherWorkbooksIds =
          workbooksConfig.workbooksShowcase?.workbooks
            .filter((wb) => wb.id !== id)
            .map((wb) => wb.id) || [];

        const promises = otherWorkbooksIds.map((workbookId) =>
          fetch(`${apiUrl}/api/products/${workbookId}`, {
            headers: {
              "X-User-Currency": user.currency,
            },
          }).then((res) => res.json()),
        );

        const results = await Promise.all(promises);

        const products = results.map((data) => data.product || data.data);

        setOtherWorkbooksBackend(products);
      } catch (error) {
        console.error("Errore caricamento altri workbooks:", error);
      }
    };

    fetchOtherWorkbooks();
  }, [user?.currency, id]);

  // FUNZIONE PER AGGIUNTA BUNDLE
  const handleAddBundleToCart = () => {
    console.log("Bundle product:", bundleProduct);
    if (!bundleProduct) {
      console.error("Bundle product not loaded yet!");
      return;
    }

    cartActions.addItem({
      id: `workbook-${bundleProduct.id}`,
      productId: bundleProduct.id,
      name: bundleProduct.name,
      price: bundleProduct.displayPrice || bundleProduct.price,
      currency: bundleProduct.currency,
      image:
        bundleProduct.images?.[0]?.url ||
        bundleProduct.image ||
        "/default-bundle.jpg",
      description: bundleProduct.description,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // AUTO SCROLL TOP AL CLICK
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // CERCHIAMO L'EBOOK DAL CONFIG
  const workbook = workbooksConfig.workbooksShowcase?.workbooks.find(
    (wb) => wb.id === id,
  );

  if (!workbook) {
    return <div> Product dont find</div>;
  }

  // CARICHIAMO LE IMMAGINI
  const previewImages = workbook.previewImages || [];

  // METTIAMO GLI ALTRI EBOOK DENTRO UN ALTRA VARIABILI PER POI MOSTRARLI IN FONDO
  const otherWorkbooks =
    otherWorkbooksBackend.length > 0
      ? otherWorkbooksBackend
      : workbooksConfig.workbooksShowcase?.workbooks.filter(
          (wb) => wb.id !== id,
        ) || [];

  // FUNZIONE PER AGGIUNTA AL CARRELLO
  const handleAddToCart = () => {
    addMainProductToCart(false);
    setToastMessage(`${workbook.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddOtherWorkbooks = (wb: any) => {
    const workbookPrice = wb.displayPrice || wb.priceEUR || 5;
    const workbookCurrency = wb.currency || user?.currency || "EUR";

    cartActions.addItem({
      id: `workbook-${wb.id}`,
      productId: wb.id,
      name: wb.name,
      price: workbookPrice,
      currency: workbookCurrency,
      image: wb.image,
      description: `${wb.pages} pages workbook for ages 3-5`,
    });

    setToastMessage(`${wb.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // FUNZIONE PER SCORRERE IMMAGINI NELLO SLIDER
  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + previewImages.length) % previewImages.length,
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % previewImages.length);
  };

  const displayPrice = backendProduct?.displayPrice || workbook.priceEUR;

  return (
    <>
      <MinimalHeader />
      <div className="min-h-screen bg-background-gray">
        {/* MAIN PRODUCT SECTION */}
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* LEFT: IMAGE SLIDER */}
            <div className="space-y-4">
              <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden aspect-[3/4] bg-gray-100">
                <img
                  src={previewImages[currentImage]}
                  alt={`${workbook.name} preview ${currentImage + 1}`}
                  className="w-full h-full object-contain"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary hover:bg-primary-hover text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary hover:bg-primary-hover text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2">
                {previewImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImage
                        ? "w-8 bg-primary"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {workbook.name}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    📖 {workbook.pages} pages
                  </span>
                  <span className="flex items-center gap-1">👶 Ages 3-5</span>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {workbook.description}
              </p>

              {/* Highlights */}
              {workbook.highlights && (
                <div className="space-y-3">
                  {workbook.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* PRICE & CTA */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-gray-500">Loading price...</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">
                      {formatPrice(displayPrice)}
                    </span>
                    <span className="text-sm text-gray-500">per workbook</span>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all active:scale-98 shadow-md hover:shadow-xl"
                >
                  {isLoading
                    ? "Loading..."
                    : `Add to Cart - ${formatPrice(displayPrice)}`}
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Secure payment • Instant download
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              💡 Frequently Bought Together
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherWorkbooks.slice(0, 4).map((wb) => (
                <Link
                  to={`/products/${wb.id}`}
                  key={wb.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary-light p-4 transition-all block"
                >
                  <img
                    src={wb.image}
                    alt={wb.name}
                    className="w-full aspect-[3/4] object-contain rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-gray-900 mb-1">{wb.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{wb.pages} pages</p>
                  <div className="text-xl font-bold text-primary mb-3 text-right">
                    {formatPrice(displayPrice)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddOtherWorkbooks(wb);
                    }}
                    className="w-full bg-gray-100 hover:bg-primary hover:text-white text-gray-900 font-semibold py-2 rounded-lg transition-all"
                  >
                    Add to Cart
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* BUNDLE UPSELL */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl border-2 border-green-300 p-8 shadow-xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                ⭐ Save with the Complete Bundle!
              </h2>
              {bundleSavings.hasSavings ? (
                <p className="text-lg text-gray-700 mb-6">
                  Get all 5 workbooks for{" "}
                  <strong>{bundleSavings.formattedCurrentPrice}</strong> instead
                  of {bundleSavings.formattedOriginalPrice}
                  <span className="text-green-600 font-bold">
                    {" "}
                    (Save {bundleSavings.formattedSavings} -{" "}
                    {bundleSavings.savingsPercentage}% OFF!)
                  </span>
                </p>
              ) : (
                <p className="text-lg text-gray-700 mb-6">
                  Get all 5 workbooks for{" "}
                  <strong>{bundleSavings.formattedCurrentPrice}</strong>
                </p>
              )}

              <button
                onClick={handleAddBundleToCart}
                disabled={!bundleProduct}
                className="bg-gradient-success hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get the Complete Bundle →
              </button>
            </div>
          </div>
        </div>
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-xl animate-slide-up z-50">
            ✅ Added to cart!
          </div>
        )}
        <CartSlideBar />
      </div>
    </>
  );
}
