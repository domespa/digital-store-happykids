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
      const productId = config.productId || config.productIds?.[0];

      if (!productId) {
        console.warn("⚠️ productId mancante nel config");
        return;
      }

      // ASPETTA CHE LOCATION SIA PRONTA
      if (landingData.isLoading) {
        console.log("⏳ Waiting for location...");
        return;
      }

      setIsLoadingProduct(true);
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
        console.error("❌ [CONTEXT] Errore fetch prodotto:", error);
      } finally {
        setIsLoadingProduct(false);
      }
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
