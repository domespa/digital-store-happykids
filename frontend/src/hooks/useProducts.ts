import { useEffect, useState } from "react";
import type {
  ProductListResponse,
  PublicProductResponse,
  UseProductsOptions,
  UseProductsReturn,
} from "../types/product";

export function useProducts(
  options: UseProductsOptions = {},
): UseProductsReturn {
  const { autofetch = true, currency: initialCurrency, filters = {} } = options;

  const [products, setProducts] = useState<PublicProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(autofetch);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState(initialCurrency || "EUR");
  const [retryCount, setRetryCount] = useState(0);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (currency) params.append("currency", currency);
      if (filters.search) params.append("search", filters.search);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.isActive !== undefined)
        params.append("isActive", String(filters.isActive));
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      params.append("isActive", "true");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/products?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductListResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Load Fail");
      }

      setProducts(data.products || []);
      setTotal(data.total || 0);
      setRetryCount(0); // Reset retry on success

      if (data.currency?.current) {
        setCurrency(data.currency.current);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load products";

      // Auto-retry con delay progressivo (max 3 tentativi)
      if (retryCount < 3 && errorMessage.includes("Failed to fetch")) {
        const delay = (retryCount + 1) * 1000; // 1s, 2s, 3s
        console.log(
          `🔄 Backend not ready, retrying in ${delay}ms... (${retryCount + 1}/3)`,
        );

        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, delay);

        setError("Connecting to server...");
      } else {
        setError(errorMessage);
        setProducts([]);
        setTotal(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autofetch) {
      fetchProducts();
    }
  }, [
    autofetch,
    currency,
    filters?.search,
    filters?.isActive,
    filters?.sortBy,
    filters?.sortOrder,
    retryCount,
  ]);

  return {
    products,
    isLoading,
    error,
    total,
    refetch: fetchProducts,
    currency,
  };
}
