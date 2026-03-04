// console.log = () => {};
// console.debug = () => {};
// console.info = () => {};

// ROUTER
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// CONTEXTS
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

// PROVIDERS
import StripeProvider from "./providers/StripeProvider";

// CONFIGS
import screenDetoxConfig from "./config/landing-config/screenDetoxConfig";
import workbooksConfig from "./config/landing-config/workbooksConfig";

// HOOKS
import { useVisitorTracking } from "./hooks/useVisitorTracking";
import { usePageTracking } from "./hooks/usePageTracking";

// ADMIN
import AdminRoute from "./features/admin/components/AdminRoute";

// LEGAL PAGES
import PrivacyPolicyPage from "./features/legal/pages/PrivacyPolicyPage";
import CookiePolicyPage from "./features/legal/pages/CookiePolicyPage";
import RefundPolicyPage from "./features/legal/pages/RefundPolicyPage";

// CHECKOUT PAGES
import PaymentSuccess from "./features/checkout/pages/PaymentSuccess";
import PaymentCancel from "./features/checkout/pages/PaymentCancel";

// LANDING PAGES
import LandingPageWorkbooks from "./features/landing/pages/LandingPageWorkbooks";
import LandingPageDetox from "./features/landing/pages/LandingPageDetox";

// COMMON COMPONENTS
import Header from "./components/common/Header";

// PRODUCTS & CONTACTS PAGES
import ProductsPage from "./features/products/pages/ProductsPage";
import ContactsPage from "./features/contacts/pages/ContactsPage";
import ProductPage from "./features/products/pages/ProductPage";
import Homepage from "./features/landing/pages/Homepage";

function CustomerApp() {
  const location = useLocation();

  // QUESTE ROTTE NON DEVON OAVERE HEADER PER LANDINGPAGE PROFITTEVOLE
  const shouldShowHeader = !(
    location.pathname === "/bundle-workbooks" ||
    location.pathname === "/screen-detox" ||
    location.pathname.startsWith("/products/")
  );

  return (
    <AuthProvider>
      <CartProvider>
        <StripeProvider>
          {/* HEADER SOLO SE NON è IN LANDING */}
          {shouldShowHeader && <Header />}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/screen-detox"
              element={<LandingPageDetox config={screenDetoxConfig} />}
            />
            <Route
              path="/bundle-workbooks"
              element={<LandingPageWorkbooks config={workbooksConfig} />}
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/contact" element={<ContactsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Routes>
        </StripeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default function App() {
  const { isConnected, visitorNumber, trackEvent } = useVisitorTracking({
    autoConnect: true,
    trackPageViews: true,
  });

  usePageTracking(isConnected, trackEvent);

  console.log("🔌 Tracking connected:", isConnected);
  console.log("👤 Visitor number:", visitorNumber);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <Routes>
            {/* ADMIN ROUTES */}
            <Route path="/admin/*" element={<AdminRoute />} />

            {/* CUSTOMER ROUTES */}
            <Route path="/*" element={<CustomerApp />} />
          </Routes>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
