import { useLandingContext } from "../../../../context/LandingContext";
import { useCart } from "../../../../hooks/useCart";
import { BookOpen, Check } from "lucide-react";
import { useState } from "react";

export default function WorkbooksShowcase() {
  const { config } = useLandingContext();
  const { addItem } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!config?.workbooksShowcase) return null;

  const { title, subtitle, workbooks, upsellMessage, showIndividualPricing } =
    config.workbooksShowcase;

  const handleAddWorkbook = async (
    workbookId: string,
    price: number,
    name: string,
    currency: string,
  ) => {
    setLoadingId(workbookId);
    try {
      addItem({
        id: workbookId,
        productId: workbookId,
        name: name,
        price: price,
        currency: currency,
        image: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding workbook:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm font-bold text-blue-600 mb-5">
            <BookOpen className="w-4 h-4" />
            <span>The Complete Bundle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Workbooks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {workbooks.map((workbook, index) => (
            <div
              key={workbook.id}
              className="group bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Workbook Image */}
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                  <img
                    src={workbook.image}
                    alt={workbook.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Pages Badge */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-gray-900 shadow-md">
                    {workbook.pages} pages
                  </div>

                  {/* Workbook Number */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Workbook Info */}
              <div className="p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {workbook.name}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {workbook.description}
                </p>

                {/* Highlights */}
                {workbook.highlights && workbook.highlights.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    {workbook.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check
                          className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                          strokeWidth={3}
                        />
                        <span className="text-xs text-gray-700 leading-relaxed">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Individual Pricing (if enabled) */}
                {showIndividualPricing && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        €{workbook.priceEUR}
                      </span>
                      <span className="text-xs text-gray-500">individual</span>
                    </div>

                    <button
                      onClick={() =>
                        handleAddWorkbook(
                          workbook.id,
                          workbook.priceEUR,
                          workbook.name,
                          "EUR",
                        )
                      }
                      disabled={loadingId === workbook.id}
                      className="w-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-900 font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loadingId === workbook.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          Adding...
                        </span>
                      ) : (
                        "Buy This One"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upsell Message */}
        {upsellMessage && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-center shadow-lg">
              <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {upsellMessage}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Bundle = €25 • Individual = 5 × €5 = €25 → You save €10!
              </p>

              <a
                href="#pricing"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-xl"
              >
                Get the Complete Bundle →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
