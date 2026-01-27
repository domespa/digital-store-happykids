import { LandingProvider } from "../../context/LandingContext";
import type { LandingPageProps } from "../../types/landing";
import HeroSect from "./sections/HeroSect";
import PainPointSection from "./sections/PainPointSection";
import EmotionalCTA from "./sections/EmotionalCtaSect";
import WhatYouGetSect from "./sections/WhatYouGetSect";
import ParentStrugglesSection from "./sections/TestimonialSect";
import FaqSect from "./sections/FaqSect";
import FinalCTA from "./sections/FinalCtaSect";
// import StickyCtaBar from "./sections/StickyCtaBar";
import Footer from "./sections/Footer";
import ActivityIndicator from "./conversion/SocialProofNotification";
import CartSlideBar from "../cart/CartSlideBar";
import CartIcon from "../cart/CartIcon";
import CookieBanner from "../CookieBanner";
import { useEffect } from "react";
import { useLandingContext } from "../../context/LandingContext";
import { useCart } from "../../hooks/useCart";

const LandingPageContent = () => {
  const { user, isLoading } = useLandingContext();
  const { setInitialCurrency } = useCart();

  useEffect(() => {
    if (user?.currency && !isLoading) {
      setInitialCurrency(user.currency);
    }
  }, [user?.currency, isLoading, setInitialCurrency]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* 1. HERO - Hook emotivo */}
      <HeroSect />

      {/* 2. PAIN POINTS - Agitazione problema */}
      <PainPointSection />

      {/* 3. EMOTIONAL CTA - Prima call to action (urgente) */}
      <EmotionalCTA />

      {/* 4. WHAT YOU GET - Contenuto prodotto */}
      <WhatYouGetSect />

      {/* 5. PARENT STRUGGLES - Pain recognition (NO fake testimonials) */}
      <ParentStrugglesSection />

      {/* 6. FAQ - Gestione obiezioni */}
      <FaqSect />

      {/* 7. FINAL CTA - Chiusura logica */}
      <FinalCTA />

      {/* 8. FOOTER */}
      <Footer />

      {/* ALWAYS VISIBLE ELEMENTS */}
      {/* <StickyCtaBar /> */}
      <ActivityIndicator />
    </div>
  );
};

export default function LandingPage({
  config,
  className = "",
}: LandingPageProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      <LandingProvider config={config}>
        <LandingPageContent />
        <CartSlideBar />
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
          }}
        >
          <CartIcon />
        </div>
        <CookieBanner />
      </LandingProvider>
    </div>
  );
}
