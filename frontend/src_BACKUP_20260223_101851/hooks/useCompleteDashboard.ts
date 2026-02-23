import { useState, useEffect, useCallback } from "react";

export type TimePeriod = "today" | "week" | "month" | "year" | "total";

interface ChartDataPoint {
  period: string;
  orders: number;
  revenue: number;
  timestamp: string;
}

interface RecentActivity {
  id: string;
  type: "order";
  message: string;
  timestamp: string;
  metadata: {
    orderId: string;
    status: string;
    total: number;
    currency: string;
    items: number;
    customerName: string;
  };
}

export function useCompleteDashboard() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [realtime, setRealtime] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [previousChartData, setPreviousChartData] = useState<ChartDataPoint[]>(
    []
  );
  const [chartSummary, setChartSummary] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [activitySummary, setActivitySummary] = useState<any>(null);

  const loadData = useCallback(async (selectedPeriod: TimePeriod) => {
    setLoading(true);
    setError(null);

    try {
      console.log("📊 Loading complete dashboard...");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/dashboard/complete?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Set all data at once
        setMetrics(result.data.metrics);
        setRealtime(result.data.realtime);
        setChartData(result.data.charts.data || []);
        setPreviousChartData(result.data.charts.previousData || []);
        setChartSummary(result.data.charts.summary || {});
        setRecentActivity(result.data.recentActivity.activities || []);
        setActivitySummary(result.data.recentActivity.summary || {});

        console.log("✅ Complete dashboard loaded");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("❌ Error loading dashboard:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadData(period);
  }, [period, loadData]);

  const changePeriod = useCallback((newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
  }, []);

  const refresh = useCallback(async () => {
    await loadData(period);
  }, [period, loadData]);

  // Compute summary from metrics
  const summary = chartSummary || {
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    conversionRate: 0,
    averageOrderValue: 0,
  };

  return {
    // State
    loading,
    error,
    period,

    // Data
    metrics,
    realtime,
    chartData,
    previousChartData,
    summary,
    recentActivity,
    activitySummary,

    // Actions
    changePeriod,
    refresh,
  };
}
