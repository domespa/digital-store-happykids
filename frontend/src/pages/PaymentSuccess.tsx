import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { payments } from "../services/api";
import { trackPurchase } from "../utils/analytics";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const processPayment = async () => {
      try {
        const provider = searchParams.get("provider");
        const token = searchParams.get("token");
        const paymentIntent = searchParams.get("payment_intent");

        console.log("🎯 SUCCESS PAGE LOADED");
        console.log("Provider:", provider);
        console.log("Token:", token);
        console.log("Payment Intent:", paymentIntent);
        console.log("Full URL:", window.location.href);

        if (provider === "stripe" || paymentIntent) {
          console.log("✅ Stripe payment - showing success");
          setStatus("success");

          trackPurchase(
            crypto.randomUUID(),
            JSON.parse(localStorage.getItem("cart_items") || "[]"),
            Number(localStorage.getItem("cart_total") || 0),
            0,
            0,
            localStorage.getItem("currency") || "EUR"
          );

          localStorage.removeItem("cart");

          setTimeout(() => {
            console.log("Redirecting to home...");
            navigate("/");
          }, 10000);
          return;
        }

        if (provider === "paypal" && token) {
          console.log("🔄 Capturing PayPal payment:", token);

          const result = await payments.capturePayPal(token);

          console.log("✅ Capture result:", result);

          if (result.success) {
            setStatus("success");

            trackPurchase(
              crypto.randomUUID(),
              JSON.parse(localStorage.getItem("cart_items") || "[]"),
              Number(localStorage.getItem("cart_total") || 0),
              0,
              0,
              localStorage.getItem("currency") || "EUR"
            );

            localStorage.removeItem("paypal_pending_order");
            localStorage.removeItem("paypal_form_data");
            localStorage.removeItem("cart");

            console.log("✅ Payment captured successfully");

            setTimeout(() => {
              console.log("Redirecting to home...");
              navigate("/");
            }, 5000);
          } else {
            throw new Error(result.message || "Payment capture failed");
          }
        } else {
          console.error("❌ No valid payment provider");
          setStatus("error");
          setErrorMessage("Invalid payment information");
        }
      } catch (error: any) {
        console.error("❌ Payment processing error:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      }
    };

    console.log("🎯 PaymentSuccess component mounted");
    processPayment();
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing your payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {errorMessage || "We couldn't process your payment."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful! 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! You will receive a confirmation email
          shortly.
        </p>
        <div className="text-sm text-gray-500">Redirecting in 5 seconds...</div>
      </div>
    </div>
  );
}
