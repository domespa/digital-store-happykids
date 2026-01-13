import { useState, useEffect } from "react";
import locationWebSocketService from "../services/locationWebSocketService";
import type {
  LandingConfig,
  LandingUser,
  LandingContextType,
} from "../types/landing";
interface IpApiResponse {
  country_name: string;
  country_code: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  error?: boolean;
}

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
      try {
        console.log("🌍 Fetching location from ipapi.co...");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch("https://ipapi.co/json/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; LocationService/1.0)",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: IpApiResponse = await response.json();
        console.log("🔍 DATI PRESI:", {
          country: data.country_name,
          city: data.city,
          region: data.region,
        });
        if (data.country_name && !data.error) {
          console.log("✅ Geolocalizzazione riuscita:", data.country_name);

          // CREA USER
          const detectedUser: LandingUser = {
            country: data.country_name,
            currency: getCurrencyByCountry(data.country_code),
          };

          setUser(detectedUser);

          // CONNETTI WEBSOCKET E PASSA DATI
          const locationData = {
            country: data.country_name,
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            detectionMethod: "ip" as const,
            precisionLevel: "city" as const,
            countryCode: data.country_code,
            timezone: data.timezone,
          };

          // CONNETTI -> INVIA
          locationWebSocketService.connect();
          locationWebSocketService.setLocationData(locationData);
        } else {
          throw new Error("Invalid data from ipapi.co");
        }
      } catch (error) {
        console.log(
          "🌍 API geolocalizzazione non disponibile, uso fallback timezone:",
          error
        );

        // FALLBACK: Detect from timezone instead of hardcoding Sicily
        const detectedFromTimezone = detectLocationFromTimezone();

        const fallbackUser: LandingUser = {
          country: detectedFromTimezone.country,
          currency: detectedFromTimezone.currency,
        };

        setUser(fallbackUser);

        const fallbackLocationData = {
          country: detectedFromTimezone.country,
          city: detectedFromTimezone.city,
          region: detectedFromTimezone.region,
          detectionMethod: "fallback" as const,
          precisionLevel: "country" as const,
          countryCode: detectedFromTimezone.countryCode,
          timezone: detectedFromTimezone.timezone,
        };

        console.log(
          "📍 Invio dati fallback timezone al WebSocket:",
          fallbackLocationData
        );

        locationWebSocketService.connect();
        locationWebSocketService.setLocationData(fallbackLocationData);
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
