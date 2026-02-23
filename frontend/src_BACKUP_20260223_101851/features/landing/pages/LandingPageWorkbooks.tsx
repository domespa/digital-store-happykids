import type { LandingPageProps } from "../../types/landing";
import CartSlideBar from "../cart/CartSlideBar";
// import CartIcon from "../cart/CartIcon";
// import CookieBanner from "../CookieBanner";
import { useEffect } from "react";
import { useLandingContext } from "../../context/LandingContext";
import { useCart } from "../../hooks/useCart";
import { LandingProvider } from "../../context/LandingContext";

// IMPORT SEZIONI
// import HeroSectW from "./sections/workbooks/HeroSectW";
// import PainPointSectW from "./sections/workbooks/PainPointSectW";
// import EmotionalCTAW from "./sections/workbooks/EmotionalCtaSectW";
// import WorkbooksShowcase from "./sections/workbooks/WorkbooksShowcaseW";
// import WhatYouGetSect from "./sections/workbooks/WhatYouGetSectW";
// import ParentStrugglesSectionW from "./sections/workbooks/TestimonialSectW";
// import FaqSect from "./sections/workbooks/FaqSectW";

function LandingContent() {
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
    <div className="min-h-screen">
      {/* <HeroSectW />
      <PainPointSectW />
      <EmotionalCTAW />
      <WorkbooksShowcase />
      <WhatYouGetSect />
      <ParentStrugglesSectionW />
      <FaqSect /> */}
      <CartSlideBar />
      {/* <CartIcon /> */}
      {/* <CookieBanner />  */}
    </div>
  );
}

export default function LandingPageWorkbooks({ config }: LandingPageProps) {
  return (
    <LandingProvider config={config}>
      <LandingContent />
    </LandingProvider>
  );
}
