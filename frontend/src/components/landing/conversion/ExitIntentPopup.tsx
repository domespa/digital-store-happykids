import { useState, useEffect } from "react";
import { useLandingCart } from "../../../hooks/useLandingCart";

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const landingCart = useLandingCart();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
        localStorage.setItem("exit_popup_shown", "true");
      }
    };

    const shown = localStorage.getItem("exit_popup_shown");
    if (!shown) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const handleAccept = () => {
    landingCart.addMainProductToCart();
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setShowPopup(false)}
      />
      <div className="relative bg-white rounded-2xl p-8 max-w-md shadow-2xl animate-slideUp">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Wait! Before You Go...
          </h3>
          <p className="text-gray-600">
            Get <span className="text-teal-600 font-bold">20% OFF</span> if you
            start your transformation right now
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Regular Price:</span>
            <span className="text-gray-400 line-through">$47</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">
              Your Price Today:
            </span>
            <span className="text-2xl font-bold text-teal-600">$37</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Yes! Give Me 20% OFF
          </button>
          <button
            onClick={() => setShowPopup(false)}
            className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            No thanks, I'll pay full price
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          This offer expires when you close this window
        </p>
      </div>
    </div>
  );
}
