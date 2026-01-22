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
      if (!config?.productId) {
        console.warn("⚠️ productId mancante nel config");
        return;
      }

      setIsLoadingProduct(true);
      try {
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
        const apiUrl = `${baseUrl}/api/products/${config.productId}`;

        console.log("Fetching,", apiUrl);

        const resp = await fetch(apiUrl);
        if (!resp.ok) throw new Error("Prodotto non trovato");

        const data = await resp.json();
        console.log("Prodotto trovato", data.product?.name);
        console.log("🎯 Setting backendProduct:", data.product);

        setBackendProduct(data.product);
      } catch (error) {
        console.error("❌ [CONTEXT] Errore fetch prodotto:", error);
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchProd();
  }, [config.productId]);

  const value: ExtendedLandingContextType = {
    ...landingData,
    backendProduct,
    isLoadingProduct,
  };

  return (
    <LandingContext.Provider value={value}>{children}</LandingContext.Provider>
  );
};
