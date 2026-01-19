import { useState, useEffect, useCallback, useRef } from "react";
import { adminWebSocket } from "../services/adminApi";

interface UserHistoryEntry {
  id: string;
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
  const wsRef = useRef<any>(null);

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

  useEffect(() => {
    let mounted = true;

    const setupWebSocket = () => {
      try {
        console.log("🔧 UserHistory: Setting up WebSocket listener...");

        wsRef.current = adminWebSocket.connect((data: any) => {
          if (!mounted) return;

          if (data.type === "user_connected") {
            console.log(`✅ NEW USER CONNECTED:`, data);

            setHistory((prev) => {
              const visitorNum = data.visitorNumber || totalVisitors + 1;

              if (data.visitorNumber) {
                setTotalVisitors(data.visitorNumber);
              }

              const newVisitor: UserHistoryEntry = {
                id: data.sessionId,
                visitorNumber: visitorNum,
                city: data.location?.city || "Unknown",
                country: data.location?.country || "Unknown",
                timestamp: data.connectedAt || new Date().toISOString(),
                disconnectedAt: null,
                isOnline: true,
              };

              const updated = [newVisitor, ...prev];

              return updated.slice(0, limit);
            });

            console.log(
              `✅ Visitor #${data.visitorNumber || "N/A"} added to list (INSTANT, NO FETCH)`,
            );
          } else if (data.type === "user_disconnected") {
            console.log(`✅ USER DISCONNECTED:`, data);

            setHistory((prev) =>
              prev.map((visitor) => {
                if (visitor.id === data.sessionId) {
                  console.log(
                    `✅ Updating visitor ${data.sessionId} to offline`,
                  );
                  return {
                    ...visitor,
                    isOnline: false,
                    disconnectedAt:
                      data.disconnectedAt || new Date().toISOString(),
                  };
                }
                return visitor;
              }),
            );

            console.log(`✅ Visitor updated to offline (INSTANT, NO FETCH)`);
          }
        });

        if (wsRef.current) {
          console.log("✅ UserHistory: WebSocket connected");
        }
      } catch (error) {
        console.error("❌ UserHistory: Failed to setup WebSocket:", error);
      }
    };

    setupWebSocket();

    return () => {
      mounted = false;
      if (wsRef.current) {
        console.log("🧹 UserHistory: Cleaning up WebSocket");
        try {
          wsRef.current.removeAllListeners();
          wsRef.current.close();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
        wsRef.current = null;
      }
    };
  }, [limit, totalVisitors]);

  return {
    history,
    loading,
    error,
    totalVisitors,
    refresh: loadHistory,
  };
}
