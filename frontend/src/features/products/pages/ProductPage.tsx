import { useParams, Navigate } from "react-router-dom";
import LandingPageDetox from "../../landing/pages/LandingPageDetox";
import LandingPageWorkbooks from "../../landing/pages/LandingPageWorkbooks";
import screenDetoxConfig from "../../../config/landing-config/screenDetoxConfig";
import workbooksConfig from "../../../config/landing-config/workbooksConfig";
import ProductDetailPage from "./ProductDetailPage";
import { LandingProvider } from "../../../context/LandingContext";
import type { LandingConfig } from "../../../types/landing";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  switch (id) {
    // Screen Reset → Landing Detox
    case "cml878t320000evywtampu4aj":
      return <LandingPageDetox config={screenDetoxConfig} />;

    // Workbooks Bundle → Landing Workbooks
    case "cml87a3250000140vhvtptbd6":
      return <LandingPageWorkbooks config={workbooksConfig} />;

    // Workbooks individuali → Landing Workbooks
    case "cml874iv70000j5ma3lmjfjzq": // Rainbow of Colors
    case "cml874jfl0001j5ma9jkc2hl7": // Letters and Numbers
    case "cml874jyu0002j5mapb5yr6zg": // My First Writing
    case "cml874ki50003j5macmb9lxda": // Animals and Dinosaurs
    case "cml874l1f0004j5ma1ve5e511": // World of Shapes
      const individualConfig: LandingConfig = {
        ...workbooksConfig,
        productId: id,
      };

      return (
        <LandingProvider config={individualConfig}>
          <ProductDetailPage />
        </LandingProvider>
      );
    // Prodotto non trovato → Redirect
    default:
      console.warn(`Product ID not found: ${id}`);
      return <Navigate to="/products" replace />;
  }
}
