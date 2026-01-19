import { useState, useEffect, useCallback, useRef } from "react";
import { adminWebSocket } from "../services/adminApi";

interface UserHistoryEntry {
  id: string;
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
        setError(null);
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

  // Initial load
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

          if (
            data.type === "user_connected" ||
            data.type === "user_disconnected"
          ) {
            console.log(`🔄 UserHistory: ${data.type} - reloading`);
            loadHistory();
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
  }, [loadHistory]);

  return {
    history,
    loading,
    error,
    refresh: loadHistory,
  };
}
