import { useParams, Navigate } from "react-router-dom";
import LandingPageDetox from "../../landing/pages/LandingPageDetox";
import LandingPageWorkbooks from "../../landing/pages/LandingPageWorkbooks";
import screenDetoxConfig from "../../../config/landing-config/screenDetoxConfig";
import workbooksConfig from "../../../config/landing-config/workbooksConfig";

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
    case "cml874iv70000j5ma3lmjfjzq": // Rainbow
    case "cml874jfl0001j5ma9jkc2hl7": // Letters
    case "cml874jyu0002j5mapb5yr6zg": // Writing
    case "cml874ki50003j5macmb9lxda": // Animals
    case "cml874l1f0004j5ma1ve5e511": // Shapes
      return <LandingPageWorkbooks config={workbooksConfig} />;

    // Prodotto non trovato → Redirect
    default:
      console.warn(`Product ID not found: ${id}`);
      return <Navigate to="/products" replace />;
  }
}
