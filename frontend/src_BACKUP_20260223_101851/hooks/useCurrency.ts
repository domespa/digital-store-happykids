import { useState, useCallback } from "react";
import type { ConversionResponse } from "../types/cart";

function useCurrency() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const convertPrice = useCallback(
    async (
      amount: number,
      fromCurrency: string,
      toCurrency: string,
    ): Promise<ConversionResponse | null> => {
      if (fromCurrency === toCurrency) {
        return {
          convertedAmount: amount,
          rate: 1,
          source: "same",
          timestamp: Date.now(),
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/currency/convert?` +
            new URLSearchParams({
              amount: amount.toString(),
              from: fromCurrency,
              to: toCurrency,
            }),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`API ERROR: ${response.status}`);
        }

        const data = await response.json();

        const convertedAmount =
          data.convertedAmount ?? data.data?.convertedAmount;
        const rate = data.rate ?? data.data?.exchangeRate ?? 1;
        const source = data.source ?? data.data?.source ?? "api";

        if (!convertedAmount) {
          throw new Error("Invalid API response: missing convertedAmount");
        }

        return {
          convertedAmount: convertedAmount,
          rate: rate,
          source: source,
          timestamp: data.timestamp || Date.now(),
        };
      } catch (error) {
        console.warn("CONVERSION FAIL", error);

        const fallbackRates: Record<string, Record<string, number>> = {
          USD: { EUR: 0.91, GBP: 0.77, AUD: 1.5, CAD: 1.36 },
          EUR: { USD: 1.1, GBP: 0.85, AUD: 1.65, CAD: 1.48 },
          GBP: { USD: 1.3, EUR: 1.18, AUD: 1.95, CAD: 1.77 },
          AUD: { USD: 0.67, EUR: 0.61, GBP: 0.51, CAD: 0.91 },
          CAD: { USD: 0.73, EUR: 0.68, GBP: 0.57, AUD: 1.1 },
        };

        const rate = fallbackRates[fromCurrency]?.[toCurrency];

        if (rate) {
          setError("CHANGE APPROX");
          return {
            convertedAmount: Math.round(amount * rate * 100) / 100,
            rate,
            source: "fallback",
            timestamp: Date.now(),
          };
        } else {
          setError("CONVS NOT AVAIBLE");
          return null;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL],
  );

  const convertPriceList = useCallback(
    async (
      items: Array<{ amount: number; fromCurrency: string }>,
      toCurrency: string,
    ): Promise<ConversionResponse[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/currency/convert-batch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            targetCurrency: toCurrency,
          }),
        });

        if (!response.ok) {
          throw new Error(`FAIL BATCH: ${response.status}`);
        }

        const data = await response.json();
        return data.conversions;
      } catch (error) {
        console.warn("FAIL BATCH", error);

        const conversions: ConversionResponse[] = [];

        for (const item of items) {
          const conversion = await convertPrice(
            item.amount,
            item.fromCurrency,
            toCurrency,
          );

          if (conversion) {
            conversions.push(conversion);
          }
        }
        return conversions;
      } finally {
        setIsLoading(false);
      }
    },
    [convertPrice, API_BASE_URL],
  );

  return {
    convertPrice,
    convertPriceList,
    isLoading,
    error,
  };
}

export default useCurrency;
