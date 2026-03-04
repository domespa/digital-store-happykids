import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export default function MinimalHeader() {
  const { toggleCart, getItemsCount } = useCart();
  const itemsCount = getItemsCount();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="h-20 px-4 sm:px-8 lg:px-20 flex justify-between items-center max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/logohw.png"
            alt="Happy Kids Workbooks"
            className="h-12 sm:h-16 hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Cart Button */}
        <button
          onClick={toggleCart}
          className="relative p-2 text-gray-700 hover:text-primary transition-colors"
          aria-label="Shopping cart"
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>

          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
