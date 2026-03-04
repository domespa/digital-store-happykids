import type { PublicProductResponse } from "../types/product";
import { useMemo } from "react";

interface PriceSavingsResponse {
  savings: number;
  savingsPercentage: number;
  formattedSavings: string;
  formattedOriginalPrice: string;
  formattedCurrentPrice: string;
  hasSavings: boolean;
}

export function useSavings(
  product: PublicProductResponse | null | undefined,
): PriceSavingsResponse {
  // CALCOLIAMO IL RISPARMIO SOLO QUANDO IL PRODOTTO CAMBIA
  return useMemo(() => {
    if (!product) {
      return {
        savings: 0,
        savingsPercentage: 0,
        formattedSavings: "",
        formattedOriginalPrice: "",
        formattedCurrentPrice: "",
        hasSavings: false,
      };
    }
    const currentPrice = product.displayPrice;
    const originalPrice = product.displayCompareAtPrice;
    const currency = product.currency;

    const savingsAmount = originalPrice - currentPrice;
    const savingsPercent =
      originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;

    const hasDiscount = savingsAmount > 0;

    // HELPER PER FORMATTARE I PREZZI
    const formatedPrice = (amount: number): string => {
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      } catch (error) {
        return `${amount.toFixed(2)} ${currency}`;
      }
    };

    const formattedSavings = formatedPrice(savingsAmount);
    const formattedOriginalPrice = formatedPrice(originalPrice);
    const formattedCurrentPrice = formatedPrice(currentPrice);

    return {
      savings: savingsAmount,
      savingsPercentage: savingsPercent,
      formattedSavings,
      formattedOriginalPrice,
      formattedCurrentPrice,
      hasSavings: hasDiscount,
    };
  }, [product]);
}
