import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { OnlineUser } from "../types/admin";

interface VisitorData {
  sessionId: string;
  visitorId: string;
  visitorNumber: number;
  location: {
    country: string;
    city: string;
    region?: string;
    countryCode?: string;
    timezone?: string;
  };
  connectedAt: string;
}

export function useRealTimeUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;

    const connectWebSocket = () => {
      try {
        console.log("🔌 Connecting to admin tracking WebSocket...");

        const socket = io(
          import.meta.env.VITE_API_URL || "http://localhost:3001",
          {
            path: "/admin-tracking",
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
          },
        );

        socketRef.current = socket;

        // CONNECTION
        socket.on("connect", () => {
          if (!mounted) return;
          console.log("✅ Connected to admin tracking WebSocket");
          setIsConnected(true);
          setError(null);
        });

        // INITIAL VISITORS (quando ci connettiamo)
        socket.on("initial_visitors", (data: { visitors: VisitorData[] }) => {
          if (!mounted) return;
          console.log("📊 Initial visitors received:", data.visitors.length);

          const users: OnlineUser[] = data.visitors.map((v) => ({
            id: `visitor-${v.visitorNumber}`,
            sessionId: v.sessionId,
            visitorNumber: v.visitorNumber,
            visitorId: v.visitorId,
            location: {
              country: v.location.country,
              city: v.location.city,
              region: v.location.region,
              countryCode: v.location.countryCode,
              timezone: v.location.timezone,
            },
            connectedAt: v.connectedAt,
            lastActivity: v.connectedAt,
            currentPage: "/",
            userAgent: null,
            ipAddress: null,
            isAuthenticated: false,
          }));

          setOnlineUsers(users);
          setLoading(false);
        });

        // USER CONNECTED (nuovo visitatore)
        socket.on("user_connected", (data: any) => {
          if (!mounted) return;
          console.log("🔵 New visitor connected:", data.visitorNumber);

          setOnlineUsers((prev) => {
            // Check se già esiste
            if (prev.some((u) => u.sessionId === data.sessionId)) {
              console.log("⏭️ User already exists, skipping");
              return prev;
            }

            const newUser: OnlineUser = {
              id: `visitor-${data.visitorNumber}`,
              sessionId: data.sessionId,
              visitorNumber: data.visitorNumber,
              visitorId: data.visitorId,
              location: {
                country: data.location.country,
                city: data.location.city,
                region: data.location.region,
                countryCode: data.location.countryCode,
                timezone: data.location.timezone,
              },
              connectedAt: data.connectedAt,
              lastActivity: data.connectedAt,
              currentPage: "/",
              userAgent: null,
              ipAddress: null,
              isAuthenticated: false,
            };

            return [...prev, newUser];
          });
        });

        // USER DISCONNECTED (visitatore esce)
        socket.on("user_disconnected", (data: any) => {
          if (!mounted) return;
          console.log("🔴 Visitor disconnected:", data.visitorNumber);

          setOnlineUsers((prev) =>
            prev.filter((u) => u.sessionId !== data.sessionId),
          );
        });

        // ❌ DISCONNECT
        socket.on("disconnect", (reason: string) => {
          if (!mounted) return;
          console.log("🔴 Disconnected from admin tracking:", reason);
          setIsConnected(false);
        });

        // ❌ ERROR
        socket.on("connect_error", (error: any) => {
          if (!mounted) return;
          console.error("❌ Connection error:", error);
          setError("Failed to connect to real-time tracking");
        });
      } catch (error) {
        console.error("❌ Failed to setup WebSocket:", error);
        setError("Failed to setup WebSocket");
      }
    };

    connectWebSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        console.log("🧹 Cleaning up admin tracking WebSocket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const refreshData = useCallback(async () => {
    // Fallback
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/online`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const result = await response.json();
      if (result.success) {
        setOnlineUsers(result.users || []);
        setError(null);
      }
    } catch (err) {
      console.error("❌ Refresh failed:", err);
      setError("Failed to refresh data");
    }
  }, []);

  return {
    onlineUsers,
    loading,
    error,
    isConnected,
    totalOnline: onlineUsers.length,
    refreshData,
    getOnlineUsersByCountry: (country: string) =>
      onlineUsers.filter((user) => user.location?.country === country),
  };
}
