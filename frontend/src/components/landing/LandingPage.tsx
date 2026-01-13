import { LandingProvider } from "../../context/LandingContext";
import type { LandingPageProps } from "../../types/landing";
import HeroSect from "./sections/HeroSect";
// import SocialProofBar from "./sections/SocialProofBar";
import PainPointSection from "./sections/PainPointSection";
// import BeforeAfterTransformation from "./sections/Beforeaftertransformation";
import WhatYouGetSect from "./sections/WhatYouGetSect";
import TestimonialSect from "./sections/TestimonialSect";
import FaqSect from "./sections/FaqSect";
import FinalCtaSect from "./sections/FinalCtaSect";
import StickyCtaBar from "./sections/StickyCtaBar";
import Footer from "./sections/Footer";
import CartSlideBar from "../cart/CartSlideBar";
import CartIcon from "../cart/CartIcon";
import { useEffect } from "react";
import { useLandingContext } from "../../context/LandingContext";
import { useCart } from "../../hooks/useCart";
import CookieBanner from "../CookieBanner";
import ExitIntentPopup from "./conversion/ExitIntentPopup";
import SocialProofNotification from "./conversion/SocialProofNotification";

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52796F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* 1. HERO - Above the fold */}
      <HeroSect />

      {/* 2. SOCIAL PROOF BAR - Optional, add if you have media mentions */}
      {/* <SocialProofBar /> */}

      {/* 3. PAIN POINT - Empathy & validation */}
      <PainPointSection />

      {/* 4. BEFORE/AFTER - Visual transformation */}
      {/* <BeforeAfterTransformation /> */}

      {/* 5. WHAT YOU GET - Product details */}
      <WhatYouGetSect />

      {/* 6. TESTIMONIALS - Social proof deep dive */}
      <TestimonialSect />

      {/* 7. FAQ - Handle objections */}
      <FaqSect />

      {/* 8. FINAL CTA - Closing argument */}
      <FinalCtaSect />

      {/* Always visible */}
      <StickyCtaBar />
      <Footer />
      <ExitIntentPopup />
      <SocialProofNotification />
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
