import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import StripeProvider from "./providers/StripeProvider";
import LandingPage from "./components/landing/LandingPage";
import screenDetoxConfig from "./config/landing-config/screenDetoxConfig";
import AdminRoute from "./components/admin/AdminRoute";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import { useVisitorTracking } from "./hooks/useVisitorTracking";
import { usePageTracking } from "./hooks/usePageTracking";

function CustomerApp() {
  return (
    <AuthProvider>
      <CartProvider>
        <StripeProvider>
          <Routes>
            <Route
              path="/"
              element={<LandingPage config={screenDetoxConfig} />}
            />
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
