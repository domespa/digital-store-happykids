import { useEffect, useRef } from "react";

export function usePageTracking(
  isConnected: boolean,
  trackEvent: (
    type:
      | "add_to_cart"
      | "purchase"
      | "product_view"
      | "page_view"
      | "cta_click"
      | "section_view"
      | "scroll_depth",
    data?: {
      productId?: string;
      orderId?: string;
      page?: string;
      pageTitle?: string;
      value?: number;
      metadata?: any;
    },
  ) => void,
) {
  const scrollDepthRef = useRef(0);
  const sectionsViewedRef = useRef(new Set<string>());
  const trackedScrollLevels = useRef(new Set<number>());

  useEffect(() => {
    if (!isConnected) {
      console.log("⏳ Waiting for connection to track events...");
      return;
    }

    console.log("✅ Page tracking active");

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //        TRACK SCROLL DEPTH
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100,
      );

      if (scrollPercent > scrollDepthRef.current) {
        scrollDepthRef.current = scrollPercent;

        // Track ogni 25% (solo una volta per livello)
        let level = 0;
        if (scrollPercent >= 25 && scrollPercent < 50) level = 25;
        else if (scrollPercent >= 50 && scrollPercent < 75) level = 50;
        else if (scrollPercent >= 75 && scrollPercent < 100) level = 75;
        else if (scrollPercent >= 100) level = 100;

        if (level > 0 && !trackedScrollLevels.current.has(level)) {
          trackedScrollLevels.current.add(level);
          console.log(`📜 Scroll depth: ${level}%`);
          trackEvent("scroll_depth", { metadata: { depth: level } });
        }
      }
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //        TRACK SECTIONS VIEWED
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId =
              entry.target.id || entry.target.getAttribute("data-section");
            if (sectionId && !sectionsViewedRef.current.has(sectionId)) {
              sectionsViewedRef.current.add(sectionId);
              console.log(`📑 Section viewed: ${sectionId}`);
              trackEvent("section_view", {
                metadata: { section: sectionId },
              });
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    // Osserva tutte le sezioni
    const sections = document.querySelectorAll("[data-section], section[id]");
    console.log(`👀 Observing ${sections.length} sections`);
    sections.forEach((section) => {
      observer.observe(section);
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //        TRACK CTA CLICKS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleCtaClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cta = target.closest("[data-cta]");

      if (cta) {
        const ctaName = cta.getAttribute("data-cta") || "unknown";
        console.log(`🎯 CTA clicked: ${ctaName}`);
        trackEvent("cta_click", {
          metadata: { cta: ctaName },
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleCtaClick);

    return () => {
      console.log("🧹 Cleaning up page tracking");
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleCtaClick);
      observer.disconnect();
    };
  }, [isConnected, trackEvent]);
}
