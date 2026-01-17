import { useState, useEffect } from "react";
import { useLandingCart } from "../../../hooks/useLandingCart";

export default function MobileStickyBar() {
  const [show, setShow] = useState(false);
  const landingCart = useLandingCart();

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-[9998] animate-slideUp">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900">$47</div>
            <div className="text-xs text-gray-600">200-page program</div>
          </div>
          <button
            onClick={() => landingCart.addMainProductToCart()}
            className="flex-shrink-0 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
