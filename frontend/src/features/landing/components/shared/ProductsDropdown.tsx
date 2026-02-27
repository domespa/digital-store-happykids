import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import { useProducts } from "../../../../hooks/useProducts";
import { useCart } from "../../../../hooks/useCart";

export default function ProductsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { getDisplayCurrency } = useCart();
  const currentCurrency = getDisplayCurrency();

  const { products, isLoading, error } = useProducts({
    autofetch: true,
    currency: currentCurrency,
    filters: {
      isActive: true,
      sortBy: "name",
      sortOrder: "asc",
    },
  });

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    function handleClickOut(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOut);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, [isOpen]);

  // Chiudi dropdown quando premi ESC
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bottone trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1 text-base font-medium transition-all pb-1 ${
          isOpen
            ? "text-primary font-bold border-b-2 border-primary"
            : "text-gray-700 hover:text-primary"
        }`}
      >
        Products
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          role="menu"
        >
          <div className="p-3 sm:p-4">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="ml-2 text-sm text-gray-500">
                  Loading products...
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="py-3 px-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 w-full text-xs text-red-700 hover:text-red-800 underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Lista prodotti */}
            {!isLoading && !error && products.length > 0 && (
              <div className="space-y-1.5 max-h-[70vh] sm:max-h-96 overflow-y-auto custom-scrollbar">
                {products.map((product) => (
                  <NavLink
                    key={product.id}
                    to={`/products/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-green-50 transition-colors group"
                    role="menuitem"
                  >
                    {/* Immagine */}
                    <div className="w-12 h-16 sm:w-14 sm:h-18 flex-shrink-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-md overflow-hidden shadow-sm">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={
                            product.images.find((img) => img.isMain)?.url ||
                            product.images[0].url
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        // Fallback icon se non ci sono immagini
                        <div className="w-full h-full flex items-center justify-center text-primary">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Titolo e info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {product.name}
                      </h4>

                      {/* Info aggiuntive */}
                      {product.pages && (
                        <p className="text-xs text-gray-500 mt-1">
                          {product.pages} pages
                        </p>
                      )}
                    </div>

                    {/* Freccia */}
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0"
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
                  </NavLink>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && products.length === 0 && (
              <div className="py-8 text-center">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No products available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
