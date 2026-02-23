import { Card } from "../../components/ui/Card";
import { useRealTimeUsers } from "../../hooks/useRealTimeUsers";
import { TimeFilters } from "./TimeFilters";
import { ChartsSection } from "./ChartSection";
import { useAnalyticsDashboard } from "../../hooks/useAnalyticsDashboard";
import { useRecentActivity } from "../../hooks/useDashboardActivity";

interface DashboardPageProps {}

export default function DashboardPage({}: DashboardPageProps) {
  const { totalOnline, loading: usersLoading } = useRealTimeUsers();
  const analyticsData = useAnalyticsDashboard();
  const { recentActivity, isLoading: activityLoading } = useRecentActivity({
    limit: 20,
    autoRefresh: false,
  });

  const periodStats = analyticsData.insights.summary || {
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    conversionRate: 0,
    averageOrderValue: 0,
  };

  const isLoading = usersLoading || Boolean(analyticsData.loading);

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    borderColor = "green",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    borderColor?:
      | "blue"
      | "green"
      | "yellow"
      | "red"
      | "purple"
      | "pink"
      | "cyan";
  }) => {
    const gradients: Record<string, string> = {
      blue: "bg-gradient-to-br from-blue-500 to-blue-600",
      green: "bg-gradient-to-br from-green-500 to-green-600",
      yellow: "bg-gradient-to-br from-amber-500 to-amber-600",
      red: "bg-gradient-to-br from-red-500 to-red-600",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600",
      pink: "bg-gradient-to-br from-pink-500 to-pink-600",
      cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    };

    const borderColors: Record<string, string> = {
      blue: "border-blue-500",
      green: "border-green-500",
      yellow: "border-amber-500",
      red: "border-red-500",
      purple: "border-purple-500",
      pink: "border-pink-500",
      cyan: "border-cyan-500",
    };

    const glowColors: Record<string, string> = {
      blue: "dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
      green: "dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      yellow: "dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      red: "dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
      purple: "dark:shadow-[0_0_15px_rgba(168,85,247,0.2)]",
      pink: "dark:shadow-[0_0_15px_rgba(236,72,153,0.2)]",
      cyan: "dark:shadow-[0_0_15px_rgba(6,182,212,0.2)]",
    };

    return (
      <div
        className={`
          bg-stone-50 dark:bg-slate-800 
          p-6 rounded-xl 
          border-l-4 ${borderColors[borderColor]} 
          transition-all duration-300 
          shadow-sm hover:shadow-md
        `}
        style={{
          height: "108px",
          willChange: "transform",
          transform: "translateZ(0)", // GPU acceleration
        }}
      >
        <div className="flex items-center h-full">
          <div
            className={`
              p-3 rounded-lg 
              ${gradients[borderColor]} 
              text-white text-xl mr-4 
              shadow-sm ${glowColors[borderColor]}
              flex-shrink-0
            `}
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate"
              style={{ lineHeight: "1.25rem", height: "1.25rem" }}
            >
              {title}
            </p>
            <p
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate mt-1"
              style={{ lineHeight: "2rem", height: "2rem" }}
            >
              {value}
            </p>
            {subtitle && (
              <p
                className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1"
                style={{ lineHeight: "1.25rem", height: "1.25rem" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SkeletonStatCard = () => (
    <div
      className="
        bg-stone-50 dark:bg-slate-800 
        p-6 rounded-xl 
        border-l-4 border-gray-300
        shadow-sm
        animate-pulse
      "
      style={{
        height: "108px",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <div className="flex items-center h-full">
        <div
          className="bg-gray-300 dark:bg-gray-700 rounded-lg mr-4 flex-shrink-0"
          style={{
            width: "60px",
            height: "60px",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        ></div>
        <div className="flex-1">
          <div
            className="bg-gray-300 dark:bg-gray-700 rounded mb-2"
            style={{ height: "1rem", width: "6rem" }}
          ></div>
          <div
            className="bg-gray-300 dark:bg-gray-700 rounded"
            style={{ height: "2rem", width: "8rem" }}
          ></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div
        className="space-y-6 min-h-screen bg-stone-50 dark:bg-slate-900 transition-colors duration-300"
        style={{ contain: "layout style" }}
      >
        {/* HEADER */}
        <div
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6"
          style={{ minHeight: "120px" }}
        >
          <div
            style={{
              minHeight: "60px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
              style={{
                lineHeight: "2rem",
                height: "2rem",
                willChange: "transform",
                transform: "translateZ(0)",
              }}
            >
              Dashboard Analytics
            </h1>
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              style={{
                lineHeight: "1.25rem",
                height: "1.25rem",
                marginTop: "0.25rem",
              }}
            >
              Overview of performance and business metrics
            </p>
          </div>

          <div
            className="flex items-start gap-3"
            style={{
              minHeight: "80px",
              minWidth: "400px",
            }}
          >
            <div
              className="flex flex-col gap-2"
              style={{
                minHeight: "80px",
                width: "100%",
              }}
            >
              <TimeFilters
                loading={analyticsData.chartsLoading}
                selectedPeriod={analyticsData.period}
                onPeriodChange={analyticsData.changePeriod}
              />
              <button
                onClick={analyticsData.refreshData}
                disabled={analyticsData.loading || analyticsData.chartsLoading}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
             disabled:opacity-50 disabled:cursor-not-allowed flex items-center self-end border border-gray-300"
                style={{
                  height: "36px",
                  minWidth: "100px",
                }}
              >
                <span
                  className={`${
                    analyticsData.loading || analyticsData.chartsLoading
                      ? "animate-spin"
                      : ""
                  }`}
                >
                  🔄
                </span>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ROW 1: Stats Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ contain: "layout style", contentVisibility: "auto" }}
        >
          <div style={{ height: "108px", overflow: "hidden" }}>
            <SkeletonStatCard />
          </div>
          <div style={{ height: "108px", overflow: "hidden" }}>
            <SkeletonStatCard />
          </div>
          <div style={{ height: "108px", overflow: "hidden" }}>
            <SkeletonStatCard />
          </div>
        </div>

        {/* ROW 2: Performance Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ contain: "layout style" }}
        >
          <div style={{ height: "108px", overflow: "hidden" }}>
            <SkeletonStatCard />
          </div>
          <div style={{ height: "108px", overflow: "hidden" }}>
            <SkeletonStatCard />
          </div>
          <div style={{ height: "108px", overflow: "hidden" }}>
            <SkeletonStatCard />
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-[400px] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        {/* PEAK PERIOD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-[180px] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-[180px] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-[180px] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="min-h-[400px]">
          <div className="h-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 min-h-screen bg-stone-50 dark:bg-slate-900 transition-colors duration-300"
      style={{ contain: "layout style" }}
    >
      {/* HEADER */}
      <div
        className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4"
        style={{ minHeight: "88px", overflow: "hidden" }}
      >
        <div
          style={{
            height: "60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            style={{
              lineHeight: "2rem",
              height: "2rem",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            Dashboard Analytics
          </h1>
          <p
            className="text-sm text-gray-500 dark:text-gray-400"
            style={{
              lineHeight: "1.25rem",
              height: "1.25rem",
              marginTop: "0.25rem",
            }}
          >
            Overview of performance and business metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <TimeFilters
              loading={analyticsData.chartsLoading}
              selectedPeriod={analyticsData.period}
              onPeriodChange={analyticsData.changePeriod}
            />
            <button
              onClick={analyticsData.refreshData}
              disabled={analyticsData.loading || analyticsData.chartsLoading}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center self-end border border-gray-300"
            >
              <span
                className={`${
                  analyticsData.loading || analyticsData.chartsLoading
                    ? "animate-spin"
                    : ""
                }`}
              >
                🔄
              </span>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {analyticsData.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 min-h-[60px]">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span className="text-red-700 text-sm">{analyticsData.error}</span>
          </div>
        </div>
      )}

      {/* ROW 1: STATS */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ contain: "layout style" }}
      >
        <div
          style={{
            height: "108px",
            overflow: "hidden",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <StatCard
            title="Total Revenue"
            value={formatPrice(periodStats.totalRevenue)}
            icon="💰"
            borderColor="green"
          />
        </div>
        <div
          style={{
            height: "108px",
            overflow: "hidden",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <StatCard
            title="Completed Orders"
            value={periodStats.completedOrders}
            icon="✅"
            borderColor="blue"
          />
        </div>
        <div
          style={{
            height: "108px",
            overflow: "hidden",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <StatCard
            title="Pending Orders"
            value={periodStats.pendingOrders}
            icon="⏳"
            borderColor="purple"
          />
        </div>
      </div>

      {/* ROW 2: PERFORMANCE STATS */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{ contain: "layout style" }}
      >
        <div
          style={{
            height: "108px",
            overflow: "hidden",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <StatCard
            title="Conversion Rate"
            value={`${periodStats.conversionRate?.toFixed(1) || 0}%`}
            icon="📊"
            borderColor="yellow"
          />
        </div>
        <div
          style={{
            height: "108px",
            overflow: "hidden",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <StatCard
            title="Avg Order Value"
            value={formatPrice(periodStats.averageOrderValue)}
            icon="💳"
            borderColor="pink"
          />
        </div>
        <div
          style={{
            height: "108px",
            overflow: "hidden",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <StatCard
            title="Users Online"
            value={totalOnline}
            icon="👥"
            borderColor="cyan"
          />
        </div>
      </div>

      {/* CHARTS SECTION */}
      <ChartsSection
        period={analyticsData.period}
        loading={analyticsData.chartsLoading}
        data={analyticsData.chartData}
        previousData={analyticsData.previousChartData}
      />

      {/* PEAK PERIOD INSIGHTS */}
      {analyticsData.insights.peakPeriod && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="min-h-[180px]">
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Peak Period
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {analyticsData.insights.peakPeriod.period}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {analyticsData.insights.peakPeriod.orders} ordini,{" "}
                {formatPrice(analyticsData.insights.peakPeriod.revenue)}
              </p>
            </div>
          </Card>

          <Card className="min-h-[180px]">
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Orders by Period
              </h3>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {analyticsData.insights.summary?.totalOrders || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected Period
              </p>
            </div>
          </Card>

          <Card className="min-h-[180px]">
            <div className="text-center">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Revenue Period
              </h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {formatPrice(analyticsData.insights.summary?.totalRevenue || 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected Period
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* ROW 3: RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              🔔 <span className="ml-2">Recent Orders</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                Live Updates
              </span>
              {!activityLoading && recentActivity.length > 0 && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium">
                  {recentActivity.length} recent
                </span>
              )}
            </div>
          </div>

          {activityLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="h-[72px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-base font-medium">No recent orders</p>
              <p className="text-sm mt-1">
                New orders will appear here in real-time
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors border border-gray-100 dark:border-slate-600 min-h-[72px]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 font-medium">
                        Order #{activity.metadata.orderId.slice(-8)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium ${
                        activity.metadata.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : activity.metadata.status === "PAID"
                          ? "bg-blue-100 text-blue-700"
                          : activity.metadata.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : activity.metadata.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {activity.metadata.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activity.metadata.items} item
                      {activity.metadata.items !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
