import { useEffect, useCallback, useState, useRef } from "react";
import { useCart } from "./useCart";
import type { LandingContextType } from "../types/landing";
import type { ProductToAdd } from "../types/cart";
import { trackAddToCart } from "../utils/analytics";

interface BackendProduct {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  images?: Array<{
    url: string;
    altText?: string;
    isMain?: boolean;
  }>;
  currency: string;
}

// ========================
//     COMBINIAMO I TIPI
// ========================
interface UseLandingCart {
  landingContext: LandingContextType;
}

export const useLandingCart = ({ landingContext }: UseLandingCart) => {
  const cart = useCart();
  const { config, user, isLoading: isLoadingUser } = landingContext;
  const [backendProduct, setBackendProduct] = useState<BackendProduct | null>(
    null
  );
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const cartRef = useRef(cart);
  cartRef.current = cart;

  // ========================
  //     PRODOTTO PRESO DA CONFIG
  // ========================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!config?.productId) {
        console.warn("⚠️ productId mancante nel config");
        return;
      }

      setIsLoadingProduct(true);
      try {
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ||
          import.meta.env.VITE_API_URL ||
          "https://api.shethrivesadhd.com";
        const apiUrl = `${baseUrl}/api/products/${config.productId}`;

        console.log("🔍 Fetching product from:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Prodotto non trovato");

        const data = await response.json();
        console.log("✅ Prodotto fetchato dal backend:", data);
        console.log("🖼️ IMMAGINI NEL PRODOTTO:", data.product?.images);

        setBackendProduct(data.product);
      } catch (error) {
        console.error("❌ Errore fetch prodotto:", error);
        console.log("📌 Fallback su prezzi config");
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [config?.productId]);

  const getMainPrice = useCallback((): number => {
    return backendProduct?.price ?? config?.pricing.mainPrice ?? 47;
  }, [backendProduct?.price, config?.pricing.mainPrice]);

  const getOriginalPrice = useCallback((): number => {
    return (
      backendProduct?.compareAtPrice ?? config?.pricing.originalPrice ?? 197
    );
  }, [backendProduct?.compareAtPrice, config?.pricing.originalPrice]);

  // ========================
  //     SINCRO VALUTA
  // ========================
  useEffect(() => {
    if (!isLoadingUser && user?.currency) {
      const currentDisplayCurrency = cartRef.current.getDisplayCurrency();
      if (user.currency !== currentDisplayCurrency) {
        console.log(
          `UPDATE CART ${currentDisplayCurrency} TO ${user.currency}`
        );
        cartRef.current.updateCurrency(user.currency);
      }
    }
  }, [user?.currency, isLoadingUser]);

  // ========================
  //      HELPER
  // ========================
  const addMainProductToCart = useCallback(() => {
    if (!config) return;

    const product: ProductToAdd = {
      id: `main-product-${config.productId}`,
      productId: config.productId || "cmgagj3jr00044emfdvtzucfb",
      name: backendProduct?.name || config.hero.title,
      price: backendProduct?.price ?? config.pricing.mainPrice,
      currency: config.pricing.currency,
      image: backendProduct?.images?.[0]?.url || config.hero.image,
      description: config.hero.subtitle,
    };

    cartRef.current.addItem(product);

    trackAddToCart({
      item_id: product.id,
      item_name: product.name,
      currency: product.currency,
      price: product.price,
      quantity: 1,
    });
  }, [
    config?.productId,
    config?.hero.title,
    config?.hero.subtitle,
    config?.hero.image,
    config?.pricing.mainPrice,
    config?.pricing.currency,
    backendProduct?.name,
    backendProduct?.price,
    backendProduct?.images,
  ]);

  // BONUS
  const addBonusToCart = useCallback(
    (bonusId: string) => {
      if (!config) return;

      const bonus = config.features.bonuses.find((b) => b.id === bonusId);
      if (!bonus) return;

      const product: ProductToAdd = {
        id: `bonus-${bonusId}-${config.productId}`,
        productId: `${config.productId}-${bonusId}`,
        name: bonus.title,
        price: bonus.value,
        currency: config.pricing.currency,
        image: bonus.icon,
        description: bonus.description,
      };

      cartRef.current.addItem(product);

      trackAddToCart({
        item_id: product.id,
        item_name: product.name,
        currency: product.currency,
        price: product.price,
        quantity: 1,
      });
    },
    [config?.productId, config?.pricing.currency, config?.features.bonuses]
  );

  // PASSIAMO VALUTA CORRETTA
  const formatPrice = useCallback(
    (amount: number, currency?: string): string => {
      const displayCurrency = currency || user?.currency || "USD";

      // Currency symbols mapping
      const symbols: Record<string, string> = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        AUD: "$", // Will show as "$45 AUD"
        CAD: "$", // Will show as "$37 CAD"
        JPY: "¥",
        CHF: "CHF",
        SEK: "kr",
        NOK: "kr",
        DKK: "kr",
      };

      const symbol = symbols[displayCurrency] || displayCurrency;

      // Round to whole number for cleaner display
      const rounded = Math.round(amount);

      // Format: $45 AUD (symbol + amount + code)
      return `${symbol}${rounded} ${displayCurrency}`;
    },
    [user?.currency]
  );

  // CALC SAVING
  const calculateSaving = useCallback((): {
    originalPrice: number;
    mainPrice: number;
    savings: number;
    savingsPercentage: number;
    currency: string;
  } | null => {
    if (!config) return null;

    const currency = user?.currency || config.pricing.currency;
    const originalPrice = getOriginalPrice();
    const mainPrice = getMainPrice();

    const savings = originalPrice - mainPrice;
    const savingsPercentage = Math.round((savings / originalPrice) * 100);

    return {
      originalPrice,
      mainPrice,
      savings,
      savingsPercentage,
      currency,
    };
  }, [
    config?.pricing.currency,
    user?.currency,
    backendProduct?.price,
    backendProduct?.compareAtPrice,
    config?.pricing.mainPrice,
    config?.pricing.originalPrice,
  ]);

  // ============================
  //      COMBINIAMO GLI STATI
  // ============================

  const isLoading = isLoadingUser || cart.cart.isConverting || isLoadingProduct;

  return {
    // RITORNIAMO LO STATO DEL CARRELLO
    cart: cart.cart,
    cartActions: {
      addItem: cart.addItem,
      removeItem: cart.removeItem,
      updateQuantity: cart.updateQuantity,
      clearCart: cart.clearCart,
      toggleCart: cart.toggleCart,
    },

    // LE FUNZIONI
    addMainProductToCart,
    addBonusToCart,
    formatPrice,
    calculateSaving,

    isLoading,
    isLoadingUser,
    isLoadingProduct,
    userCurrency: user?.currency,

    mainPrice: backendProduct?.price ?? config?.pricing.mainPrice ?? 47,
    originalPrice: config?.pricing.originalPrice ?? 197,
    backendProduct,

    // I METODI PER LE CONVERSIONI DELLA VALUTA
    updateCurrency: cart.updateCurrency,
    refreshRates: cart.refreshRates,
  };
};
