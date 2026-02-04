import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface VisitorTrackingOptions {
  autoConnect?: boolean;
  trackPageViews?: boolean;
}

interface LocationData {
  country: string;
  city: string;
  region: string;
  countryCode: string;
  timezone: string;
  ip?: string;
}

let globalSocket: Socket | null = null;
let globalConnectionPromise: Promise<void> | null = null;

export function useVisitorTracking(options: VisitorTrackingOptions = {}) {
  const { autoConnect = true, trackPageViews = true } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [visitorNumber, setVisitorNumber] = useState<number | null>(null);
  const locationSentRef = useRef(false);
  const sessionTokenRef = useRef<string | null>(null);

  const getSessionToken = (): string => {
    if (sessionTokenRef.current) {
      return sessionTokenRef.current;
    }

    let token = sessionStorage.getItem("visitor_session_token");

    if (!token) {
      token = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem("visitor_session_token", token);
      console.log(
        "🆕 Generated new session token:",
        token.slice(0, 30) + "...",
      );
    } else {
      console.log("♻️ Reusing session token:", token.slice(0, 30) + "...");
    }

    sessionTokenRef.current = token;
    return token;
  };

  const fetchLocation = async (): Promise<LocationData | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/location`,
      );

      if (!response.ok) throw new Error("Failed to fetch location");

      const data = await response.json();

      console.log("✅ Location from backend:", data);

      return {
        country: data.country || "Unknown",
        city: data.city || "Unknown",
        region: data.region || "",
        countryCode: data.countryCode || "",
        timezone: data.timezone || "",
        ip: data.ip || "",
      };
    } catch (error) {
      console.error("❌ Failed to fetch location:", error);
      return {
        country: "Unknown",
        city: "Unknown",
        region: "",
        countryCode: "",
        timezone: "",
      };
    }
  };

  const connect = async () => {
    if (globalSocket?.connected) {
      console.log("♻️ Reusing existing socket connection");
      setIsConnected(true);
      return;
    }

    if (globalConnectionPromise) {
      console.log("⏳ Connection already in progress, waiting...");
      await globalConnectionPromise;
      setIsConnected(globalSocket?.connected || false);
      return;
    }

    globalConnectionPromise = (async () => {
      try {
        console.log("🔌 Creating new socket connection...");

        const sessionToken = getSessionToken();

        const socket = io(
          import.meta.env.VITE_API_URL || "http://localhost:3001",
          {
            path: "/tracking",
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
          },
        );

        globalSocket = socket;

        socket.on("connect", async () => {
          console.log("✅ Connected to tracking WebSocket:", socket.id);
          setIsConnected(true);

          if (!locationSentRef.current) {
            const location = await fetchLocation();

            if (location) {
              console.log("📍 Sending location:", location);
              console.log(
                "🔑 Session token:",
                sessionToken.slice(0, 30) + "...",
              );

              socket.emit("send_location", {
                ...location,
                sessionToken,
                page: window.location.pathname,
                pageTitle: document.title,
                referrer: document.referrer,
              });

              locationSentRef.current = true;
            }
          }
        });

        socket.on("location_received", (data: any) => {
          if (data.success) {
            console.log("✅ Location received by server");
            if (data.visitorNumber) {
              setVisitorNumber(data.visitorNumber);
              console.log(`👤 You are visitor #${data.visitorNumber}`);
            }
          } else {
            console.error("❌ Failed to save location:", data.error);
          }
        });

        socket.on("disconnect", (reason: string) => {
          console.log("🔴 Disconnected from tracking:", reason);
          setIsConnected(false);
          locationSentRef.current = false;
          globalSocket = null;
        });

        socket.on("connect_error", (error: any) => {
          console.error("❌ Connection error:", error);
          setIsConnected(false);
        });
      } catch (error) {
        console.error("❌ Failed to connect:", error);
        globalSocket = null;
      } finally {
        globalConnectionPromise = null;
      }
    })();

    await globalConnectionPromise;
  };

  const trackEvent = (
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
  ) => {
    if (!globalSocket?.connected) {
      console.warn("⚠️ Cannot track event - not connected");
      return;
    }

    console.log(`📊 Tracking event: ${type}`, data);

    globalSocket.emit("track_event", {
      type,
      page: data?.page || window.location.pathname,
      pageTitle: data?.pageTitle || document.title,
      productId: data?.productId,
      orderId: data?.orderId,
      value: data?.value,
      metadata: data?.metadata,
    });
  };

  useEffect(() => {
    if (trackPageViews && isConnected) {
      trackEvent("page_view");
    }
  }, [window.location.pathname, isConnected, trackPageViews]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      console.log("🧹 Component unmounting (socket stays alive)");
    };
  }, [autoConnect]);

  return {
    isConnected,
    visitorNumber,
    trackEvent,
    connect,
    disconnect: () => {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
      }
    },
  };
}
