import { X, Shield, Cookie, Check } from "lucide-react";
import { useEffect, useState } from "react";

export interface CookieConsent {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

const COOKIE_POLICY_VERSION = "1.0.0";
const CONSENT_STORAGE_KEY = "cookie_consent";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
    version: COOKIE_POLICY_VERSION,
  });

  // GTM CONSENT DEF DENIED
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];

      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      gtag("consent", "default", {
        ad_storage: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        personalization_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      });

      console.log("🍪 GTM Consent Mode: Default state set to DENIED");
    }
  }, []);

  // CHECK PER VEDERE SE C'è IL CONSENSO SALVATO SULLO STORAGE
  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!saved) {
      setTimeout(() => {
        setShow(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
    } else {
      try {
        const parsed: CookieConsent = JSON.parse(saved);

        if (parsed.version !== COOKIE_POLICY_VERSION) {
          setShow(true);
          setTimeout(() => setIsVisible(true), 100);
        } else {
          applyConsent(parsed);
        }
      } catch (error) {
        console.error("Failed to parse saved consent:", error);
        setShow(true);
        setTimeout(() => setIsVisible(true), 100);
      }
    }
    if (navigator.doNotTrack === "1") {
      const dntConsent: CookieConsent = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
        version: COOKIE_POLICY_VERSION,
      };
      saveConsent(dntConsent);
      setShow(false);
    }
  }, []);

  // FUNZIONE PER SALVARE IL CONSENSO
  const saveConsent = (preferences: CookieConsent) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
    applyConsent(preferences);
  };

  // FUNZIONE PER APPLICARE IL CONSENSO
  const applyConsent = (preferences: CookieConsent) => {
    window.dispatchEvent(
      new CustomEvent("consent-updated", {
        detail: preferences,
      })
    );

    // GTM
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: preferences.marketing ? "granted" : "denied",
        analytics_storage: preferences.analytics ? "granted" : "denied",
        functionality_storage: preferences.functional ? "granted" : "denied",
        personalization_storage: preferences.marketing ? "granted" : "denied",
        ad_user_data: preferences.marketing ? "granted" : "denied",
        ad_personalization: preferences.marketing ? "granted" : "denied",
      });

      console.log("🍪 GTM Consent Mode updated:", {
        analytics: preferences.analytics ? "✅ GRANTED" : "❌ DENIED",
        marketing: preferences.marketing ? "✅ GRANTED" : "❌ DENIED",
        functional: preferences.functional ? "✅ GRANTED" : "❌ DENIED",
      });
    }

    if (preferences.analytics) {
      initializeAnalytics();
    } else {
      disableAnalytics();
    }

    if (preferences.marketing) {
      initializeMarketing();
    } else {
      disableMarketing();
    }

    console.log("Cookie preferences applied:", preferences);
  };

  // GOOGLE ANAL
  const initializeAnalytics = () => {
    const enableLogs = import.meta.env.VITE_ENABLE_TRACKING_LOGS === "true";

    if (enableLogs) {
      console.log("📊 Analytics consent granted");
      console.log("   GTM will load Google Analytics via Consent Mode");
    }

    // GTM handles GA4 loading automatically via consent mode
    // No need to manually load GA4 script here
  };

  const initializeMarketing = () => {
    const enableLogs = import.meta.env.VITE_ENABLE_TRACKING_LOGS === "true";

    if (enableLogs) {
      console.log("🎯 Marketing consent granted");
      console.log(
        "   GTM will load Meta Pixel, Google Ads, TikTok via Consent Mode"
      );
    }
  };

  const disableMarketing = () => {
    const enableLogs = import.meta.env.VITE_ENABLE_TRACKING_LOGS === "true";

    if (enableLogs) {
      console.log("🎯 Marketing disabled - removing cookies");
    }

    const metaCookies = ["_fbp", "_fbc", "fr"];
    metaCookies.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      const domain = window.location.hostname;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    });

    const tiktokCookies = ["_ttp", "_tt_enable_cookie", "_ttq_session"];
    tiktokCookies.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      const domain = window.location.hostname;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    });
  };

  const disableAnalytics = () => {
    const enableLogs = import.meta.env.VITE_ENABLE_TRACKING_LOGS === "true";

    if (enableLogs) {
      console.log("📊 Analytics disabled - removing cookies");
    }

    const cookiesToRemove = [
      "_ga",
      "_gid",
      "_gat",
      "_gat_gtag_UA_",
      "_gcl_au",
      "_gac_",
    ];

    cookiesToRemove.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      const domain = window.location.hostname;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    });
  };

  // ACCETTA TUTTI
  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION,
    };
    setIsVisible(false);
    setTimeout(() => {
      saveConsent(fullConsent);
      setShow(false);
      setShowCustomize(false);
    }, 300);
  };
  // RIFIUTA TUTTI
  const handleRejectAll = () => {
    const minimalConsent: CookieConsent = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION,
    };
    setIsVisible(false);
    setTimeout(() => {
      saveConsent(minimalConsent);
      setShow(false);
      setShowCustomize(false);
    }, 300);
  };

  // SALVA PREFERENZE
  const handleSaveCustom = () => {
    const customConsent: CookieConsent = {
      ...consent,
      timestamp: new Date().toISOString(),
      version: COOKIE_POLICY_VERSION,
    };
    saveConsent(customConsent);
    setShowCustomize(false);
  };

  if (!show) return null;
  return (
    <>
      {/* Main Banner */}
      {!showCustomize && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-300 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left side - Icon & Info */}
              <div className="flex-1 p-5 md:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      We Value Your Privacy
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We use cookies to enhance your experience, analyze site
                      traffic, and show personalized ads. You can customize your
                      preferences or accept all cookies.
                    </p>
                  </div>
                </div>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    ✓ Essential Always Active
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                    📊 Analytics Optional
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                    🎯 Marketing Optional
                  </span>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <a
                    href="/cookie-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-medium underline"
                  >
                    Cookie Policy
                  </a>
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-medium underline"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex flex-col gap-2 p-5 md:p-6 bg-gradient-to-br from-purple-50 to-blue-50 md:min-w-[280px]">
                <button
                  onClick={handleAcceptAll}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="w-full py-3 px-4 bg-white text-purple-600 border-2 border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 text-sm"
                >
                  Customize Settings
                </button>
                <button
                  onClick={handleRejectAll}
                  className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
                >
                  Reject All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Modal - MOBILE OPTIMIZED */}
      {showCustomize && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black bg-opacity-50 p-0 md:p-4">
          <div
            className={`bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[90dvh] overflow-hidden transition-all duration-300 ${
              showCustomize ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Privacy Preferences
                  </h2>
                  <p className="text-xs text-gray-600">
                    Choose what you're comfortable with
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomize(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90dvh-180px)] px-5 py-4">
              {/* Essential */}
              <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-600" />
                      <h3 className="font-semibold text-gray-900 text-sm">
                        Essential Cookies
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Required for cart, checkout, and secure browsing. Cannot
                      be disabled.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Always On
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional */}
              <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      Functional Cookies
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Remember language, currency, and location preferences.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.functional}
                      onChange={(e) =>
                        setConsent({ ...consent, functional: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      Analytics Cookies
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">
                      Help us improve by understanding how you use our site.
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      Includes: Google Analytics, Google Ads conversion tracking
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) =>
                        setConsent({ ...consent, analytics: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Marketing */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      Marketing Cookies
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">
                      Show you personalized ads based on your interests.
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      Includes: Meta Pixel (Facebook/Instagram), TikTok Pixel
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) =>
                        setConsent({ ...consent, marketing: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Actions - STICKY */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
              <div className="flex gap-2">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Save & Close
                </button>
              </div>
              <p className="text-center mt-2">
                <a
                  href="/cookie-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Cookie Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// HOOK TVISCOTTA
export function useCookieConsent(): CookieConsent | null {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent));
      } catch {
        setConsent(null);
      }
    }

    const handleConsentUpdate = (event: CustomEvent<CookieConsent>) => {
      setConsent(event.detail);
    };

    window.addEventListener(
      "consent-updated",
      handleConsentUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "consent-updated",
        handleConsentUpdate as EventListener
      );
    };
  }, []);

  return consent;
}

export default CookieBanner;
