import { useEffect, useCallback, useRef, useState } from "react";
import { useCart } from "./useCart";
import { useLandingContext } from "../context/LandingContext";
import type { ProductToAdd } from "../types/cart";
import { trackAddToCart } from "../utils/analytics";

interface ConvertedPrices {
  mainPrice: number;
  originalPrice: number;
  currency: string;
  formattedMainPrice: string;
  formattedOriginalPrice: string;
}

export const useLandingCart = () => {
  const cart = useCart();
  const {
    config,
    user,
    isLoading: isLoadingUser,
    backendProduct,
    isLoadingProduct,
  } = useLandingContext();

  const cartRef = useRef(cart);
  cartRef.current = cart;

  // ========================
  //   STATE PREZZI CONVERTITI
  // ========================
  const [convertedPrices, setConvertedPrices] = useState<ConvertedPrices>({
    mainPrice: 0,
    originalPrice: 0,
    currency: "EUR",
    formattedMainPrice: "€0 EUR",
    formattedOriginalPrice: "€0 EUR",
  });

  const [isConverting, setIsConverting] = useState(false);

  // ========================
  //   FORMAT HELPER
  // ========================
  const formatPriceSync = useCallback(
    (amount: number, currency: string): string => {
      const currencyLocales: Record<string, string> = {
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

      const locale = currencyLocales[currency] || "en-US";

      const formatted = amount.toLocaleString(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      // ✅ Per valute con simbolo "$" ambiguo, aggiungi sempre il codice
      const ambiguousCurrencies = ["USD", "CAD", "AUD"];

      if (ambiguousCurrencies.includes(currency)) {
        // Rimuovi il codice valuta che toLocaleString aggiunge automaticamente
        // e lo sostituiamo con uno spazio + codice per più chiarezza
        return formatted.replace(currency, "").trim() + " " + currency;
      }

      return formatted;
    },
    [],
  );

  // ========================
  //   AUTO-CONVERT PRICES
  // ========================
  useEffect(() => {
    const convertPrices = async () => {
      if (!backendProduct || !user?.currency) {
        console.log("⏳ Waiting for data...", {
          hasProduct: !!backendProduct,
          hasCurrency: !!user?.currency,
        });
        return;
      }

      const productPrice = backendProduct.price;
      const productCurrency = backendProduct.currency || "EUR";
      const productCompareAt = backendProduct.compareAtPrice || productPrice;
      const targetCurrency = user.currency;

      // Stesso currency - no conversion
      if (productCurrency === targetCurrency) {
        setConvertedPrices({
          mainPrice: productPrice,
          originalPrice: productCompareAt,
          currency: productCurrency,
          formattedMainPrice: formatPriceSync(productPrice, productCurrency),
          formattedOriginalPrice: formatPriceSync(
            productCompareAt,
            productCurrency,
          ),
        });
        return;
      }

      console.log("🔄 Conversion triggered:", {
        hasProduct: !!backendProduct,
        productId: backendProduct?.id,
        currency: user?.currency,
      });

      // ✅ Conversione necessaria
      setIsConverting(true);

      try {
        const apiBase =
          import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

        const [mainConv, compareConv] = await Promise.all([
          fetch(
            `${apiBase}/api/currency/convert?` +
              new URLSearchParams({
                amount: productPrice.toString(),
                from: productCurrency,
                to: targetCurrency,
              }),
          ).then((r) => (r.ok ? r.json() : null)),
          fetch(
            `${apiBase}/api/currency/convert?` +
              new URLSearchParams({
                amount: productCompareAt.toString(),
                from: productCurrency,
                to: targetCurrency,
              }),
          ).then((r) => (r.ok ? r.json() : null)),
        ]);

        if (mainConv && compareConv) {
          const convertedMain =
            mainConv.convertedAmount ?? mainConv.data?.convertedAmount;
          const convertedCompare =
            compareConv.convertedAmount ?? compareConv.data?.convertedAmount;

          setConvertedPrices({
            mainPrice: convertedMain,
            originalPrice: convertedCompare,
            currency: targetCurrency,
            formattedMainPrice: formatPriceSync(convertedMain, targetCurrency),
            formattedOriginalPrice: formatPriceSync(
              convertedCompare,
              targetCurrency,
            ),
          });
        } else {
          // Fallback rates
          const fallbackRates: Record<string, Record<string, number>> = {
            USD: { EUR: 0.91, GBP: 0.77, AUD: 1.5, CAD: 1.35 },
            EUR: { USD: 1.1, GBP: 0.85, AUD: 1.65, CAD: 1.48 },
            GBP: { USD: 1.3, EUR: 1.18, AUD: 1.95, CAD: 1.75 },
            AUD: { USD: 0.67, EUR: 0.61, GBP: 0.51, CAD: 0.9 },
          };

          const rate = fallbackRates[productCurrency]?.[targetCurrency] || 1;
          const convertedMain = productPrice * rate;
          const convertedCompare = productCompareAt * rate;

          setConvertedPrices({
            mainPrice: convertedMain,
            originalPrice: convertedCompare,
            currency: targetCurrency,
            formattedMainPrice: formatPriceSync(convertedMain, targetCurrency),
            formattedOriginalPrice: formatPriceSync(
              convertedCompare,
              targetCurrency,
            ),
          });
        }
      } catch (error) {
        console.error("Price conversion failed", error);

        // In caso di errore, usa il prezzo originale
        setConvertedPrices({
          mainPrice: productPrice,
          originalPrice: productCompareAt,
          currency: productCurrency,
          formattedMainPrice: formatPriceSync(productPrice, productCurrency),
          formattedOriginalPrice: formatPriceSync(
            productCompareAt,
            productCurrency,
          ),
        });
      } finally {
        setIsConverting(false);
      }
    };

    convertPrices();
  }, [backendProduct, user?.currency, formatPriceSync]);

  // ========================
  //     SINCRO VALUTA CART
  // ========================
  useEffect(() => {
    if (!isLoadingUser && user?.currency) {
      const currentDisplayCurrency = cartRef.current.getDisplayCurrency();
      if (user.currency !== currentDisplayCurrency) {
        console.log(
          `UPDATE CART ${currentDisplayCurrency} TO ${user.currency}`,
        );
        cartRef.current.updateCurrency(user.currency);
      }
    }
  }, [user?.currency, isLoadingUser]);

  // ========================
  //   ADD TO CART
  // ========================
  const addMainProductToCart = useCallback(() => {
    if (!config) return;

    const product: ProductToAdd = {
      id: `main-product-${config.productId}`,
      productId: config.productId || "cmkcfleu40000brx7zyn51pla",
      name: backendProduct?.name || config.hero.title,
      price: convertedPrices.mainPrice,
      currency: convertedPrices.currency,
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
    config,
    backendProduct?.name,
    backendProduct?.images,
    convertedPrices.mainPrice,
    convertedPrices.currency,
  ]);
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
    [config],
  );

  // ========================
  //   FORMAT PRICE (SYNC)
  // ========================
  const formatPrice = useCallback(
    (amount: number, currency?: string): string => {
      const displayCurrency = currency || user?.currency || "EUR";
      return formatPriceSync(amount, displayCurrency);
    },
    [user?.currency, formatPriceSync],
  );

  // ========================
  //   CALCULATE SAVING
  // ========================
  const calculateSaving = useCallback(() => {
    const savings = convertedPrices.originalPrice - convertedPrices.mainPrice;
    const savingsPercentage = Math.round(
      (savings / convertedPrices.originalPrice) * 100,
    );

    return {
      originalPrice: convertedPrices.originalPrice,
      mainPrice: convertedPrices.mainPrice,
      savings,
      savingsPercentage,
      currency: convertedPrices.currency,
    };
  }, [convertedPrices]);

  // ============================
  //   COMBINIAMO GLI STATI
  // ============================
  const isLoading =
    isLoadingUser || cart.cart.isConverting || isLoadingProduct || isConverting;

  return {
    // CART STATE
    cart: cart.cart,
    cartActions: {
      addItem: cart.addItem,
      removeItem: cart.removeItem,
      updateQuantity: cart.updateQuantity,
      clearCart: cart.clearCart,
      toggleCart: cart.toggleCart,
    },

    // FUNZIONI
    addMainProductToCart,
    addBonusToCart,
    formatPrice,
    calculateSaving,

    // PREZZI GIÀ CONVERTITI E FORMATTATI
    mainPrice: convertedPrices.mainPrice,
    originalPrice: convertedPrices.originalPrice,
    formattedMainPrice: convertedPrices.formattedMainPrice,
    formattedOriginalPrice: convertedPrices.formattedOriginalPrice,
    displayCurrency: convertedPrices.currency,

    // STATI
    isLoading,
    isLoadingUser,
    isLoadingProduct,
    isConverting,
    userCurrency: user?.currency,

    // BACKEND DATA
    backendProduct,

    // CURRENCY METHODS
    updateCurrency: cart.updateCurrency,
    refreshRates: cart.refreshRates,
  };
};
