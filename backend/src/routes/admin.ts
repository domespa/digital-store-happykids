import { Router, Request, Response } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsAdmin,
  getProductImages,
  uploadProductImages,
  deleteProductImage,
  setFeaturedImage,
} from "../controllers/productController";
import {
  updateOrderStatus,
  getOrdersAdmin,
  resendOrderEmail,
} from "../controllers/orderController";
import { FileController } from "../controllers/fileController";
import { requireAuthenticatedAdmin } from "../middleware/auth";
import WebSocketService from "../services/websocketService";
import { AnalyticsService } from "../services/analyticsService";
import { prisma } from "../utils/prisma";
import { FileUploadService } from "../services/uploadService";
import { cache } from "../utils/cache";
import type { AnalyticsFilters } from "../types/analytics";

const getLocationTracking = () => {
  return (globalThis as any).locationTrackingWebSocket;
};

const router = Router();
const upload = FileUploadService.getMulterConfig();

declare global {
  namespace NodeJS {
    interface Global {
      webSocketService: WebSocketService;
    }
  }

  interface GlobalThis {
    webSocketService: WebSocketService;
  }
}

// APPLICHIAMO IL MIDDLEWARE ADMIN A TUTTE LE ROTTE!
// router.use(requireAuthenticatedAdmin);

// ====================================
//        PRODUCT ROUTES
// ====================================

// LISTA PRODOTTI CON PATH
// GET /api/admin/products
router.get("/products", getProductsAdmin);

// CREA PRODOTTO
// POST /api/admin/products
router.post("/products", createProduct);

// MODIFICA PRODOTTO
// PUT /api/admin/products/:id
router.put("/products/:id", updateProduct);

// ELIMINAZIONE SOFT
// DELETE /api/admin/products/:id
router.delete("/products/:id", deleteProduct);

// ====================================
//         PRODUCT IMAGE
// ====================================
// LISTA IM
// GET /api/admin/products/:id/images
router.get("/products/:id/images", getProductImages);

// AGGIORNA IM
// POST /api/admin/products/:id/images
router.post(
  "/products/:id/images",
  upload.array("images", 5),
  uploadProductImages
);

// DEL IM
// DELETE /api/admin/products/:id/images/:imageId
router.delete("/products/:id/images/:imageId", deleteProductImage);

// IMAMGINE IN EVIDENZA
// PATCH /api/admin/products/:id/images/:imageId/featured
router.patch("/products/:id/images/:imageId/featured", setFeaturedImage);

// ====================================
//      PRODUCT EBOOK UPLOAD
// ====================================

// UPLOAD EBOOK PER PRODOTTO
// POST /api/admin/products/:productId/upload-ebook
router.post(
  "/products/:productId/upload-ebook",
  upload.single("ebook"),
  FileController.uploadProductEbook
);

// GENERA DOWNLOAD LINK CLOUDINARY FIRMATO
// POST /api/admin/generate-download-link
router.post(
  "/generate-download-link",
  FileController.generateCloudinaryDownloadLink
);

// ====================================
//        ORDER
// ====================================
// ORDINE
// GET /api/admin/orders
router.get("/orders", getOrdersAdmin);
// PUT /api/admin/orders/:id/status
router.put("/orders/:id/status", updateOrderStatus);
router.post("/orders/:id/resend-email", resendOrderEmail);

// ====================================
//      USER & WEBSOCKET
// ====================================
// ONLINE USERS
// GET /api/admin/users/online
router.get("/users/online", async (req, res) => {
  console.log("🔍 ADMIN ENDPOINT /users/online (IP-only mode)");
  try {
    const webSocketService = (globalThis as any).webSocketService;
    const locationTrackingService = (globalThis as any).locationTrackingService;

    if (!webSocketService) {
      console.error("❌ WebSocket service not available");
      return res.status(500).json({
        success: false,
        error: "WebSocket service not available",
      });
    }

    const stats = await webSocketService.getConnectionStats();
    const onlineCount = webSocketService.getOnlineUsersCount();

    interface LocationData {
      country: string;
      city: string;
      region: string;
      countryCode: string;
      timezone: string;
      socketId: string;
      timestamp: Date;
    }

    const liveLocations: LocationData[] = locationTrackingService
      ? locationTrackingService.getOnlineUserLocations()
      : [];

    console.log(
      "📍 Live locations from tracking service:",
      liveLocations.length
    );

    // ✅ MAPPA socketId → location (FIX PRINCIPALE)
    const locationBySocketId = new Map<
      string,
      {
        country: string;
        city: string;
        region: string;
        countryCode: string;
        timezone: string;
      }
    >();

    liveLocations.forEach((loc) => {
      locationBySocketId.set(loc.socketId, {
        country: loc.country,
        city: loc.city,
        region: loc.region,
        countryCode: loc.countryCode,
        timezone: loc.timezone,
      });
    });

    // CACHE PER RECENT CONNECTIONS (30 secondi)
    const cacheKey = "online_users_connections";
    let recentConnections = cache.get<any[]>(cacheKey);

    if (!recentConnections) {
      console.log("🔄 Cache MISS: loading recent connections");
      recentConnections = await prisma.webSocketConnection.findMany({
        where: {
          isActive: true,
          lastPing: {
            gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              lastActivity: true,
            },
          },
        },
        take: 100,
        orderBy: {
          lastPing: "desc",
        },
      });
      cache.set(cacheKey, recentConnections, 30);
      console.log("📦 Cache SET: online users connections");
    } else {
      console.log("✅ Cache HIT: online users connections");
    }

    // ===============================
    // AUTHENTICATED USERS
    // ===============================
    const onlineUsers = recentConnections
      .filter((conn) => conn.user)
      .map((conn) => {
        const socketLocation = locationBySocketId.get(conn.socketId);

        const location = socketLocation ?? {
          country: "Italy",
          city: "Rome",
          region: "Lazio",
          countryCode: "IT",
          timezone: "Europe/Rome",
        };

        return {
          id: conn.user!.id,
          email: conn.user!.email,
          firstName: conn.user!.firstName,
          lastName: conn.user!.lastName,
          sessionId: conn.socketId,
          ipAddress: conn.ipAddress,
          userAgent: conn.userAgent,
          location,
          currentPage: "/dashboard",
          connectedAt: conn.connectedAt.toISOString(),
          lastActivity: conn.lastPing.toISOString(),
          isAuthenticated: true,
        };
      });

    // ===============================
    // ANONYMOUS USERS (INVARIATO)
    // ===============================
    const anonymousVisitors = liveLocations.map(
      (loc: LocationData, index: number) => ({
        id: `anonymous-${loc.socketId}`,
        email: "anonymous@visitor.com",
        firstName: "Anonymous",
        lastName: `Visitor ${index + 1}`,
        sessionId: loc.socketId,
        ipAddress: "unknown",
        userAgent: "unknown",
        location: {
          country: loc.country,
          city: loc.city,
          region: loc.region,
          countryCode: loc.countryCode,
          timezone: loc.timezone,
        },
        currentPage: "/",
        connectedAt: loc.timestamp.toISOString(),
        lastActivity: loc.timestamp.toISOString(),
        isAuthenticated: false,
      })
    );

    const allUsers = [...onlineUsers, ...anonymousVisitors];

    console.log(
      `✅ Returning ${allUsers.length} users (${onlineUsers.length} authenticated + ${anonymousVisitors.length} anonymous)`
    );

    res.json({
      success: true,
      users: allUsers,
      total: allUsers.length,
      stats: {
        totalOnline: onlineCount,
        totalConnections: stats.totalConnections,
        averageConnectionsPerUser: stats.averageConnectionsPerUser,
        authenticated: onlineUsers.length,
        anonymous: anonymousVisitors.length,
        locationDataAvailable: liveLocations.length > 0,
        detectionMethod: "socket+ip",
        precisionLevel: "city",
      },
    });
  } catch (error) {
    console.error("Error fetching online users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch online users",
    });
  }
});

// USERS SESSIONS
router.get("/users/sessions", async (req, res) => {
  try {
    const { limit = 100, offset = 0, userId, isActive } = req.query;

    const sessions = await prisma.webSocketConnection.findMany({
      where: {
        ...(userId ? { userId: userId as string } : {}),
        ...(isActive === "true" ? { isActive: true } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            lastActivity: true,
            lastLoginAt: true,
          },
        },
      },
      orderBy: {
        connectedAt: "desc",
      },
      take: Number(limit),
      skip: Number(offset),
    });

    const formattedSessions = sessions
      .filter((session) => session.user)
      .map((session) => ({
        id: session.id,
        userId: session.userId,
        user: session.user!,
        sessionId: session.socketId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        isActive: session.isActive,
        connectedAt: session.connectedAt.toISOString(),
        disconnectedAt: session.disconnectedAt?.toISOString() || null,
        lastPing: session.lastPing.toISOString(),
        duration: session.disconnectedAt
          ? Math.floor(
              (session.disconnectedAt.getTime() -
                session.connectedAt.getTime()) /
                1000
            )
          : Math.floor((Date.now() - session.connectedAt.getTime()) / 1000),
      }));

    res.json({
      success: true,
      sessions: formattedSessions,
      total: formattedSessions.length,
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user sessions",
    });
  }
});

// ====================================
//   USER VISIT HISTORY (FIXED)
// ====================================
router.get("/users/history", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const locationTracking = getLocationTracking();
    const liveLocations = locationTracking?.getOnlineUserLocations() || [];

    console.log(`📊 Live locations: ${liveLocations.length}`);

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeConnections = await prisma.webSocketConnection.findMany({
      where: {
        isActive: true,
        lastPing: { gte: fiveMinutesAgo },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log(`📊 Active connections from DB: ${activeConnections.length}`);
    const onlineHistory = liveLocations.map((loc: any, index: number) => ({
      id: loc.socketId || `loc-${index}`,
      city: loc.city || "Unknown",
      country: loc.country || "Unknown",
      timestamp: loc.timestamp?.toISOString() || new Date().toISOString(),
      isOnline: true,
    }));

    console.log(`✅ Online history: ${onlineHistory.length} entries`);

    const recentVisits = await prisma.pageView.findMany({
      where: {
        country: { not: null },
        createdAt: {
          lt: fiveMinutesAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.max(0, limit - onlineHistory.length),
      select: {
        id: true,
        country: true,
        createdAt: true,
      },
    });

    console.log(`📊 Offline visits: ${recentVisits.length} entries`);

    const offlineHistory = recentVisits.map((visit) => ({
      id: visit.id,
      country: visit.country || "Unknown",
      timestamp: visit.createdAt.toISOString(),
      isOnline: false,
    }));
    const history = [...onlineHistory, ...offlineHistory];

    console.log(
      `✅ Total history: ${history.length} (${onlineHistory.length} online, ${offlineHistory.length} offline)`
    );

    res.json({
      success: true,
      history,
      total: history.length,
      onlineCount: onlineHistory.length,
    });
  } catch (error) {
    console.error("❌ Error loading user history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load user history",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// WEBSOCKET STATS
// GET /api/admin/websocket/stats
router.get("/websocket/stats", async (req, res) => {
  try {
    const webSocketService = (globalThis as any).webSocketService;

    if (!webSocketService) {
      return res.status(500).json({
        success: false,
        error: "WebSocket service not available",
      });
    }

    const stats = await webSocketService.getConnectionStats();

    res.json({
      success: true,
      data: {
        onlineUsers: webSocketService.getOnlineUsersCount(),
        totalConnections: stats.totalConnections,
        averageConnectionsPerUser: stats.averageConnectionsPerUser,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching WebSocket stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch WebSocket stats",
    });
  }
});

// GET TOTAL VISITS (ALL TIME)
router.get("/analytics/total-visits", async (req, res) => {
  try {
    console.log("📊 Fetching total visits...");

    const totalVisits = await prisma.pageView.count();

    console.log(`✅ Total visits: ${totalVisits}`);

    res.json({
      success: true,
      totalVisits,
    });
  } catch (error) {
    console.error("❌ Error fetching total visits:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch total visits",
    });
  }
});

// ====================================
//   DASHBOARD COMPLETE NEW UPDATE
// ====================================
// GET /api/admin/dashboard/complete
router.get("/dashboard/complete", async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as string) || "today";

    console.log("📊 Loading complete dashboard for period:", period);

    const filters: AnalyticsFilters = {
      period: period as any,
    };

    const [dashboardMetrics, realtimeMetrics, periodData, recentOrders] =
      await Promise.all([
        AnalyticsService.getDashboardMetricsCached(filters),
        AnalyticsService.getRealTimeMetricsCached(),
        AnalyticsService.getPeriodDataCached(filters),
        AnalyticsService.getRecentOrdersCached(20),
      ]);

    const activities = recentOrders.map((order) => {
      let statusEmoji = "📦";
      let actionText = "placed";

      if (order.status === "COMPLETED") {
        statusEmoji = "✅";
        actionText = "completed";
      } else if (order.status === "PAID") {
        statusEmoji = "💳";
        actionText = "paid for";
      } else if (order.status === "PENDING") {
        statusEmoji = "⏳";
        actionText = "placed";
      } else if (order.status === "FAILED") {
        statusEmoji = "❌";
        actionText = "failed";
      } else if (order.status === "REFUNDED") {
        statusEmoji = "↩️";
        actionText = "refunded";
      }

      const currencySymbol =
        order.currency === "EUR"
          ? "€"
          : order.currency === "USD"
          ? "$"
          : order.currency === "GBP"
          ? "£"
          : order.currency;

      const message = `${statusEmoji} ${
        order.customerName
      } ${actionText} an order of ${currencySymbol}${order.total.toFixed(2)} (${
        order.itemCount
      } item${order.itemCount !== 1 ? "s" : ""})`;

      return {
        id: order.id,
        type: "order" as const,
        message,
        timestamp: order.createdAt.toISOString(),
        metadata: {
          orderId: order.id,
          status: order.status,
          total: order.total,
          currency: order.currency,
          items: order.itemCount,
          customerName: order.customerName,
        },
      };
    });

    const activitySummary = {
      total: activities.length,
      byStatus: {
        completed: activities.filter((a) => a.metadata.status === "COMPLETED")
          .length,
        paid: activities.filter((a) => a.metadata.status === "PAID").length,
        pending: activities.filter((a) => a.metadata.status === "PENDING")
          .length,
        failed: activities.filter((a) => a.metadata.status === "FAILED").length,
        refunded: activities.filter((a) => a.metadata.status === "REFUNDED")
          .length,
      },
    };

    res.json({
      success: true,
      data: {
        // CARD
        metrics: dashboardMetrics,

        // DATA
        realtime: realtimeMetrics,

        // GRAPH
        charts: {
          data: periodData.periodData,
          previousData: periodData.previousPeriodData,
          summary: periodData.summary,
        },

        // REC
        recentActivity: {
          activities,
          summary: activitySummary,
        },
      },
    });

    console.log("✅ Complete dashboard loaded successfully");
  } catch (error) {
    console.error("❌ Error loading complete dashboard:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load complete dashboard",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// ================================
//       RECENT ACTIVITY
// ================================
// Ordini più recenti
// GET /api/admin/dashboard/recent-activity
router.get(
  "/dashboard/recent-activity",
  // requireAuthenticatedAdmin,
  async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 15;
      const recentOrders = await AnalyticsService.getRecentOrdersCached(limit);

      const activities = recentOrders.map((order) => {
        let statusEmoji = "📦";
        let actionText = "placed";

        if (order.status === "COMPLETED") {
          statusEmoji = "✅";
          actionText = "completed";
        } else if (order.status === "PAID") {
          statusEmoji = "💳";
          actionText = "paid for";
        } else if (order.status === "PENDING") {
          statusEmoji = "⏳";
          actionText = "placed";
        } else if (order.status === "FAILED") {
          statusEmoji = "❌";
          actionText = "failed";
        } else if (order.status === "REFUNDED") {
          statusEmoji = "↩️";
          actionText = "refunded";
        }

        const currencySymbol =
          order.currency === "EUR"
            ? "€"
            : order.currency === "USD"
            ? "$"
            : order.currency === "GBP"
            ? "£"
            : order.currency;

        const message = `${statusEmoji} ${
          order.customerName
        } ${actionText} an order of ${currencySymbol}${order.total.toFixed(
          2
        )} (${order.itemCount} item${order.itemCount !== 1 ? "s" : ""})`;

        return {
          id: order.id,
          type: "order" as const,
          message,
          timestamp: order.createdAt.toISOString(),
          metadata: {
            orderId: order.id,
            status: order.status,
            total: order.total,
            currency: order.currency,
            items: order.itemCount,
            customerName: order.customerName,
          },
        };
      });

      const summary = {
        total: activities.length,
        byStatus: {
          completed: activities.filter((a) => a.metadata.status === "COMPLETED")
            .length,
          paid: activities.filter((a) => a.metadata.status === "PAID").length,
          pending: activities.filter((a) => a.metadata.status === "PENDING")
            .length,
          failed: activities.filter((a) => a.metadata.status === "FAILED")
            .length,
          refunded: activities.filter((a) => a.metadata.status === "REFUNDED")
            .length,
        },
      };

      res.json({
        success: true,
        activities,
        summary,
      });
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch recent activity",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// ====================================
//      ANALYTICS ENDPOINTS
// ====================================

// DASHBOARD METRICS
// GET /api/admin/analytics/dashboard
router.get("/analytics/dashboard", async (req: Request, res: Response) => {
  try {
    const { period = "week" } = req.query;

    const filters: AnalyticsFilters = {
      period: period as any,
    };

    // VERSIONE CACHED
    const metrics = await AnalyticsService.getDashboardMetricsCached(filters);

    res.json({
      success: true,
      data: {
        metrics: metrics || {
          revenue: { current: 0, previous: 0, change: 0 },
          orders: { current: 0, previous: 0, change: 0 },
          products: { current: 0, previous: 0, change: 0 },
          users: { current: 0, previous: 0, change: 0 },
          reviews: { current: 0, previous: 0, change: 0 },
        },
      },
    });
  } catch (error) {
    console.error("Error in dashboard endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// PERIOD DATA (per i grafici)
// GET /api/admin/analytics/period-data
router.get("/analytics/period-data", async (req: Request, res: Response) => {
  try {
    const { period = "week", from, to } = req.query;

    const filters: AnalyticsFilters = {
      period: period as any,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
    };

    // VERSIONE CACHED
    const result = await AnalyticsService.getPeriodDataCached(filters);

    res.json({
      success: true,
      data: result.periodData,
      previousData: result.previousPeriodData,
      summary: result.summary,
    });
  } catch (error) {
    console.error("Error in period-data endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// REALTIME METRICS
// GET /api/admin/analytics/realtime
router.get("/analytics/realtime", async (req: Request, res: Response) => {
  try {
    // VERSIONE CACHED
    const realtime = await AnalyticsService.getRealTimeMetricsCached();

    res.json({
      success: true,
      data: {
        realTime: realtime,
      },
    });
  } catch (error) {
    console.error("Error in realtime endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
