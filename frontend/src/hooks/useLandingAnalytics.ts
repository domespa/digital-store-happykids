import { useEffect, useRef, useCallback } from "react";
import axios from "axios";

type EventType =
  | "page_view"
  | "scroll"
  | "click"
  | "cta_click"
  | "form_submit"
  | "section_view"
  | "exit_intent";

interface TrackEventData {
  eventType: EventType;
  eventName?: string;
  eventData?: Record<string, any>;
}

interface ConversionData {
  conversionType: "purchase" | "email_signup" | "add_to_cart";
  conversionValue?: number;
}

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";
const ANALYTICS_ENDPOINT = `${API_BASE_URL}/landing-analytics`;

const globalTrackedEvents = new Set<string>();

function getSessionId(): string {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

function getVisitorId(): string {
  let visitorId = localStorage.getItem("analytics_visitor_id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("analytics_visitor_id", visitorId);
  }
  return visitorId;
}

function getUTMParams(): Record<string, string> | undefined {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  ["source", "medium", "campaign", "content", "term"].forEach((param) => {
    const value = params.get(`utm_${param}`);
    if (value) utm[param] = value;
  });

  return Object.keys(utm).length > 0 ? utm : undefined;
}

function getSessionDuration(): number {
  const startTime = sessionStorage.getItem("analytics_session_start");
  if (!startTime) {
    const now = Date.now();
    sessionStorage.setItem("analytics_session_start", now.toString());
    return 0;
  }
  return Math.floor((Date.now() - parseInt(startTime)) / 1000);
}

export function useLandingAnalytics() {
  const sessionId = useRef(getSessionId());
  const visitorId = useRef(getVisitorId());
  const maxScrollDepth = useRef(0);
  const viewedSections = useRef(new Set<string>());

  const trackEvent = useCallback(async (data: TrackEventData) => {
    const dedupeKey = `${data.eventType}-${data.eventName || "default"}`;

    if (
      ["page_view", "section_view", "scroll", "exit_intent"].includes(
        data.eventType,
      )
    ) {
      if (globalTrackedEvents.has(dedupeKey)) {
        return; // Skip se già tracciato
      }
      globalTrackedEvents.add(dedupeKey);
    }

    try {
      await axios.post(
        `${ANALYTICS_ENDPOINT}/track`,
        {
          sessionId: sessionId.current,
          visitorId: visitorId.current,
          eventType: data.eventType,
          eventName: data.eventName,
          eventData: {
            ...data.eventData,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
          },
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer || undefined,
          sessionDuration: getSessionDuration(),
          utm: getUTMParams(),
          location: {
            country: localStorage.getItem("user_country") || null,
            city: localStorage.getItem("user_city") || null,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  }, []);

  const trackConversion = useCallback(async (data: ConversionData) => {
    try {
      await axios.post(`${ANALYTICS_ENDPOINT}/convert`, {
        sessionId: sessionId.current,
        conversionType: data.conversionType,
        conversionValue: data.conversionValue,
      });
    } catch (error) {
      console.error("Conversion tracking error:", error);
    }
  }, []);

  // Track page view automatically (ONCE)
  useEffect(() => {
    trackEvent({ eventType: "page_view" });
  }, []);

  // Track scroll depth
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollDepth = Math.round(
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
            100,
        );

        if (scrollDepth > maxScrollDepth.current) {
          const oldMax = maxScrollDepth.current;
          maxScrollDepth.current = scrollDepth;

          const milestones = [25, 50, 75, 100];
          const milestone = milestones.find(
            (m) => scrollDepth >= m && oldMax < m,
          );

          if (milestone) {
            trackEvent({
              eventType: "scroll",
              eventName: `scroll_${milestone}`,
              eventData: { scrollDepth: milestone },
            });
          }
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [trackEvent]);

  // Track section views
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute("data-section-name");
            if (sectionName && !viewedSections.current.has(sectionName)) {
              viewedSections.current.add(sectionName);
              trackEvent({
                eventType: "section_view",
                eventName: sectionName,
                eventData: { section: sectionName },
              });
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    const sections = document.querySelectorAll("[data-section-name]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [trackEvent]);

  // Track exit intent (MAX 1 per sessione)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        trackEvent({ eventType: "exit_intent" });
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [trackEvent]);

  const trackCtaClick = useCallback(
    (ctaName: string, ctaData?: Record<string, any>) => {
      trackEvent({
        eventType: "cta_click",
        eventName: ctaName,
        eventData: ctaData,
      });
    },
    [trackEvent],
  );

  const trackCustomEvent = useCallback(
    (eventName: string, eventData?: Record<string, any>) => {
      trackEvent({
        eventType: "click",
        eventName,
        eventData,
      });
    },
    [trackEvent],
  );

  return {
    trackCtaClick,
    trackCustomEvent,
    trackConversion,
    sessionId: sessionId.current,
    visitorId: visitorId.current,
  };
}

export default useLandingAnalytics;
