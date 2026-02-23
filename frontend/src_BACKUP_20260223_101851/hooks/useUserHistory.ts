import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UserHistoryEntry {
  id: string;
  visitorId?: string;
  visitorNumber?: number;
  city: string;
  country: string;
  timestamp: string;
  disconnectedAt?: string | null;
  isOnline: boolean;
}

export function useUserHistory(limit: number = 20) {
  const [history, setHistory] = useState<UserHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/history?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setHistory(result.history || []);
        setTotalVisitors(result.totalVisitors || 0);
        setError(null);
        console.log(
          `✅ History loaded: ${result.history.length} visitors, total: ${result.totalVisitors}`,
        );
      } else {
        throw new Error("Invalid response");
      }
    } catch (err: any) {
      console.error("❌ Error loading user history:", err);
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Real-time WebSocket updates
  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}`, {
      path: "/admin-tracking",
      transports: ["websocket", "polling"],
      auth: {
        token: localStorage.getItem("adminToken"),
      },
    });

    socketRef.current = socket;

    // CONNECTED
    socket.on("user_connected", (data: any) => {
      console.log("🟢 User connected (real-time):", data.visitorNumber);

      setHistory((prev) => {
        const existingIndex = prev.findIndex(
          (h) => h.visitorNumber === data.visitorNumber,
        );

        if (existingIndex >= 0) {
          // Update
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            id: data.sessionId,
            isOnline: true,
            disconnectedAt: null,
            timestamp: data.connectedAt,
            city: data.location?.city || updated[existingIndex].city,
            country: data.location?.country || updated[existingIndex].country,
          };
          return updated;
        } else {
          // New visitor
          return [
            {
              id: data.sessionId,
              visitorId: data.visitorId,
              visitorNumber: data.visitorNumber,
              city: data.location?.city || "Unknown",
              country: data.location?.country || "Unknown",
              timestamp: data.connectedAt,
              disconnectedAt: null,
              isOnline: true,
            },
            ...prev,
          ];
        }
      });
    });

    // DISCONNECTED
    socket.on("user_disconnected", (data: any) => {
      console.log("🔴 User disconnected (real-time):", data.visitorNumber);

      setHistory((prev) => {
        const existingIndex = prev.findIndex(
          (h) => h.visitorNumber === data.visitorNumber,
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            isOnline: false,
            disconnectedAt: data.disconnectedAt,
          };
          return updated;
        } else {
          return [
            {
              id: data.sessionId,
              visitorId: data.visitorId,
              visitorNumber: data.visitorNumber,
              city: "Unknown",
              country: "Unknown",
              timestamp: data.disconnectedAt,
              disconnectedAt: data.disconnectedAt,
              isOnline: false,
            },
            ...prev,
          ];
        }
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return {
    history,
    loading,
    error,
    totalVisitors,
    refresh: loadHistory,
  };
}
