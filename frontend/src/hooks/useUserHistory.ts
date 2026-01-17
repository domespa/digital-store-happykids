import { useState, useEffect, useCallback } from "react";

interface UserHistoryEntry {
  id: string;
  city: string;
  country: string;
  timestamp: string;
  isOnline: boolean;
}

export function useUserHistory(limit: number = 50) {
  const [history, setHistory] = useState<UserHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/users/history?limit=${limit}`,
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

  return {
    history,
    loading,
    error,
    refresh: loadHistory,
  };
}
