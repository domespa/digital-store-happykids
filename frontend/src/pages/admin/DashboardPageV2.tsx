import { Card } from "../../components/ui/Card";
import { useRealTimeUsers } from "../../hooks/useRealTimeUsers";
import { TimeFilters } from "./TimeFilters";
import { ChartsSection } from "./ChartSection";
import { useCompleteDashboard } from "../../hooks/useCompleteDashboard";
import Globe from "react-globe.gl";
import { useEffect, useRef, useState } from "react";
import { useUserHistory } from "../../hooks/useUserHistory";
import type { OnlineUser } from "../../types/admin";
import { landingAnalytics } from "../../services/adminApi";
import { SessionDetailModal } from "../../components/admin/SessionDetailModal";

// ============================================
//   CONSTANTS
// ============================================
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Catania: { lat: 37.5079, lng: 15.083 },
  Belpasso: { lat: 37.5917, lng: 14.9833 },
  Rome: { lat: 41.9028, lng: 12.4964 },
  Milan: { lat: 45.4642, lng: 9.19 },
  Naples: { lat: 40.8518, lng: 14.2681 },
  London: { lat: 51.5074, lng: -0.1278 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Berlin: { lat: 52.52, lng: 13.405 },
  Madrid: { lat: 40.4168, lng: -3.7038 },
  NewYork: { lat: 40.7128, lng: -74.006 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
};

const STAT_CARD_COLORS = {
  blue: "bg-blue-500 shadow-blue-500/20",
  green: "bg-green-500 shadow-green-500/20",
  yellow: "bg-amber-500 shadow-amber-500/20",
  red: "bg-red-500 shadow-red-500/20",
  purple: "bg-purple-500 shadow-purple-500/20",
  pink: "bg-pink-500 shadow-pink-500/20",
  cyan: "bg-cyan-500 shadow-cyan-500/20",
};

// ============================================
//   UTILITY FUNCTIONS
// ============================================
const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const formatExactTime = (timestamp: string): string => {
  const date = new Date(timestamp);

  return date.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatSessionDuration = (startTime: string, endTime?: string): string => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();

  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "(<1m)";
  if (diffHours > 0) {
    return `(${diffHours}h ${diffMins % 60}m)`;
  }
  return `(${diffMins}m)`;
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

// ============================================
//   STAT CARD COMPONENT
// ============================================
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: keyof typeof STAT_CARD_COLORS;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: StatCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-lg ${STAT_CARD_COLORS[color]} text-white shadow-lg`}
        >
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate mt-0.5">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// ============================================
//   MAIN COMPONENT
// ============================================
export default function DashboardPageV2() {
  // ========== HOOKS ==========
  const { onlineUsers } = useRealTimeUsers();
  const dashboard = useCompleteDashboard();
  const { history: userHistory, loading: historyLoading } = useUserHistory(20);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // ========== GLOBE STATE ==========
  const globeEl = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);

  // ========== DEDUPLICAZIONE UTENTI ONLINE ==========
  const uniqueOnlineUsers = onlineUsers.reduce<OnlineUser[]>((acc, user) => {
    if (!acc.some((u) => u.sessionId === user.sessionId)) {
      acc.push(user);
    }
    return acc;
  }, []);

  const realOnlineUsers = uniqueOnlineUsers.filter(
    (user) => user.visitorNumber !== null && user.visitorNumber !== undefined,
  );

  // ========== COMBINED USERS ==========
  const combinedUsers = [
    ...uniqueOnlineUsers.map((u) => ({
      id: u.sessionId,
      visitorNumber: u.visitorNumber,
      city: u.location?.city ?? "Unknown",
      country: u.location?.country ?? "Unknown",
      timestamp: u.lastActivity || u.connectedAt || new Date().toISOString(),
      disconnectedAt: null as string | null,
      isOnline: true,
    })),
    ...userHistory.map((h) => ({
      id: h.id,
      visitorNumber: h.visitorNumber,
      city: h.city,
      country: h.country,
      timestamp: h.timestamp,
      disconnectedAt: h.disconnectedAt || null,
      isOnline: h.isOnline,
    })),
  ];

  const combinedUsersWithoutAdmin = combinedUsers.filter(
    (user) => user.visitorNumber !== null && user.visitorNumber !== undefined,
  );

  // ========== DEDUPLICAZIONE SOLO PER SESSION ID ==========
  const deduplicateBySessionId = (
    users: typeof combinedUsers,
  ): typeof combinedUsers => {
    const seen = new Map<string, (typeof combinedUsers)[0]>();

    return users.filter((user) => {
      if (seen.has(user.id)) {
        return false;
      }
      seen.set(user.id, user);
      return true;
    });
  };

  // ========== ORDINAMENTO FINALE ==========
  const combinedUsersSorted = deduplicateBySessionId(
    [...combinedUsersWithoutAdmin].sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }),
  );

  // ========== GLOBE DATA ==========
  const globePoints = uniqueOnlineUsers
    .filter(
      (user) =>
        user.visitorNumber !== null &&
        user.visitorNumber !== undefined &&
        user.location?.city,
    )
    .filter((user) => {
      const cityKey = user.location!.city!.replace(/\s+/g, "");
      return CITY_COORDINATES[cityKey];
    })
    .map((user) => {
      const cityKey = user.location!.city!.replace(/\s+/g, "");
      const coords = CITY_COORDINATES[cityKey];

      return {
        lat: coords.lat,
        lng: coords.lng,
        size: 0.8,
        color: "#3b82f6",
        label: `${user.location?.city}, ${user.location?.country}`,
      };
    });

  // ========== GLOBE SETUP ==========
  useEffect(() => {
    if (!globeEl.current || !globeReady) return;

    const isMobile = window.innerWidth < 768;
    const altitude = isMobile ? 5.5 : 2.8;

    globeEl.current.pointOfView({ altitude }, 1000);

    const controls = globeEl.current.controls();
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.5;
  }, [globeReady]);

  // ========== LOADING STATE ==========
  if (dashboard.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="space-y-6 bg-stone-50 dark:bg-slate-900 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of your business performance
          </p>
        </div>
      </div>

      {/* GLOBE + USERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span>🌍</span>
            <span>Live User Locations</span>
            <span className="ml-auto text-sm font-normal text-gray-500">
              {realOnlineUsers.length} online
            </span>
          </h3>
          <div className="relative h-[300px] md:h-[500px] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                pointsData={globePoints}
                pointAltitude={0.01}
                pointRadius={0.8}
                pointColor="color"
                pointLabel="label"
                onGlobeReady={() => setGlobeReady(true)}
                animateIn={false}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span>👥</span>
            <span>User History</span>
            <span className="ml-auto text-sm font-normal text-gray-500">
              {realOnlineUsers.length} online / {combinedUsersSorted.length}{" "}
              total
            </span>
          </h3>

          <div className="h-[500px] overflow-y-auto space-y-2">
            {historyLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : combinedUsersSorted.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No visitors yet</p>
            ) : (
              combinedUsersSorted.map((entry) => {
                const visitorNumber = entry.visitorNumber;

                return (
                  <div
                    key={entry.id}
                    onClick={() => {
                      landingAnalytics
                        .getSessions({ limit: 100, days: 30 })
                        .then((res) => {
                          // Prima prova con visitor_id se esiste
                          let session = res.sessions.find(
                            (s) =>
                              s.visitor_id && entry.id.includes(s.visitor_id),
                          );

                          // Se non trova, prova con timestamp
                          if (!session) {
                            const entryTime = new Date(
                              entry.timestamp,
                            ).getTime();
                            session = res.sessions.find((s) => {
                              const sessionTime = new Date(
                                s.started_at,
                              ).getTime();
                              const diff = Math.abs(entryTime - sessionTime);
                              return diff < 300000; // 5 minuti
                            });
                          }

                          if (session) {
                            setSelectedSession(session);
                          } else {
                            alert(
                              "Nessuna sessione analytics trovata per questo visitatore",
                            );
                          }
                        });
                    }}
                    className="p-2 sm:p-3 bg-gray-50 dark:bg-slate-700 rounded-lg space-y-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    {/* Header: Visitatore + Location */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            entry.isOnline
                              ? "bg-green-500 animate-pulse"
                              : "bg-gray-400"
                          }`}
                        />
                        <p className="text-xs sm:text-sm font-medium truncate">
                          <span className="text-gray-500 dark:text-gray-400">
                            Visitatore nr {visitorNumber}
                          </span>
                          <span className="mx-1.5">•</span>
                          {entry.city && entry.city !== "Unknown" ? (
                            <>
                              <span className="font-semibold">
                                {entry.city}
                              </span>
                              <span className="text-gray-400 mx-1">•</span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {entry.country}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-500 dark:text-gray-400">
                                Unknown City
                              </span>
                              <span className="text-gray-400 mx-1">•</span>
                              <span className="font-semibold">
                                {entry.country}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      {entry.isOnline && (
                        <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium flex-shrink-0">
                          Online
                        </span>
                      )}
                    </div>

                    {/* Time info */}
                    <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 pl-4">
                      {entry.isOnline ? (
                        <div>
                          <span className="font-medium">A:</span>{" "}
                          {formatExactTime(entry.timestamp)}
                        </div>
                      ) : entry.disconnectedAt ? (
                        <div className="space-y-0.5">
                          <div>
                            <span className="font-medium">A:</span>{" "}
                            {formatExactTime(entry.timestamp)}
                          </div>
                          <div>
                            <span className="font-medium">P:</span>{" "}
                            {formatExactTime(entry.disconnectedAt)}
                          </div>
                          <div className="text-gray-500">
                            {formatSessionDuration(
                              entry.timestamp,
                              entry.disconnectedAt,
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">Visto:</span>{" "}
                          {formatExactTime(entry.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* FILTRI */}
      <div className="flex items-center gap-3">
        <TimeFilters
          loading={dashboard.loading}
          selectedPeriod={dashboard.period}
          onPeriodChange={dashboard.changePeriod}
        />
        <button
          onClick={dashboard.refresh}
          disabled={dashboard.loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 flex items-center gap-2"
        >
          <span className={dashboard.loading ? "animate-spin" : ""}>🔄</span>
          Refresh
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(dashboard.summary.totalRevenue)}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Completed"
          value={dashboard.summary.completedOrders}
          icon="✅"
          color="blue"
        />
        <StatCard
          title="Pending"
          value={dashboard.summary.pendingOrders}
          icon="⏳"
          color="yellow"
        />
        {/* <StatCard
          title="Conversion"
          value={`${dashboard.summary.conversionRate?.toFixed(1) || 0}%`}
          icon="📊"
          color="purple"
        /> */}
        <StatCard
          title="Avg Order"
          value={formatPrice(dashboard.summary.averageOrderValue)}
          icon="💳"
          color="pink"
        />
        {/* <StatCard
          title="Online"
          value={uniqueOnlineUsers.length}
          icon="👥"
          color="cyan"
        /> */}
      </div>

      {/* CHARTS */}
      <ChartsSection
        period={dashboard.period}
        loading={false}
        data={dashboard.chartData}
        previousData={dashboard.previousChartData}
      />

      {/* RECENT ORDERS */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>🔔</span>
            <span>Recent Orders</span>
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            {dashboard.recentActivity.length} recent
          </span>
        </div>

        {dashboard.recentActivity.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-base font-medium">No recent orders</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {dashboard.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg 
                         border border-gray-100 dark:border-slate-600 
                         hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600 font-medium">
                      #{activity.metadata.orderId.slice(-8)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.metadata.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : activity.metadata.status === "PAID"
                          ? "bg-blue-100 text-blue-700"
                          : activity.metadata.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
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
      {/* Modal */}
      {selectedSession && (
        <div className="relative z-[9999]">
          <SessionDetailModal
            session={selectedSession}
            onClose={() => setSelectedSession(null)}
          />
        </div>
      )}
    </div>
  );
}
