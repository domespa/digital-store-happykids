import { Card } from "../../../components/ui/Card";
import { useRealTimeUsers } from "../../../hooks/useRealTimeUsers";
import { TimeFilters } from "./TimeFilters";
import { ChartsSection } from "./ChartSection";
import { useCompleteDashboard } from "../../../hooks/useCompleteDashboard";
import Globe from "react-globe.gl";
import { useEffect, useRef, useState, useMemo } from "react";
import { useUserHistory } from "../../../hooks/useUserHistory";
import type { OnlineUser } from "../../../types/admin";
import VisitorDetailModal from "../components/VisitorDetailModal";
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
  "New York City": { lat: 40.7128, lng: -74.006 },
  Montreal: { lat: 45.5017, lng: -73.5673 },
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
//   TYPES
// ============================================
interface SessionWithLocation {
  id: string;
  timestamp: string;
  disconnectedAt: string | null;
  isOnline: boolean;
  city: string;
  country: string;
}

interface GroupedVisitor {
  visitorNumber: number;
  visitorId?: string;
  city: string;
  country: string;
  sessions: SessionWithLocation[];
  isOnline: boolean;
  latestTimestamp: string;
}

interface CombinedUser {
  id: string;
  visitorId?: string;
  visitorNumber: number | null | undefined;
  city: string;
  country: string;
  sessionCity: string;
  sessionCountry: string;
  timestamp: string;
  disconnectedAt: string | null;
  isOnline: boolean;
}

// ============================================
//   UTILITY FUNCTIONS
// ============================================
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
//   VISITOR CARD COMPONENT
// ============================================
interface VisitorCardMiniProps {
  visitor: GroupedVisitor;
  onClick: () => void;
}

const VisitorCardMini = ({ visitor, onClick }: VisitorCardMiniProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 mb-2 
                 bg-white dark:bg-slate-800 
                 border border-gray-200 dark:border-slate-700 
                 rounded-lg 
                 hover:bg-gray-50 dark:hover:bg-slate-700 
                 hover:shadow-md 
                 transition-all cursor-pointer 
                 group"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            visitor.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
          }`}
        />

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            #{visitor.visitorNumber}
          </span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {visitor.city}
          </span>
          <span className="text-gray-400 dark:text-gray-600">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {visitor.country}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {visitor.sessions.length}{" "}
          {visitor.sessions.length === 1 ? "sessione" : "sessioni"}
        </span>

        <svg
          className="w-4 h-4 text-gray-400 dark:text-gray-500 
                     group-hover:text-blue-500 dark:group-hover:text-blue-400 
                     group-hover:translate-x-1 transition-all"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {visitor.isOnline && (
        <span className="ml-2 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
          Online
        </span>
      )}
    </div>
  );
};

// ============================================
//   MAIN COMPONENT
// ============================================
export default function DashboardPageV2() {
  // ========== STATE ==========
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  const [selectedVisitorOnline, setSelectedVisitorOnline] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const globeEl = useRef<any>(null);

  // ========== HOOKS ==========
  const { onlineUsers } = useRealTimeUsers();
  const dashboard = useCompleteDashboard();
  const { history: userHistory, loading: historyLoading } = useUserHistory(20);

  // ==========  DEDUPLICA UTENTI ONLINE ==========
  const uniqueOnlineUsers = useMemo(() => {
    return onlineUsers.reduce<OnlineUser[]>((acc, user) => {
      if (!acc.some((u) => u.sessionId === user.sessionId)) {
        acc.push(user);
      }
      return acc;
    }, []);
  }, [onlineUsers]);

  const realOnlineUsers = useMemo(() => {
    return uniqueOnlineUsers.filter(
      (user) => user.visitorNumber !== null && user.visitorNumber !== undefined,
    );
  }, [uniqueOnlineUsers]);

  // ==========  COMBINED & DEDUPLICATED USERS ==========
  const visitorsUnique = useMemo(() => {
    // STEP 1: Combina online + history
    const combinedUsers: CombinedUser[] = [
      // Online users
      ...uniqueOnlineUsers.map((u) => ({
        id: u.sessionId,
        visitorId: u.visitorId,
        visitorNumber: u.visitorNumber,
        city: u.location?.city ?? "Unknown",
        country: u.location?.country ?? "Unknown",
        sessionCity: u.location?.city ?? "Unknown",
        sessionCountry: u.location?.country ?? "Unknown",
        timestamp: u.lastActivity || u.connectedAt || new Date().toISOString(),
        disconnectedAt: null as string | null,
        isOnline: true,
      })),
      // History users
      ...userHistory.map((h) => ({
        id: h.id,
        visitorId: h.visitorId,
        visitorNumber: h.visitorNumber,
        city: h.city,
        country: h.country,
        sessionCity: h.city,
        sessionCountry: h.country,
        timestamp: h.timestamp,
        disconnectedAt: h.disconnectedAt || null,
        isOnline: h.isOnline,
      })),
    ];

    // STEP 2: Filtra admin (visitorNumber null)
    const withoutAdmin = combinedUsers.filter(
      (user) => user.visitorNumber !== null && user.visitorNumber !== undefined,
    );

    // STEP 3: Deduplica per session ID
    const deduplicatedById = withoutAdmin.reduce((acc, user) => {
      if (!acc.some((u) => u.id === user.id)) {
        acc.push(user);
      }
      return acc;
    }, [] as CombinedUser[]);

    console.log(
      `🔍 Sessions: ${withoutAdmin.length} total, ${deduplicatedById.length} unique`,
    );

    // STEP 4: Raggruppa per visitor number
    const grouped = deduplicatedById.reduce(
      (acc, user) => {
        const visitorNumber = user.visitorNumber!;

        if (!acc[visitorNumber]) {
          acc[visitorNumber] = {
            visitorNumber,
            visitorId: user.visitorId,
            city: user.city,
            country: user.country,
            sessions: [],
            isOnline: false,
            latestTimestamp: user.timestamp,
          };
        }

        // Aggiungi sessione con location
        acc[visitorNumber].sessions.push({
          id: user.id,
          timestamp: user.timestamp,
          disconnectedAt: user.disconnectedAt,
          isOnline: user.isOnline,
          city: user.sessionCity,
          country: user.sessionCountry,
        });

        // Aggiorna stato online
        if (user.isOnline) {
          acc[visitorNumber].isOnline = true;
        }

        // Aggiorna timestamp più recente
        if (
          new Date(user.timestamp) >
          new Date(acc[visitorNumber].latestTimestamp)
        ) {
          acc[visitorNumber].latestTimestamp = user.timestamp;
        }

        return acc;
      },
      {} as Record<number, GroupedVisitor>,
    );

    // STEP 5: Converti in array e ordina (online first, poi per timestamp)
    return Object.values(grouped).sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return (
        new Date(b.latestTimestamp).getTime() -
        new Date(a.latestTimestamp).getTime()
      );
    });
  }, [uniqueOnlineUsers, userHistory]);

  // ========== GLOBE POINTS ==========
  const globePoints = useMemo(() => {
    return uniqueOnlineUsers
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
  }, [uniqueOnlineUsers]);

  // ========== EFFECT: GLOBE SETUP ==========
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

  // ========== HANDLER: VISITOR CLICK ==========
  const handleVisitorClick = (visitor: GroupedVisitor, isOnline: boolean) => {
    const mostRecentSession = visitor.sessions[0];

    console.log("🔍 Opening modal for visitor:", {
      visitorNumber: visitor.visitorNumber,
      visitorCity: visitor.city,
      visitorCountry: visitor.country,
      sessionCity: mostRecentSession?.city,
      sessionCountry: mostRecentSession?.country,
      allSessions: visitor.sessions,
    });

    setSelectedVisitor({
      visitorNumber: visitor.visitorNumber,
      visitorId: visitor.visitorId,
      location: {
        city: mostRecentSession?.city || visitor.city || "Unknown",
        country: mostRecentSession?.country || visitor.country || "Unknown",
        region: undefined,
        countryCode: undefined,
        timezone: undefined,
      },
      sessions: visitor.sessions,
      connectedAt: visitor.latestTimestamp,
      lastActivity: visitor.latestTimestamp,
    });
    setSelectedVisitorOnline(isOnline);
  };

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

  // ========== COMPUTED VALUES ==========
  const onlineVisitors = visitorsUnique.filter((v) => v.isOnline);
  const offlineVisitors = visitorsUnique.filter((v) => !v.isOnline);

  // ============================================
  //   RENDER
  // ============================================
  return (
    <div className="space-y-6 bg-gray-100 dark:bg-slate-900 min-h-screen">
      {/* ==================== GLOBE + VISITORS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GLOBE */}
        <Card className="p-4 shadow-2xl shadow-black/10">
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

        {/* VISITORS LIST */}
        <Card className="p-4 shadow-2xl shadow-black/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span>👥</span>
            <span>Visitors</span>
            <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
              {onlineVisitors.length} online / {visitorsUnique.length} total
            </span>
          </h3>

          <div className="h-[500px] overflow-y-auto pr-2">
            {historyLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </p>
                </div>
              </div>
            ) : visitorsUnique.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl mb-3">👥</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No visitors yet
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* ONLINE VISITORS */}
                {onlineVisitors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-green-600 dark:text-green-500 uppercase tracking-wide mb-2 px-2">
                      🟢 Online ({onlineVisitors.length})
                    </h4>
                    {onlineVisitors.map((visitor) => (
                      <VisitorCardMini
                        key={visitor.visitorNumber}
                        visitor={visitor}
                        onClick={() => handleVisitorClick(visitor, true)}
                      />
                    ))}
                  </div>
                )}

                {/* OFFLINE VISITORS */}
                {offlineVisitors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
                      📋 Recent History ({offlineVisitors.length})
                    </h4>
                    {offlineVisitors.map((visitor) => (
                      <VisitorCardMini
                        key={visitor.visitorNumber}
                        visitor={visitor}
                        onClick={() => handleVisitorClick(visitor, false)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* ==================== FILTERS ==================== */}
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

      {/* ==================== STAT CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <StatCard
          title="Avg Order"
          value={formatPrice(dashboard.summary.averageOrderValue)}
          icon="💳"
          color="pink"
        />
      </div>

      {/* ==================== CHARTS ==================== */}
      <ChartsSection
        period={dashboard.period}
        loading={false}
        data={dashboard.chartData}
        previousData={dashboard.previousChartData}
      />

      {/* ==================== RECENT ORDERS ==================== */}
      <Card className="p-6 shadow-2xl shadow-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>🔔</span>
            <span>Recent Orders</span>
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            {dashboard.recentActivity.length} recent
          </span>
        </div>

        {dashboard.recentActivity.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      #{activity.metadata.orderId.slice(-8)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.metadata.status === "COMPLETED"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : activity.metadata.status === "PAID"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : activity.metadata.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-primary"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {activity.metadata.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.metadata.items} item
                    {activity.metadata.items !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ==================== MODAL ==================== */}
      {selectedVisitor && (
        <VisitorDetailModal
          visitor={selectedVisitor}
          isOnline={selectedVisitorOnline}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </div>
  );
}
