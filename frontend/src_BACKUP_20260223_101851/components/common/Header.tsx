import { useCart } from "../../../../hooks/useCart";
import { ShoppingCart } from "lucide-react";
import Navbar from "./Navbar";

export default function Header() {
  const { cart, toggleCart, getItemsCount } = useCart();
  const itemsCount = getItemsCount();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-gray-100 shadow-sm">
      <div className="h-20 px-4 sm:px-8 lg:px-20 flex justify-between items-center max-w-[1920px] mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            className="h-14 sm:h-16 lg:h-20 transition-transform hover:scale-105"
            src="./logohw.png"
            alt="Happy Kids Workbooks"
          />
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Cart Button */}
        <button
          onClick={toggleCart}
          className="relative p-2 text-gray-700 hover:text-yellow-500 transition-colors group flex-shrink-0"
          aria-label={`Shopping cart with ${itemsCount} items`}
        >
          <ShoppingCart
            size={28}
            className="transition-transform group-hover:scale-110"
          />

          {/* Badge Count */}
          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-md animate-bounce-subtle">
              {itemsCount > 99 ? "99+" : itemsCount}
            </span>
          )}

          {/* Loading Spinner */}
          {cart.isConverting && (
            <span className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-3 h-3 animate-spin">
              <span className="block w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
