import { useEffect, useState, useRef, useCallback } from "react";
import adminApi from "../services/adminApi";
import type { RecentActivity } from "../services/adminApi";

interface UseRecentActivityReturn {
  recentActivity: RecentActivity[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

interface UseRecentActivityProps {
  autoRefresh?: boolean;
  limit?: number;
}

export function useRecentActivity(
  props: UseRecentActivityProps = {}
): UseRecentActivityReturn {
  const { autoRefresh = true, limit = 15 } = props;

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Abort fetch precedente se esiste
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // AbortController per questa fetch
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      setError(null);

      const activityResponse = await adminApi.getRecentActivity(limit, {
        signal,
      });

      // Controlla mounting E abort prima di setState
      if (isMountedRef.current && !signal.aborted) {
        setRecentActivity(activityResponse.activities);
      }
    } catch (error: any) {
      // Ignora errori da abort
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
        return;
      }

      if (isMountedRef.current && !signal.aborted) {
        console.error("Error fetching recent activity:", error);
        setError(error.message || "Failed to fetch recent activity");
      }
    } finally {
      if (isMountedRef.current && !signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [limit]);

  useEffect(() => {
    isMountedRef.current = true;

    fetchData();

    // REFRESH OGNI 3 MINUTI
    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      interval = setInterval(fetchData, 300000);
    }

    // Cleanup completo
    return () => {
      isMountedRef.current = false;

      // Abort fetch in corso
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear interval
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, autoRefresh]);

  return {
    recentActivity,
    isLoading,
    error,
    refreshData: fetchData,
  };
}
