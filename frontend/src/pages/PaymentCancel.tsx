import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const provider = searchParams.get("provider");
  const token = searchParams.get("token");

  useEffect(() => {
    console.log("❌ PAYMENT CANCELLED");
    console.log("Provider:", provider);
    console.log("Token:", token);

    // Pulizia localStorage PayPal se necessario
    if (provider === "paypal") {
      localStorage.removeItem("paypal_pending_order");
      localStorage.removeItem("paypal_form_data");
      console.log("🧹 Cleaned PayPal localStorage");
    }

    // Countdown e redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [provider, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {provider === "paypal"
            ? "Your PayPal payment was cancelled. No charges were made."
            : "Your payment was cancelled. No charges were made."}
        </p>

        {/* Info Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-orange-800">
            <p className="mb-2">
              Don't worry! You can try again whenever you're ready.
            </p>
            <p className="text-xs text-orange-600">
              Your cart items are still saved.
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="text-sm text-gray-500 mb-4">
          Redirecting to homepage in {countdown} seconds...
        </div>

        {/* Manual Redirect Button */}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}
