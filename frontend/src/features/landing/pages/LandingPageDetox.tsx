import { LandingProvider } from "../../../context/LandingContext";
import type { LandingPageProps } from "../../../types/landing";
import HeroSect from "../components/detox/HeroSect";
import PainPointSection from "../components/detox/PainPointSection";
import EmotionalCTA from "../components/detox/EmotionalCtaSect";
import WhatYouGetSect from "../components/detox/WhatYouGetSect";
import ParentStrugglesSection from "../components/detox/TestimonialSect";
import FaqSect from "../components/detox/FaqSect";
import FinalCTA from "../components/detox/FinalCtaSect";
import Footer from "../components/detox/Footer";
import CartSlideBar from "../../../components/cart/CartSlideBar";
import CookieBanner from "../../../components/CookieBanner";
import { useEffect } from "react";
import { useLandingContext } from "../../../context/LandingContext";
import { useCart } from "../../../hooks/useCart";
import MinimalHeader from "../../../components/common/MinimalHeader";

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <MinimalHeader />

      {/* CONTENUTO LANDING */}
      <div className="landing-page">
        <HeroSect />
        <PainPointSection />
        <EmotionalCTA />
        <WhatYouGetSect />
        <ParentStrugglesSection />
        <FaqSect />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
};

export default function LandingPageDetox({
  config,
  className = "",
}: LandingPageProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      <LandingProvider config={config}>
        <LandingPageContent />
        <CartSlideBar />
        <CookieBanner />
      </LandingProvider>
    </div>
  );
}
