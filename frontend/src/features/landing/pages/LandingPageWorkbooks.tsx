import type { LandingPageProps } from "../../../types/landing";
import CartSlideBar from "../../../components/cart/CartSlideBar";
import { useEffect } from "react";
import { useLandingContext } from "../../../context/LandingContext";
import { useCart } from "../../../hooks/useCart";
import { LandingProvider } from "../../../context/LandingContext";
import MinimalHeader from "../../../components/common/MinimalHeader";

// IMPORT SEZIONI
import HeroSectW from "../components/workbooks/HeroSectW";
import ProblemSectionW from "../components/workbooks/ProblemSectionW";
import SolutionSectionW from "../components/workbooks/SolutionSectionW";
import ProductShowcaseW from "../components/workbooks/ProductShowcaseW";
import RealCostCompareW from "../components/workbooks/RealCostCompareW";
import HowItWorksW from "../components/workbooks/HowItWorksW";
import FaqW from "../components/workbooks/FaqW";
import FinalCtaW from "../components/workbooks/FinalCtaW";

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
      <div className="min-h-screen">
        <HeroSectW />
        <ProblemSectionW />
        <SolutionSectionW />
        <ProductShowcaseW />
        <RealCostCompareW />
        <HowItWorksW />
        <FaqW />
        <FinalCtaW />
      </div>
    </>
  );
}

export default function LandingPageWorkbooks({ config }: LandingPageProps) {
  return (
    <LandingProvider config={config}>
      <LandingContent />
      <CartSlideBar />
    </LandingProvider>
  );
}
