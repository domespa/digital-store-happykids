// ============================================
//              TYPE DEFINITIONS
// ============================================

interface BaseDataLayerEvent {
  event: string;
}

interface PageViewEvent extends BaseDataLayerEvent {
  event: "page_view";
  page_path: string;
  page_title: string;
  page_location: string;
}

interface EcommerceEvent extends BaseDataLayerEvent {
  ecommerce: {
    currency: string;
    value: number;
    items: EcommerceItem[];
    transaction_id?: string;
    tax?: number;
    shipping?: number;
    shipping_tier?: string;
    payment_type?: string;
  };
}

interface SearchEvent extends BaseDataLayerEvent {
  event: "search";
  search_term: string;
}

interface NewsletterSignupEvent extends BaseDataLayerEvent {
  event: "newsletter_signup";
  method: string;
}

interface ButtonClickEvent extends BaseDataLayerEvent {
  event: "button_click";
  button_name: string;
  button_location: string;
}

interface CustomEvent extends BaseDataLayerEvent {
  [key: string]: unknown;
}

interface MetaPixelPurchaseEvent extends BaseDataLayerEvent {
  event: "Purchase";
  value: number;
  currency: string;
  content_ids: string[];
  content_type: string;
  num_items: number;
}

type DataLayerEvent =
  | PageViewEvent
  | EcommerceEvent
  | SearchEvent
  | NewsletterSignupEvent
  | ButtonClickEvent
  | CustomEvent
  | MetaPixelPurchaseEvent;

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity: number;
  currency?: string;
}

interface CookieConsent {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

declare global {
  interface Window {
    dataLayer: any[];
    fbq?: (action: string, event: string, params?: Record<string, any>) => void;
  }
}

// ============================================
//          HELPER FUNCTIONS
// ============================================

const isTrackingEnabled = (): boolean => {
  const isProduction = import.meta.env.VITE_ENV === "production";
  const hasGTM = !!import.meta.env.VITE_GTM_ID;

  return isProduction && hasGTM;
};

const isMetaPixelEnabled = (): boolean => {
  return typeof window !== "undefined" && typeof window.fbq === "function";
};

const shouldLog = (): boolean => {
  return import.meta.env.VITE_ENABLE_TRACKING_LOGS === "true";
};

const pushToDataLayer = (event: DataLayerEvent): void => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);

  if (shouldLog()) {
    console.log("📊 Analytics Event:", event);
  }
};

const trackMetaPixel = (event: string, params?: Record<string, any>): void => {
  if (!isMetaPixelEnabled()) {
    if (shouldLog()) {
      console.warn("📘 Meta Pixel not loaded");
    }
    return;
  }

  try {
    window.fbq!("track", event, params);
    if (shouldLog()) {
      console.log(`📘 Meta Pixel: ${event}`, params);
    }
  } catch (error) {
    console.error("Meta Pixel error:", error);
  }
};

// ============================================
//          TRACKING FUNCTIONS
// ============================================

export const trackPageView = (path: string, title?: string): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Page view:", path, title);
    }
    return;
  }

  pushToDataLayer({
    event: "page_view",
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

export const trackViewItem = (product: EcommerceItem): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] View item:", product.item_name);
    }
    return;
  }

  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: product.currency || "EUR",
      value: product.price,
      items: [product],
    },
  });

  trackMetaPixel("ViewContent", {
    content_ids: [product.item_id],
    content_type: "product",
    content_name: product.item_name,
    value: product.price,
    currency: product.currency || "EUR",
  });
};

export const trackAddToCart = (product: EcommerceItem): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log(
        "📊 [DEV] Add to cart:",
        product.item_name,
        "x",
        product.quantity
      );
    }
    return;
  }

  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: product.currency || "EUR",
      value: product.price * product.quantity,
      items: [product],
    },
  });

  trackMetaPixel("AddToCart", {
    content_ids: [product.item_id],
    content_type: "product",
    content_name: product.item_name,
    value: product.price * product.quantity,
    currency: product.currency || "EUR",
    num_items: product.quantity,
  });
};

export const trackRemoveFromCart = (product: EcommerceItem): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Remove from cart:", product.item_name);
    }
    return;
  }

  pushToDataLayer({
    event: "remove_from_cart",
    ecommerce: {
      currency: product.currency || "EUR",
      value: product.price * product.quantity,
      items: [product],
    },
  });
};

export const trackViewCart = (
  items: EcommerceItem[],
  totalValue: number,
  currency: string = "EUR"
): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log(
        "📊 [DEV] View cart:",
        items.length,
        "items,",
        totalValue,
        currency
      );
    }
    return;
  }

  pushToDataLayer({
    event: "view_cart",
    ecommerce: {
      currency,
      value: totalValue,
      items,
    },
  });
};

export const trackBeginCheckout = (
  items: EcommerceItem[],
  totalValue: number,
  currency: string = "EUR"
): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Begin checkout:", totalValue, currency);
    }
    return;
  }

  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency,
      value: totalValue,
      items,
    },
  });

  trackMetaPixel("InitiateCheckout", {
    content_ids: items.map((item) => item.item_id),
    content_type: "product",
    value: totalValue,
    currency,
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
  });
};

export const trackAddShippingInfo = (
  items: EcommerceItem[],
  totalValue: number,
  shippingTier: string,
  currency: string = "EUR"
): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Add shipping info:", shippingTier);
    }
    return;
  }

  pushToDataLayer({
    event: "add_shipping_info",
    ecommerce: {
      currency,
      value: totalValue,
      shipping_tier: shippingTier,
      items,
    },
  });
};

export const trackAddPaymentInfo = (
  items: EcommerceItem[],
  totalValue: number,
  paymentType: string,
  currency: string = "EUR"
): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Add payment info:", paymentType);
    }
    return;
  }

  pushToDataLayer({
    event: "add_payment_info",
    ecommerce: {
      currency,
      value: totalValue,
      payment_type: paymentType,
      items,
    },
  });

  trackMetaPixel("AddPaymentInfo", {
    content_type: "product",
    value: totalValue,
    currency,
  });
};

export const trackPurchase = (
  transactionId: string,
  items: EcommerceItem[],
  totalValue: number,
  tax: number = 0,
  shipping: number = 0,
  currency: string = "EUR"
): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Purchase:", transactionId, totalValue, currency);
    }
    return;
  }

  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: transactionId,
      currency,
      value: totalValue,
      tax,
      shipping,
      items,
    },
  });

  pushToDataLayer({
    event: "Purchase",
    value: totalValue,
    currency,
    content_ids: items.map((item) => item.item_id),
    content_type: "product",
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
  });

  trackMetaPixel("Purchase", {
    value: totalValue,
    currency,
    content_ids: items.map((item) => item.item_id),
    content_type: "product",
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    transaction_id: transactionId,
  });
};

export const trackSearch = (searchTerm: string): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Search:", searchTerm);
    }
    return;
  }

  pushToDataLayer({
    event: "search",
    search_term: searchTerm,
  });
};

export const trackCustomEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Custom event:", eventName, eventParams);
    }
    return;
  }

  pushToDataLayer({
    event: eventName,
    ...eventParams,
  });
};

export const trackNewsletterSignup = (method: string): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Newsletter signup:", method);
    }
    return;
  }

  pushToDataLayer({
    event: "newsletter_signup",
    method,
  });
};

export const trackButtonClick = (
  buttonName: string,
  location: string
): void => {
  if (!isTrackingEnabled()) {
    if (shouldLog()) {
      console.log("📊 [DEV] Button click:", buttonName, "at", location);
    }
    return;
  }

  pushToDataLayer({
    event: "button_click",
    button_name: buttonName,
    button_location: location,
  });
};

export const initializeAnalytics = (): void => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  if (shouldLog()) {
    console.log("📊 Analytics initialized");
    console.log("   Environment:", import.meta.env.VITE_ENV);
    console.log("   GTM ID:", import.meta.env.VITE_GTM_ID || "Not set");
    console.log("   Tracking enabled:", isTrackingEnabled());
  }
};

// ============================================
//              CONSENT HELPERS
// ============================================

export const hasAnalyticsConsent = (): boolean => {
  const consent = localStorage.getItem("cookie_consent");
  if (!consent) return false;

  try {
    const parsed: CookieConsent = JSON.parse(consent);
    return parsed.analytics === true;
  } catch {
    return false;
  }
};

export const hasMarketingConsent = (): boolean => {
  const consent = localStorage.getItem("cookie_consent");
  if (!consent) return false;

  try {
    const parsed: CookieConsent = JSON.parse(consent);
    return parsed.marketing === true;
  } catch {
    return false;
  }
};
