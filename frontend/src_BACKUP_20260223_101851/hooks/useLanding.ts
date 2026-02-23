import { useState, useEffect } from "react";
import type {
  LandingConfig,
  LandingUser,
  LandingContextType,
} from "../types/landing";

// ============================================
// TIMEZONE-BASED FALLBACK DETECTION
// ============================================
const detectLocationFromTimezone = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = navigator.language || "en-US";

  console.log("🕐 Detecting from timezone:", tz);
  console.log("🌐 Browser locale:", locale);

  // UK Detection
  if (
    tz.includes("London") ||
    tz.includes("Manchester") ||
    tz.includes("Edinburgh") ||
    tz.includes("Belfast")
  ) {
    return {
      country: "United Kingdom",
      countryCode: "GB",
      currency: "GBP",
      city: "London",
      region: "England",
      timezone: tz,
    };
  }

  // Australia Detection
  if (
    tz.includes("Australia") ||
    tz.includes("Sydney") ||
    tz.includes("Melbourne") ||
    tz.includes("Brisbane")
  ) {
    return {
      country: "Australia",
      countryCode: "AU",
      currency: "AUD",
      city: tz.includes("Sydney")
        ? "Sydney"
        : tz.includes("Melbourne")
          ? "Melbourne"
          : "Brisbane",
      region: "Australia",
      timezone: tz,
    };
  }

  // Canada Detection
  if (
    tz.includes("Toronto") ||
    tz.includes("Vancouver") ||
    tz.includes("Montreal")
  ) {
    return {
      country: "Canada",
      countryCode: "CA",
      currency: "CAD",
      city: tz.includes("Toronto")
        ? "Toronto"
        : tz.includes("Vancouver")
          ? "Vancouver"
          : "Montreal",
      region: "Canada",
      timezone: tz,
    };
  }

  // USA Detection
  if (
    tz.includes("America/New_York") ||
    tz.includes("America/Los_Angeles") ||
    tz.includes("America/Chicago") ||
    tz.includes("America/Denver")
  ) {
    let city = "New York";
    if (tz.includes("Los_Angeles")) city = "Los Angeles";
    if (tz.includes("Chicago")) city = "Chicago";
    if (tz.includes("Denver")) city = "Denver";

    return {
      country: "United States",
      countryCode: "US",
      currency: "USD",
      city,
      region: "United States",
      timezone: tz,
    };
  }

  // Europe Detection
  if (tz.includes("Europe/")) {
    // Check specific countries
    if (tz.includes("Paris")) {
      return {
        country: "France",
        countryCode: "FR",
        currency: "EUR",
        city: "Paris",
        region: "France",
        timezone: tz,
      };
    }
    if (tz.includes("Berlin")) {
      return {
        country: "Germany",
        countryCode: "DE",
        currency: "EUR",
        city: "Berlin",
        region: "Germany",
        timezone: tz,
      };
    }
    if (tz.includes("Rome")) {
      return {
        country: "Italy",
        countryCode: "IT",
        currency: "EUR",
        city: "Rome",
        region: "Italy",
        timezone: tz,
      };
    }
    if (tz.includes("Madrid")) {
      return {
        country: "Spain",
        countryCode: "ES",
        currency: "EUR",
        city: "Madrid",
        region: "Spain",
        timezone: tz,
      };
    }

    // Default Europe
    return {
      country: "Europe",
      countryCode: "EU",
      currency: "EUR",
      city: "Unknown",
      region: "Europe",
      timezone: tz,
    };
  }

  // Default fallback to USD
  console.log("⚠️ Could not detect location from timezone, defaulting to USD");
  return {
    country: "United States",
    countryCode: "US",
    currency: "USD",
    city: "Unknown",
    region: "Unknown",
    timezone: tz,
  };
};

export const useLanding = (config: LandingConfig): LandingContextType => {
  const [user, setUser] = useState<LandingUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectUser = async () => {
      const cachedCurrency = localStorage.getItem("userCurrency");
      const cachedCountry = localStorage.getItem("userCountry");
      const cachedTimestamp = localStorage.getItem("userLocationTimestamp");

      const isCacheValid =
        cachedTimestamp &&
        Date.now() - parseInt(cachedTimestamp) < 6 * 60 * 60 * 1000;

      if (cachedCurrency && cachedCountry && isCacheValid) {
        console.log("✅ Using cached location:", cachedCountry, cachedCurrency);
        setUser({
          country: cachedCountry,
          currency: cachedCurrency,
        });
        setIsLoading(false);
      } else if (cachedCurrency && cachedCountry) {
        console.log("🔄 Cache expired, will refresh...");
        setUser({
          country: cachedCountry,
          currency: cachedCurrency,
        });
      }

      try {
        console.log("🌍 Fetching location from backend...");

        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`${baseUrl}/api/public/location`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        console.log("🔍 DATI PRESI DA BACKEND:", {
          country: data.country,
          city: data.city,
          currency: data.currency,
        });

        if (data.country && data.country !== "Unknown") {
          console.log("✅ Geolocalizzazione riuscita:", data.country);

          // USA LA CURRENCY DAL BACKEND
          const detectedCurrency =
            data.currency || getCurrencyByCountry(data.countryCode);

          localStorage.setItem("userCountry", data.country);
          localStorage.setItem("userCurrency", detectedCurrency);
          localStorage.setItem("userLocationTimestamp", Date.now().toString());

          const detectedUser: LandingUser = {
            country: data.country,
            currency: detectedCurrency,
          };

          setUser(detectedUser);
        } else {
          throw new Error("Invalid data from backend");
        }
      } catch (error) {
        console.log(
          "🌍 Backend location non disponibile, uso fallback timezone:",
          error,
        );

        const detectedFromTimezone = detectLocationFromTimezone();
        localStorage.setItem("userCountry", detectedFromTimezone.country);
        localStorage.setItem("userCurrency", detectedFromTimezone.currency);
        localStorage.setItem("userLocationTimestamp", Date.now().toString());

        const fallbackUser: LandingUser = {
          country: detectedFromTimezone.country,
          currency: detectedFromTimezone.currency,
        };

        setUser(fallbackUser);
      } finally {
        setIsLoading(false);
      }
    };

    detectUser();
  }, []);

  const contextValue: LandingContextType = {
    config,
    user,
    isLoading,
  };

  return contextValue;
};

const getCurrencyByCountry = (countryCode: string): string => {
  const countryToCurrency: Record<string, string> = {
    IT: "EUR", // Italia
    DE: "EUR", // Germania
    FR: "EUR", // Francia
    ES: "EUR", // Spagna
    NL: "EUR", // Olanda
    AT: "EUR", // Austria
    BE: "EUR", // Belgio
    PT: "EUR", // Portogallo
    FI: "EUR", // Finlandia
    IE: "EUR", // Irlanda
    GR: "EUR", // Grecia
    US: "USD", // Stati Uniti
    CA: "CAD", // Canada
    GB: "GBP", // Regno Unito
    AU: "AUD", // Australia
    NZ: "AUD", // Nuova Zelanda
    CH: "CHF", // Svizzera
    JP: "JPY", // Giappone
    SE: "SEK", // Svezia
    NO: "NOK", // Norvegia
    DK: "DKK", // Danimarca
  };

  return countryToCurrency[countryCode] || "USD";
};
