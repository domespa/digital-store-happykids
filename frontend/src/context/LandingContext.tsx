import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  LandingConfig,
  LandingContextType,
  BackendProduct,
} from "../types/landing";
import { useLanding } from "../hooks/useLanding";

interface ExtendedLandingContextType extends LandingContextType {
  backendProduct: BackendProduct | null;
  isLoadingProduct: boolean;
}

const LandingContext = createContext<ExtendedLandingContextType | undefined>(
  undefined,
);

export const useLandingContext = () => {
  const context = useContext(LandingContext);

  if (!context) {
    throw new Error("ERRORE CRITICO, METTI CONTEXT DENTRO PROVIDER");
  }

  return context;
};

export const LandingProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: LandingConfig;
}) => {
  const landingData = useLanding(config);

  const [backendProduct, setBackendProduct] = useState<BackendProduct | null>(
    null,
  );
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  useEffect(() => {
    const fetchProd = async () => {
      const productId = config.productId;

      if (!productId) {
        console.warn("⚠️ productId mancante nel config");
        return;
      }

      if (landingData.isLoading) {
        console.log("⏳ Waiting for location...");
        return;
      }

      setIsLoadingProduct(true);

      let retries = 0;
      const maxRetries = 3;

      const attemptFetch = async (): Promise<void> => {
        try {
          const baseUrl =
            import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
          const apiUrl = `${baseUrl}/api/products/${productId}`;
          const userCurrency = landingData.user?.currency || "EUR";

          console.log("📦 Fetching product with currency:", userCurrency);

          const resp = await fetch(apiUrl, {
            headers: {
              "X-User-Currency": userCurrency,
            },
          });

          if (!resp.ok) throw new Error("Prodotto non trovato");

          const data = await resp.json();
          console.log("✅ Product received:", {
            name: data.product?.name,
            price: data.product?.displayPrice || data.product?.price,
            currency: data.product?.currency,
          });

          setBackendProduct(data.product);
        } catch (error) {
          if (
            retries < maxRetries &&
            error instanceof TypeError &&
            error.message.includes("Failed to fetch")
          ) {
            retries++;
            const delay = retries * 1000;
            console.log(
              `🔄 Backend not ready, retrying in ${delay}ms... (${retries}/${maxRetries})`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            return attemptFetch();
          }

          console.error("❌ [CONTEXT] Errore fetch prodotto:", error);
        } finally {
          setIsLoadingProduct(false);
        }
      };

      attemptFetch();
    };

    fetchProd();
  }, [
    config.productId,
    config.productIds,
    landingData.isLoading,
    landingData.user?.currency,
  ]);

  const value: ExtendedLandingContextType = {
    ...landingData,
    backendProduct,
    isLoadingProduct,
  };

  return (
    <LandingContext.Provider value={value}>{children}</LandingContext.Provider>
  );
};
