import { useCart } from "../../hooks/useCart";
import { useEffect, useState, useCallback } from "react";
import { useCheckout } from "../../hooks/useCheckout";
import StripePaymentForm from "../StripePaymentForm";
import type { CheckoutForm } from "../../types/checkout";
import {
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
} from "../../utils/analytics";
import WorkbookPreviewModal from "../landing/WorkbookPreviewModal";
import { useLandingAnalytics } from "../../hooks/useLandingAnalytics";

interface CartSlideBar {
  className?: string;
}

type CheckoutStep = "cart" | "form" | "stripe" | "paypal" | "success";

const formatPriceWithCurrency = (amount: number, currency: string): string => {
  const locales: Record<string, string> = {
    USD: "en-US",
    GBP: "en-GB",
    AUD: "en-AU",
    CAD: "en-CA",
    EUR: "it-IT",
    JPY: "ja-JP",
    CHF: "de-CH",
    SEK: "sv-SE",
    NOK: "nb-NO",
    DKK: "da-DK",
  };

  return amount.toLocaleString(locales[currency] || "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function CartSlideBar({ className }: CartSlideBar = {}) {
  const {
    cart,
    addItem,
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
  const [isWorkbooksExpanded, setIsWorkbooksExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<CheckoutForm>({
    customerEmail: "",
    customerFirstName: "",
    customerLastName: "",
    paymentProvider: "STRIPE",
    acceptRefundPolicy: "false",
  });

  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null,
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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedWorkbookForPreview, setSelectedWorkbookForPreview] = useState<{
    name: string;
    images: string[];
  } | null>(null);

  const { trackCtaClick } = useLandingAnalytics();

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

  // Track Purchase quando l'ordine è completato
  useEffect(() => {
    if (checkoutStep === "success" && successData) {
      const transactionId =
        successData.orderId || successData.id || crypto.randomUUID();
      const orderValue =
        successData.finalAmount || successData.total || calculateTotal();
      const currency = successData.finalCurrency || getDisplayCurrency();

      // items per tracking
      const items =
        successData.orderItems?.map((item) => ({
          item_id: item.productId,
          item_name: item.product?.name || "Product",
          price: item.price,
          quantity: item.quantity,
        })) ||
        cart.items.map((item) => ({
          item_id: item.productId,
          item_name: item.name,
          price: item.displayPrice,
          quantity: item.quantity,
        }));

      trackPurchase(transactionId, items, orderValue, 0, 0, currency);

      console.log("📊 Purchase tracked:", transactionId, orderValue, currency);
    }
  }, [checkoutStep, successData]);

  const formatPrice = (amount: number): string => {
    const currency = getDisplayCurrency();

    const locales: Record<string, string> = {
      USD: "en-US",
      GBP: "en-GB",
      AUD: "en-AU",
      CAD: "en-CA",
      EUR: "it-IT",
      JPY: "ja-JP",
      CHF: "de-CH",
      SEK: "sv-SE",
      NOK: "nb-NO",
      DKK: "da-DK",
    };

    return amount.toLocaleString(locales[currency] || "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ========================
  //   WORKBOOKS CONFIG
  // ========================
  const WORKBOOKS_PRICE_EUR = 15; // Prezzo in EUR
  const INDIVIDUAL_WORKBOOK_PRICE_EUR = 5; // Prezzo in EUR
  const WORKBOOKS_BUNDLE_ID = "cmkfg5osj0005mlb9u0blcig9";

  const workbooks = [
    {
      id: "cmkgme4jd0000a59mmfw1523f",
      name: "A Rainbow of Colors",
      pages: 47,
      priceEUR: 5,
      image: "/cover-ebook/ranibowofcolors.jpg",
    },
    {
      id: "cmkgme52g0001a59mltiz39wx",
      name: "Letters and Numbers in Play",
      pages: 60,
      priceEUR: 5,
      image: "/cover-ebook/lettersnumbersinplay.jpg",
    },
    {
      id: "cmkgme5jn0002a59mxqg8yxah",
      name: "My First Writing Adventure",
      pages: 59,
      priceEUR: 5,
      image: "/cover-ebook/myfirstadventure.jpg",
    },
    {
      id: "cmkgme60s0003a59mwtnpoutt",
      name: "The Big Book of Animals and Dinosaurs",
      pages: 64,
      priceEUR: 5,
      image: "/cover-ebook/animals.jpg",
    },
    {
      id: "cmkgme6hx0004a59m76ln9301",
      name: "World of Shapes",
      pages: 65,
      priceEUR: 5,
      image: "/cover-ebook/worldofshapes.jpg",
    },
  ];

  const workbooksPreviewImages: Record<string, string[]> = {
    cmkgme4jd0000a59mmfw1523f: [
      // A Rainbow of Colors
      "/extractebooks/arainbow1.jpg",
      "/extractebooks/arainbow2.jpg",
      "/extractebooks/arainbow3.jpg",
      "/extractebooks/arainbow4.jpg",
    ],
    cmkgme52g0001a59mltiz39wx: [
      // Letters and Numbers
      "/extractebooks/letter1.jpg",
      "/extractebooks/letter2.jpg",
      "/extractebooks/letter3.jpg",
      "/extractebooks/letter4.jpg",
    ],
    cmkgme5jn0002a59mxqg8yxah: [
      // My First Writing
      "/extractebooks/writing1.jpg",
      "/extractebooks/writing2.jpg",
      "/extractebooks/writing3.jpg",
      "/extractebooks/writing4.jpg",
    ],
    cmkgme60s0003a59mwtnpoutt: [
      // Animals and Dinosaurs
      "/extractebooks/animals1.jpg",
      "/extractebooks/animals2.jpg",
      "/extractebooks/animals3.jpg",
      "/extractebooks/animals4.jpg",
    ],
    cmkgme6hx0004a59m76ln9301: [
      // World of Shapes
      "/extractebooks/shapes1.jpg",
      "/extractebooks/shapes2.jpg",
      "/extractebooks/shapes3.jpg",
      "/extractebooks/shapes4.jpg",
    ],
  };

  const openPreview = (workbookId: string, workbookName: string) => {
    const previewImages = workbooksPreviewImages[workbookId];
    if (previewImages) {
      setSelectedWorkbookForPreview({
        name: workbookName,
        images: previewImages,
      });
      setShowPreviewModal(true);
    }
  };
  // ========================
  //   CONVERTI PREZZI WORKBOOKS
  // ========================
  const convertWorkbookPrice = useCallback(
    (euroPrice: number): number => {
      const currentCurrency = getDisplayCurrency();

      // Se è già EUR, nessuna conversione
      if (currentCurrency === "EUR") {
        return euroPrice;
      }

      // Fallback rates
      const fallbackRates: Record<string, number> = {
        USD: 1.1,
        GBP: 0.85,
        AUD: 1.65,
        CAD: 1.48,
      };

      const rate = fallbackRates[currentCurrency] || 1;
      return Math.round(euroPrice * rate * 100) / 100;
    },
    [getDisplayCurrency],
  );

  // Conta quanti workbook sono già nel cart
  const getWorkbooksInCart = () => {
    return cart.items.filter((item) =>
      workbooks.some((wb) => wb.id === item.productId),
    );
  };

  // Check se workbook specifico è nel cart
  const isWorkbookInCart = (workbookId: string) => {
    return cart.items.some(
      (item) =>
        item.productId === workbookId || item.productId === WORKBOOKS_BUNDLE_ID,
    );
  };

  // Check se bundle è nel cart
  const hasBundleInCart = () => {
    return cart.items.some((item) => item.id === WORKBOOKS_BUNDLE_ID);
  };

  // Naviga carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % workbooks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + workbooks.length) % workbooks.length);
  };

  // ========================
  //   ADD TO CART (CON CONVERSIONE)
  // ========================
  const addSingleWorkbook = (workbook: (typeof workbooks)[0]) => {
    const convertedPrice = convertWorkbookPrice(workbook.priceEUR);

    addItem({
      id: `workbook-${workbook.id}`,
      productId: workbook.id,
      name: workbook.name,
      price: convertedPrice,
      currency: getDisplayCurrency(),
      image: workbook.image,
      description: `${workbook.pages} pages workbook for ages 3-5`,
    });
  };

  const addWorkbooksBundle = () => {
    const workbooksInCart = getWorkbooksInCart();
    workbooksInCart.forEach((item) => {
      removeItem(item.id);
    });

    const convertedPrice = convertWorkbookPrice(WORKBOOKS_PRICE_EUR);

    addItem({
      id: `workbooks-bundle-${WORKBOOKS_BUNDLE_ID}`,
      productId: WORKBOOKS_BUNDLE_ID,
      name: "5 Learning Workbooks Bundle",
      price: convertedPrice,
      currency: getDisplayCurrency(),
      image: workbooks[0].image,
      description: "Complete bundle: 295 pages of educational activities",
    });
    setIsWorkbooksExpanded(false);
  };

  // Check se user ha tutti e 5 workbook individuali nel cart
  const hasAllIndividualWorkbooks = (): boolean => {
    const workbooksInCart = getWorkbooksInCart();
    const hasBundle = hasBundleInCart();

    // Se ha già bundle, return false
    if (hasBundle) return false;

    // Check se ha esattamente tutti e 5 workbook individuali
    return workbooksInCart.length === 5;
  };

  // Converti 5 workbook individuali in bundle
  const convertToBundle = () => {
    const workbooksInCart = getWorkbooksInCart();
    workbooksInCart.forEach((item) => {
      removeItem(item.id);
    });

    const convertedPrice = convertWorkbookPrice(WORKBOOKS_PRICE_EUR);
    addItem({
      id: `workbooks-bundle-${WORKBOOKS_BUNDLE_ID}`,
      productId: WORKBOOKS_BUNDLE_ID,
      name: "5 Learning Workbooks Bundle",
      price: convertedPrice,
      currency: getDisplayCurrency(),
      image: workbooks[0].image,
      description: "Complete bundle: 295 pages of educational activities",
    });
    setIsWorkbooksExpanded(false);
  };

  const calculateTotal = (): number => {
    return getCartTotal();
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;

    const itemsToTrack = [
      ...cart.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.displayPrice,
        quantity: item.quantity,
      })),
    ];

    trackBeginCheckout(itemsToTrack, calculateTotal(), cart.displayCurrency);

    trackCtaClick("checkout_button", {
      total: calculateTotal(),
      itemsCount: cart.items.length,
    });

    clearError();
    setCheckoutStep("form");
  };

  const updateFormData = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "customerEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value) && !formData.customerEmail.includes("@")) {
        trackCtaClick("email_entered", { hasEmail: true });
      }
    }
    if (field === "paymentProvider") {
      trackCtaClick("payment_method_selected", { provider: value });
    }
    if (field === "acceptRefundPolicy" && value === "true") {
      trackCtaClick("refund_policy_accepted", { accepted: true });
    }
  };
  const processCheckout = async () => {
    try {
      trackCtaClick("continue_payment_button", {
        paymentProvider: formData.paymentProvider,
        total: calculateTotal(),
      });

      const hasBundle = cart.items.some(
        (item) => item.productId === WORKBOOKS_BUNDLE_ID,
      );

      const discountCode = hasBundle ? "BUNDLE20" : undefined;
      const result = await processCheckoutData(formData, discountCode);

      if (result.success) {
        trackAddPaymentInfo(
          cart.items.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.displayPrice,
            quantity: item.quantity,
          })),
          calculateTotal(),
          formData.paymentProvider,
          getDisplayCurrency(),
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
    const finalAmount = calculateTotal();
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
          <div className="flex items-center justify-between border-b border-[#e2e8f0] p-6 bg-[#f8fafc]">
            <div>
              <h2 className="text-lg font-semibold text-[#1e293b]">
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
              className="rounded-lg p-2 text-[#64748b] hover:text-[#1e293b] hover:bg-white transition-colors"
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

          {/* CONTENUTO DINAMICO - SCROLLABILE */}
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
                  <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
                    <div className="flex items-center gap-2 text-sm text-[#2563eb]">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2563eb]"></div>
                      Updating prices...
                    </div>
                  </div>
                )}

                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-[#64748b] mb-4">
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
                    <h3 className="text-lg font-medium text-[#1e293b] mb-2">
                      Your cart is empty
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors"
                      >
                        <div className="w-20 h-30 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-lg flex items-center justify-center flex-shrink-0">
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
                          <h3 className="font-medium text-[#1e293b] text-sm leading-tight">
                            {item.name}
                          </h3>

                          {item.description && (
                            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="font-semibold text-[#2563eb]">
                              {formatPrice(item.displayPrice)}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all active:scale-95"
                              >
                                -
                              </button>

                              <span className="w-8 text-center text-sm font-medium text-[#1e293b]">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all active:scale-95"
                              >
                                +
                              </button>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="ml-2 p-1 text-red-400 hover:text-red-600 transition-colors"
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

            {/* BUNDLE CONVERSION BANNER */}
            {checkoutStep === "cart" && hasAllIndividualWorkbooks() && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-orange-300 rounded-xl shadow-lg animate-pulse-slow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-orange-900 mb-1">
                      💰 Smart Savings Opportunity!
                    </h3>
                    <p className="text-sm text-orange-800 mb-3">
                      You have all 5 workbooks! Get the bundle discount and{" "}
                      <strong>
                        save {formatPrice(convertWorkbookPrice(10))}
                      </strong>
                      ({formatPrice(convertWorkbookPrice(15))} instead of{" "}
                      {formatPrice(convertWorkbookPrice(25))})
                    </p>
                    <button
                      onClick={convertToBundle}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold text-sm transition-all active:scale-95 shadow-md"
                    >
                      ⭐ Apply Bundle Discount - Save{" "}
                      {formatPrice(convertWorkbookPrice(10))}!
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FORM STEP */}
            {checkoutStep === "form" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1e293b]">
                  Information for checkout
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1e293b] mb-1">
                        First name
                      </label>
                      <input
                        type="text"
                        value={formData.customerFirstName}
                        onChange={(e) =>
                          updateFormData("customerFirstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] text-[#1e293b] placeholder:text-[#64748b] transition-all"
                        placeholder="First name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1e293b] mb-1">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={formData.customerLastName}
                        onChange={(e) =>
                          updateFormData("customerLastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] text-[#1e293b] placeholder:text-[#64748b] transition-all"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e293b] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        updateFormData("customerEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] text-[#1e293b] placeholder:text-[#64748b] transition-all"
                      placeholder="The file will be sent here"
                      required
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-xs font-medium text-[#1e293b] mb-2">
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
                          ? "border-[#2563eb] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                          : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                      }`}
                    >
                      {formData.paymentProvider === "STRIPE" && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#2563eb] rounded-full flex items-center justify-center">
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
                              ? "text-[#2563eb]"
                              : "text-[#1e293b]"
                          }`}
                        >
                          Card
                        </span>
                        <span className="text-[10px] text-[#64748b]">
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
                          : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
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
                              : "text-[#1e293b]"
                          }`}
                        >
                          PayPal
                        </span>
                        <span className="text-[10px] text-[#64748b]">
                          Fast & Secure
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#e2e8f0] pt-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.acceptRefundPolicy === "true"}
                      onChange={(e) =>
                        updateFormData(
                          "acceptRefundPolicy",
                          e.target.checked ? "true" : "false",
                        )
                      }
                      className="mt-1 w-4 h-4 text-[#2563eb] border-[#e2e8f0] rounded focus:ring-[#2563eb] focus:ring-2"
                      required
                    />
                    <span className="text-sm text-[#64748b] leading-relaxed">
                      I have read and agree to the{" "}
                      <a
                        href="/refund-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563eb] hover:text-[#1d4ed8] underline font-medium"
                      >
                        Refund Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-[#e2e8f0]">
                  <span className="text-lg font-medium text-[#1e293b]">
                    Order total
                  </span>
                  <span className="text-2xl font-bold text-[#2563eb]">
                    {formatPrice(calculateTotal())}
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
                <h3 className="text-lg font-medium text-[#1e293b] mb-2">
                  Processing PayPal payment...
                </h3>
                <p className="text-[#64748b] text-sm">
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
                <h3 className="text-xl font-semibold text-[#1e293b] mb-2">
                  Payment successful!
                </h3>
                <p className="text-[#64748b] mb-6">
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
                            successData.finalCurrency,
                          )
                        : formatPrice(calculateTotal())}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    clearCart();
                    toggleCart();
                    resetCheckout();
                  }}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* FREQUENTLY BOUGHT TOGETHER - ACCORDION */}
          {checkoutStep === "cart" &&
            cart.items.length > 0 &&
            !hasBundleInCart() && (
              <div className="border-t border-[#e2e8f0] p-4 bg-[#f8fafc]">
                <button
                  onClick={() => setIsWorkbooksExpanded(!isWorkbooksExpanded)}
                  className="w-full p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-[#1e293b]">
                          Frequently bought together
                        </h3>
                        <p className="text-xs text-[#64748b]">
                          5 Learning Workbooks Bundle • Save{" "}
                          {formatPrice(convertWorkbookPrice(10))}!
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-[#64748b] transition-transform ${
                        isWorkbooksExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isWorkbooksExpanded
                      ? "max-h-[800px] opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <div className="p-4 bg-white border-2 border-blue-200 rounded-xl">
                    <div className="mb-4">
                      <div className="relative">
                        {/* Book Image - CLICCABILE per preview */}
                        <div
                          className="m-auto w-32 sm:w-40 md:w-48 aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden mb-3 cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all group relative"
                          onClick={() =>
                            openPreview(
                              workbooks[currentSlide].id,
                              workbooks[currentSlide].name,
                            )
                          }
                        >
                          <img
                            src={workbooks[currentSlide].image}
                            alt={workbooks[currentSlide].name}
                            className="w-full h-full object-cover"
                          />

                          {/* Overlay "Preview" al hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">
                              👁️ Preview Pages
                            </span>
                          </div>
                        </div>

                        {workbooks.length > 1 && (
                          <>
                            <button
                              onClick={prevSlide}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                            >
                              <svg
                                className="w-5 h-5 text-[#1e293b]"
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
                              onClick={nextSlide}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                            >
                              <svg
                                className="w-5 h-5 text-[#1e293b]"
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
                          </>
                        )}

                        <div className="flex justify-center gap-1 mt-2">
                          {workbooks.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`h-1.5 rounded-full transition-all ${
                                index === currentSlide
                                  ? "w-6 bg-blue-600"
                                  : "w-1.5 bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-center mb-3">
                        <h4 className="font-bold text-[#1e293b] text-sm mb-1">
                          {workbooks[currentSlide].name}
                        </h4>
                        <p className="text-xs text-[#64748b]">
                          {workbooks[currentSlide].pages} pages
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          addSingleWorkbook(workbooks[currentSlide])
                        }
                        disabled={isWorkbookInCart(workbooks[currentSlide].id)}
                        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                          isWorkbookInCart(workbooks[currentSlide].id)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                        }`}
                      >
                        {isWorkbookInCart(workbooks[currentSlide].id)
                          ? "✓ In Cart"
                          : `Add This Book - ${formatPrice(
                              convertWorkbookPrice(
                                INDIVIDUAL_WORKBOOK_PRICE_EUR,
                              ),
                            )}`}
                      </button>
                    </div>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-[#64748b]">or</span>
                      </div>
                    </div>

                    <button
                      onClick={addWorkbooksBundle}
                      className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold text-sm transition-all active:scale-95 shadow-md"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>
                          ⭐ Get All 5 Books for{" "}
                          {formatPrice(
                            convertWorkbookPrice(WORKBOOKS_PRICE_EUR),
                          )}
                        </span>
                      </div>
                      <div className="text-xs opacity-90 mt-1">
                        Save {formatPrice(convertWorkbookPrice(10))} vs buying
                        separately!
                      </div>
                    </button>

                    <div className="mt-3 text-center text-xs text-[#64748b]">
                      295 pages • Instant download
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* FOOTER */}
          {(checkoutStep === "cart" || checkoutStep === "form") &&
            cart.items.length > 0 && (
              <div className="border-t border-[#e2e8f0] p-6 bg-[#f8fafc]">
                {checkoutStep === "cart" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-medium text-[#1e293b]">
                        Order total
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#2563eb]">
                          {formatPrice(calculateTotal())}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        disabled={cart.isConverting}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                          cart.isConverting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#2563eb] hover:bg-[#1d4ed8] hover:shadow-lg active:scale-98"
                        }`}
                      >
                        {cart.isConverting
                          ? "Updating prices..."
                          : `Checkout - ${formatPrice(calculateTotal())}`}
                      </button>

                      <button
                        onClick={clearCart}
                        className="w-full py-2 px-4 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-white hover:border-[#cbd5e1] transition-colors duration-200"
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
                          : "bg-[#2563eb] hover:bg-[#1d4ed8] hover:shadow-lg active:scale-98"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        `Continue - ${formatPrice(calculateTotal())}`
                      )}
                    </button>

                    <button
                      onClick={() => setCheckoutStep("cart")}
                      disabled={isProcessing}
                      className="w-full py-2 px-4 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:bg-white hover:border-[#cbd5e1] transition-colors duration-200"
                    >
                      Back
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-xs text-[#64748b]">
                  🔒 Secure payment • Instant download
                </div>
              </div>
            )}
        </div>
      </div>
      {/* PREVIEW MODAL */}
      {showPreviewModal && selectedWorkbookForPreview && (
        <WorkbookPreviewModal
          workbookName={selectedWorkbookForPreview.name}
          previewImages={selectedWorkbookForPreview.images}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedWorkbookForPreview(null);
          }}
        />
      )}
    </div>
  );
}
