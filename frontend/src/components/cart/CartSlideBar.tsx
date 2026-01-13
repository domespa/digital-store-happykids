import { useCart } from "../../hooks/useCart";
import { useEffect, useState } from "react";
import { useCheckout } from "../../hooks/useCheckout";
import StripePaymentForm from "../StripePaymentForm";
import type { CheckoutForm } from "../../types/checkout";
import { trackBeginCheckout, trackAddPaymentInfo } from "../../utils/analytics";

interface CartSlideBar {
  className?: string;
}

type CheckoutStep = "cart" | "form" | "stripe" | "paypal" | "success";

const formatPriceWithCurrency = (amount: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "$",
    CAD: "$",
    JPY: "¥",
    CHF: "CHF",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
  };

  const symbol = currencySymbols[currency] || currency;
  const rounded = Math.round(amount);

  // Format: $45 AUD
  return `${symbol}${rounded} ${currency}`;
};

export default function CartSlideBar({ className }: CartSlideBar = {}) {
  const {
    cart,
    removeItem,
    updateQuantity,
    toggleCart,
    clearCart,
    getCartTotal,
    getDisplayCurrency,
  } = useCart();

  const {
    processCheckoutData,
    capturePayPalPayment,
    isProcessing,
    error,
    clearError,
  } = useCheckout();

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [formData, setFormData] = useState<CheckoutForm>({
    customerEmail: "",
    customerFirstName: "",
    customerLastName: "",
    paymentProvider: "STRIPE",
    acceptRefundPolicy: "false",
  });

  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null
  );
  const [successData, setSuccessData] = useState<{
    id?: string;
    orderId?: string;
    customerEmail?: string;
    total?: number;
    status?: string;
    paymentStatus?: string;
    finalAmount?: number;
    finalCurrency?: string;
    orderItems?: Array<{
      id: string;
      quantity: number;
      price: number;
      productId: string;
      product: {
        id: string;
        name: string;
        description: string;
        fileName: string;
      } | null;
    }>;
  } | null>(null);

  useEffect(() => {
    const handlePayPalReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const pendingOrderId = localStorage.getItem("paypal_pending_order");
      const savedFormData = localStorage.getItem("paypal_form_data");

      if (token && pendingOrderId) {
        try {
          toggleCart();
          setCheckoutStep("paypal");

          if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
          }

          const captureResponse = await capturePayPalPayment(pendingOrderId);

          if (captureResponse.success) {
            setSuccessData(captureResponse.order);
            setCheckoutStep("success");
            clearCart();
          } else {
            throw new Error("Payment capture failed");
          }
        } catch (error) {
          console.error("PayPal return error:", error);
          setCheckoutStep("cart");
        } finally {
          localStorage.removeItem("paypal_pending_order");
          localStorage.removeItem("paypal_form_data");
          window.history.replaceState({}, "", window.location.pathname);
        }
      }
    };

    handlePayPalReturn();
  }, []);

  const formatPrice = (amount: number): string => {
    const currency = getDisplayCurrency();

    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      AUD: "$",
      CAD: "$",
      JPY: "¥",
      CHF: "CHF",
      SEK: "kr",
      NOK: "kr",
      DKK: "kr",
    };

    const symbol = currencySymbols[currency] || currency;
    const rounded = Math.round(amount);

    return `${symbol}${rounded} ${currency}`;
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;

    trackBeginCheckout(
      cart.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.displayPrice,
        quantity: item.quantity,
      })),
      getCartTotal(),
      cart.displayCurrency
    );
    clearError();
    setCheckoutStep("form");
  };

  const updateFormData = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const processCheckout = async () => {
    try {
      const result = await processCheckoutData(formData);

      if (result.success) {
        trackAddPaymentInfo(
          cart.items.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.displayPrice,
            quantity: item.quantity,
          })),
          getCartTotal(),
          formData.paymentProvider,
          getDisplayCurrency()
        );

        if (result.type === "stripe" && result.clientSecret) {
          setStripeClientSecret(result.clientSecret);
          setCheckoutStep("stripe");
        } else if (result.type === "paypal_redirect") {
          setCheckoutStep("paypal");
        } else if (result.type === "completed") {
          if (result.order) {
            setSuccessData(result.order);
            setCheckoutStep("success");
          }
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const handleStripeSuccess = (paymentIntent: any) => {
    const finalAmount = getCartTotal();
    const finalCurrency = getDisplayCurrency();

    setSuccessData({
      id: paymentIntent?.id,
      finalAmount: finalAmount,
      finalCurrency: finalCurrency,
    });

    setCheckoutStep("success");
  };

  const handleStripeError = (error: string) => {
    console.error("Stripe payment error:", error);
  };

  const resetCheckout = () => {
    setCheckoutStep("cart");
    setStripeClientSecret(null);
    setSuccessData(null);
    clearError();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      toggleCart();
      resetCheckout();
    }
  };

  if (!cart.isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className || ""}`}>
      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={handleOverlayClick}
      />

      <div className="absolute right-0 top-0 h-[100dvh] w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-[#CAD2C5] p-6 bg-[#F8F9FA]">
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                {checkoutStep === "cart" && `Cart (${cart.itemsCount})`}
                {checkoutStep === "form" && "Checkout details"}
                {checkoutStep === "stripe" && "Processing Stripe payment..."}
                {checkoutStep === "paypal" && "Processing PayPal payment..."}
                {checkoutStep === "success" && "Order completed!"}
              </h2>
            </div>

            <button
              onClick={() => {
                toggleCart();
                resetCheckout();
              }}
              className="rounded-lg p-2 text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-white"
            >
              <svg
                className="h-6 w-6"
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
          </div>

          {/* CONTENUTO DINAMICO */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* ERRORI */}
            {error && checkoutStep !== "stripe" && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-600">{error}</div>
              </div>
            )}

            {/* CART STEP */}
            {checkoutStep === "cart" && (
              <>
                {cart.isConverting && (
                  <div className="mb-4 rounded-lg bg-[#FFF4ED] border border-[#CAD2C5] p-3">
                    <div className="flex items-center gap-2 text-sm text-[#52796F]">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#52796F]"></div>
                      Updating prices…
                    </div>
                  </div>
                )}

                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-[#4A4A4A] mb-4">
                      <svg
                        className="h-16 w-16 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5 9m0 0h9"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
                      Your cart is empty
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-5 bg-[#F8F9FA] rounded-lg border border-[#CAD2C5]"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-[#84A98C] to-[#52796F] rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-2xl text-white">📖</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#1A1A1A] text-sm leading-tight">
                            {item.name}
                          </h3>

                          {item.description && (
                            <p className="text-xs text-[#4A4A4A] mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="font-semibold text-[#52796F]">
                              {formatPrice(item.displayPrice)}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-8 h-8 rounded-full bg-white border border-[#CAD2C5] flex items-center justify-center text-[#4A4A4A] hover:bg-[#F8F9FA]"
                              >
                                -
                              </button>

                              <span className="w-8 text-center text-sm font-medium text-[#1A1A1A]">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-8 h-8 rounded-full bg-white border border-[#CAD2C5] flex items-center justify-center text-[#4A4A4A] hover:bg-[#F8F9FA]"
                              >
                                +
                              </button>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="ml-2 p-1 text-red-400 hover:text-red-600"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* FORM STEP */}
            {checkoutStep === "form" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                  Information for checkout
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        First name
                      </label>
                      <input
                        type="text"
                        value={formData.customerFirstName}
                        onChange={(e) =>
                          updateFormData("customerFirstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#CAD2C5] rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] text-[#1A1A1A] placeholder:text-[#4A4A4A]"
                        placeholder="First name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={formData.customerLastName}
                        onChange={(e) =>
                          updateFormData("customerLastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#CAD2C5] rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] text-[#1A1A1A] placeholder:text-[#4A4A4A]"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        updateFormData("customerEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-[#CAD2C5] rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] text-[#1A1A1A] placeholder:text-[#4A4A4A]"
                      placeholder="The file will be sent here"
                      required
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-2">
                    Payment method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateFormData("paymentProvider", "STRIPE")
                      }
                      className={`relative flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all ${
                        formData.paymentProvider === "STRIPE"
                          ? "border-[#52796F] bg-gradient-to-br from-[#FFF4ED] to-[#CAD2C5] shadow-lg"
                          : "border-[#CAD2C5] bg-white hover:border-[#84A98C]"
                      }`}
                    >
                      {formData.paymentProvider === "STRIPE" && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#52796F] rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      <div className="h-8 flex items-center justify-center">
                        <img
                          src="/stripe.png"
                          alt="Stripe"
                          className="h-6 w-auto"
                        />
                      </div>

                      <div className="text-center">
                        <span
                          className={`text-xs font-bold block ${
                            formData.paymentProvider === "STRIPE"
                              ? "text-[#52796F]"
                              : "text-[#1A1A1A]"
                          }`}
                        >
                          Card
                        </span>
                        <span className="text-[10px] text-[#4A4A4A]">
                          Visa, Mastercard
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateFormData("paymentProvider", "PAYPAL")
                      }
                      className={`relative flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all ${
                        formData.paymentProvider === "PAYPAL"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                          : "border-[#CAD2C5] bg-white hover:border-[#84A98C]"
                      }`}
                    >
                      {formData.paymentProvider === "PAYPAL" && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      <div className="h-8 flex items-center justify-center">
                        <img
                          src="/paypal.png"
                          alt="PayPal"
                          className="h-6 w-auto"
                        />
                      </div>

                      <div className="text-center">
                        <span
                          className={`text-xs font-bold block ${
                            formData.paymentProvider === "PAYPAL"
                              ? "text-blue-700"
                              : "text-[#1A1A1A]"
                          }`}
                        >
                          PayPal
                        </span>
                        <span className="text-[10px] text-[#4A4A4A]">
                          Fast & Secure
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#CAD2C5] pt-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.acceptRefundPolicy === "true"}
                      onChange={(e) =>
                        updateFormData(
                          "acceptRefundPolicy",
                          e.target.checked ? "true" : "false"
                        )
                      }
                      className="mt-1 w-4 h-4 text-[#52796F] border-[#CAD2C5] rounded focus:ring-[#52796F] focus:ring-2"
                      required
                    />
                    <span className="text-sm text-[#4A4A4A] leading-relaxed">
                      I have read and agree to the{" "}
                      <a
                        href="/refund-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#52796F] hover:text-[#3D5A51] underline font-medium"
                      >
                        Refund Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-[#CAD2C5]">
                  <span className="text-lg font-medium text-[#1A1A1A]">
                    Order total
                  </span>
                  <span className="text-2xl font-bold text-[#52796F]">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
              </div>
            )}

            {/* STRIPE STEP */}
            {checkoutStep === "stripe" && stripeClientSecret && (
              <StripePaymentForm
                clientSecret={stripeClientSecret}
                customerEmail={formData.customerEmail}
                customerName={`${formData.customerFirstName} ${formData.customerLastName}`}
                onPaymentSuccess={handleStripeSuccess}
                onPaymentError={handleStripeError}
                onBack={() => setCheckoutStep("form")}
              />
            )}

            {/* PAYPAL STEP */}
            {checkoutStep === "paypal" && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
                  Processing PayPal payment...
                </h3>
                <p className="text-[#4A4A4A] text-sm">
                  Please wait while we confirm your payment
                </p>
              </div>
            )}

            {/* SUCCESS STEP */}
            {checkoutStep === "success" && (
              <div className="text-center py-12">
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
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Payment successful!
                </h3>
                <p className="text-[#4A4A4A] mb-6">
                  Thank you for your purchase. You will receive a confirmation
                  email shortly, with a link to download your file.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="text-sm text-green-800">
                    <div>
                      <strong>Email:</strong> {formData.customerEmail}
                    </div>
                    <div>
                      <strong>Amount:</strong>{" "}
                      {successData?.finalAmount && successData?.finalCurrency
                        ? formatPriceWithCurrency(
                            successData.finalAmount,
                            successData.finalCurrency
                          )
                        : formatPrice(getCartTotal())}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    clearCart();
                    toggleCart();
                    resetCheckout();
                  }}
                  className="w-full bg-[#52796F] hover:bg-[#3D5A51] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* FOOTER */}
          {(checkoutStep === "cart" || checkoutStep === "form") &&
            cart.items.length > 0 && (
              <div className="border-t border-[#CAD2C5] p-6 bg-[#F8F9FA]">
                {checkoutStep === "cart" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-medium text-[#1A1A1A]">
                        Order total
                      </span>
                      <span className="text-2xl font-bold text-[#52796F]">
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        disabled={cart.isConverting}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                          cart.isConverting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#52796F] hover:bg-[#3D5A51] hover:shadow-lg"
                        }`}
                      >
                        {cart.isConverting
                          ? "Updating prices..."
                          : `Checkout - ${formatPrice(getCartTotal())}`}
                      </button>

                      <button
                        onClick={clearCart}
                        className="w-full py-2 px-4 rounded-lg border border-[#CAD2C5] text-[#4A4A4A] hover:bg-white transition-colors duration-200"
                      >
                        Clear cart
                      </button>
                    </div>
                  </>
                )}

                {checkoutStep === "form" && (
                  <div className="space-y-2">
                    <button
                      onClick={processCheckout}
                      disabled={
                        isProcessing ||
                        !formData.customerEmail ||
                        !formData.customerFirstName ||
                        !formData.customerLastName ||
                        formData.acceptRefundPolicy !== "true"
                      }
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                        isProcessing ||
                        !formData.customerEmail ||
                        !formData.customerFirstName ||
                        !formData.customerLastName ||
                        formData.acceptRefundPolicy !== "true"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#52796F] hover:bg-[#3D5A51] hover:shadow-lg"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing…
                        </div>
                      ) : (
                        `Continue - ${formatPrice(getCartTotal())}`
                      )}
                    </button>

                    <button
                      onClick={() => setCheckoutStep("cart")}
                      disabled={isProcessing}
                      className="w-full py-2 px-4 rounded-lg border border-[#CAD2C5] text-[#4A4A4A] hover:bg-white transition-colors duration-200"
                    >
                      Back
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-xs text-[#4A4A4A]">
                  🔒 Secure payment • Instant download
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
