import { useEffect, useState } from "react";
import type {
  ProductListResponse,
  PublicProductResponse,
  UseProductsOptions,
  UseProductsReturn,
} from "../types/Product";

export function useProducts(
  options: UseProductsOptions = {},
): UseProductsReturn {
  // ESTRAGGO I VALORI
  const { autofetch = true, currency: initialCurrency, filters = {} } = options;

  // CREO GLI STATI
  const [products, setProducts] = useState<PublicProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(autofetch);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currency, setCurrency] = useState(initialCurrency || "EUR");

  // FETCH PRODOTTI
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // AGGIUNGIAMO I PARAMETRI SE ESISTONO
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

      if (data.currency?.current) {
        setCurrency(data.currency.current);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (autofetch) {
      fetchProducts();
    }
  }, [autofetch, currency, JSON.stringify(filters)]);
  return {
    products,
    isLoading,
    error,
    total,
    refetch: fetchProducts,
    currency,
  };
}
