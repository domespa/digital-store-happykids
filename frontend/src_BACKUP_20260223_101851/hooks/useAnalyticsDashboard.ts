import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import type { DashboardStats } from "../types/admin";

export interface ChartDataPoint {
  period: string;
  orders: number;
  revenue: number;
  timestamp: string;
}

export type TimePeriod = "today" | "week" | "month" | "year" | "total";

export interface AnalyticsDashboardData {
  stats: DashboardStats | null;

  // GRAF
  chartData: ChartDataPoint[];
  previousChartData: ChartDataPoint[];

  insights: {
    peakPeriod?: {
      period: string;
      orders: number;
      revenue: number;
    };
    summary?: {
      totalOrders: number;
      totalRevenue: number;
      completedOrders: number;
      pendingOrders: number;
      conversionRate: number;
      averageOrderValue: number;
    };
  };

  loading: boolean;
  chartsLoading: boolean;
  error: string | null;

  period: TimePeriod;
}

export interface AnalyticsDashboardActions {
  changePeriod: (period: TimePeriod) => void;
  refreshData: () => Promise<void>;
  refreshCharts: () => Promise<void>;
}

export function useAnalyticsDashboard(): AnalyticsDashboardData &
  AnalyticsDashboardActions {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [previousChartData, setPreviousChartData] = useState<ChartDataPoint[]>(
    []
  );
  const [insights, setInsights] = useState<AnalyticsDashboardData["insights"]>(
    {}
  );
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiFilters = useCallback((selectedPeriod: TimePeriod) => {
    const filters: {
      period: "today" | "week" | "month" | "year" | "total";
      from?: string;
      to?: string;
    } = {
      period: "week", // DEF
    };

    switch (selectedPeriod) {
      case "today":
        filters.period = "today";
        break;
      case "week":
        filters.period = "week";
        break;
      case "month":
        filters.period = "month";
        break;
      case "year":
        filters.period = "year";
        break;
      case "total":
        filters.period = "total";
        break;
      default:
        filters.period = "week";
    }

    return filters;
  }, []);

  // FUNZIONE PER SVUOTARE LA CACHE PER GLI ORDINI
  const clearBackendCache = useCallback(async () => {
    try {
      console.log("🗑️ Clearing backend cache...");
      await adminApi.clearAnalyticsCache();
      console.log("✅ Backend cache cleared!");
    } catch (err) {
      console.warn("⚠️ Could not clear backend cache:", err);
      // Non bloccare se l'endpoint non esiste ancora
    }
  }, []);

  // LOAD DATA
  const loadDashboardStats = useCallback(async () => {
    try {
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      setError("Errore nel caricamento delle statistiche dashboard");
    }
  }, []);

  const loadChartData = useCallback(
    async (selectedPeriod: TimePeriod) => {
      console.log("🚀 Loading chart data for period:", selectedPeriod);
      setChartsLoading(true);

      try {
        const filters = getApiFilters(selectedPeriod);
        console.log("📋 API filters:", filters);

        const response = await adminApi.getPeriodData(filters);
        console.log("✅ API Response received:", response);

        if (response && response.success && response.data) {
          // PERIOD DATA
          const chartDataPoints: ChartDataPoint[] = Array.isArray(response.data)
            ? response.data.map((item: any) => ({
                period: item.period,
                orders: item.orders,
                revenue: item.revenue,
                timestamp: item.timestamp,
              }))
            : [];

          console.log("📊 Chart data points created:", chartDataPoints);
          setChartData(chartDataPoints);

          // PREVIOUS
          const previousDataPoints: ChartDataPoint[] = Array.isArray(
            response.previousData
          )
            ? response.previousData.map((item: any) => ({
                period: item.period,
                orders: item.orders,
                revenue: item.revenue,
                timestamp: item.timestamp,
              }))
            : [];

          console.log("📊 Previous chart data points:", previousDataPoints);
          setPreviousChartData(previousDataPoints);

          setInsights({
            peakPeriod: response.summary?.peakPeriod,
            summary: response.summary
              ? {
                  totalOrders: response.summary.totalOrders,
                  totalRevenue: response.summary.totalRevenue,
                  completedOrders: response.summary.completedOrders,
                  pendingOrders: response.summary.pendingOrders,
                  conversionRate: response.summary.conversionRate,
                  averageOrderValue: response.summary.averageOrderValue,
                }
              : undefined,
          });

          console.log("✅ Real data loaded successfully!");
        } else {
          console.warn("⚠️ Invalid API response structure:", response);
          setChartData([]);
          setPreviousChartData([]);
          setInsights({});
        }

        setError(null);
      } catch (err: any) {
        console.error("❌ Error loading chart data:", err);
        setError("Errore nel caricamento dei dati grafici. Riprova più tardi.");
        setChartData([]);
        setPreviousChartData([]);
        setInsights({});
      } finally {
        setChartsLoading(false);
      }
    },
    [getApiFilters]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      try {
        await Promise.all([loadDashboardStats(), loadChartData(period)]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [loadDashboardStats, loadChartData, period]);

  useEffect(() => {
    if (loading) return;
    loadChartData(period);
  }, [period]);

  const changePeriod = useCallback(
    (newPeriod: TimePeriod) => {
      if (newPeriod !== period) {
        setPeriod(newPeriod);
      }
    },
    [period]
  );

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // 🗑️ Clear cache PRIMA di ricaricare dati
      await clearBackendCache();

      // Poi carica dati freschi
      await Promise.all([loadDashboardStats(), loadChartData(period)]);

      console.log("✅ Manual refresh completed with cache cleared!");
    } finally {
      setLoading(false);
    }
  }, [loadDashboardStats, loadChartData, period, clearBackendCache]);

  const refreshCharts = useCallback(async () => {
    await loadChartData(period);
  }, [loadChartData, period]);

  return {
    // DATA
    stats,
    chartData,
    previousChartData,
    insights,
    period,

    // STATE
    loading,
    chartsLoading,
    error,

    // ACT
    changePeriod,
    refreshData,
    refreshCharts,
  };
}
