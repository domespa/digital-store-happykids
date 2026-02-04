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
import type { AnalyticsFilters } from "../types/analytics";

interface LocationData {
  country: string;
  city: string;
  region: string;
  countryCode: string;
  timezone: string;
  socketId: string;
  visitorId: string;
  visitorNumber: number;
  timestamp: Date;
}

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
router.use(requireAuthenticatedAdmin);

// ====================================
//        PRODUCT ROUTES
// ====================================

router.get("/products", getProductsAdmin);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// ====================================
//         PRODUCT IMAGE
// ====================================

router.get("/products/:id/images", getProductImages);
router.post(
  "/products/:id/images",
  upload.array("images", 5),
  uploadProductImages,
);
router.delete("/products/:id/images/:imageId", deleteProductImage);
router.patch("/products/:id/images/:imageId/featured", setFeaturedImage);

// ====================================
//      PRODUCT EBOOK UPLOAD
// ====================================

router.post(
  "/products/:productId/upload-ebook",
  upload.single("ebook"),
  FileController.uploadProductEbook,
);
router.post(
  "/generate-download-link",
  FileController.generateCloudinaryDownloadLink,
);

// ====================================
//        ORDER
// ====================================

router.get("/orders", getOrdersAdmin);
router.put("/orders/:id/status", updateOrderStatus);
router.post("/orders/:id/resend-email", resendOrderEmail);

// ====================================
//      USER & WEBSOCKET - TRACKING
// ====================================

// GET /api/admin/users/online
router.get("/users/online", async (req, res) => {
  console.log("🔍 ADMIN ENDPOINT /users/online (UNIFIED)");
  try {
    const trackingService = (globalThis as any).trackingService;

    if (!trackingService) {
      console.error("❌ Tracking service not available");
      return res.status(500).json({
        success: false,
        error: "Tracking service not available",
      });
    }

    // Get online visitors from memory
    const onlineVisitors = trackingService.getOnlineVisitors();
    console.log(`📊 Online visitors: ${onlineVisitors.length}`);

    // Format for frontend
    const users = onlineVisitors.map((visitor: LocationData) => ({
      id: `visitor-${visitor.visitorNumber}`,
      sessionId: visitor.socketId,
      visitorNumber: visitor.visitorNumber,
      visitorId: visitor.visitorId,
      location: {
        country: visitor.country,
        city: visitor.city,
        region: visitor.region,
        countryCode: visitor.countryCode,
        timezone: visitor.timezone,
      },
      connectedAt: visitor.timestamp.toISOString(),
      lastActivity: visitor.timestamp.toISOString(),
      isAuthenticated: false,
    }));

    res.json({
      success: true,
      users,
      total: users.length,
      stats: {
        totalOnline: users.length,
        authenticated: 0,
        anonymous: users.length,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching online users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch online users",
    });
  }
});

// GET /api/admin/users/history
router.get("/users/history", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    console.log(`📊 Loading user history (limit: ${limit})`);

    const totalVisitors = await prisma.visitor.count();

    const trackingService = (globalThis as any).trackingService;
    const onlineVisitors: LocationData[] = trackingService
      ? trackingService.getOnlineVisitors()
      : [];

    // Pulisci sessioni fantasma (più vecchie di 5 minuti e ancora "online")
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    await prisma.session.updateMany({
      where: {
        isOnline: true,
        disconnectedAt: null,
        connectedAt: { lt: fiveMinutesAgo },
      },
      data: {
        isOnline: false,
        disconnectedAt: new Date(),
      },
    });

    console.log("✅ Cleaned up stale sessions");

    // Get ALL recent visitors
    const recentVisitors = await prisma.visitor.findMany({
      include: {
        sessions: {
          orderBy: { connectedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastSeen: "desc" },
      take: limit,
    });

    // DEBUG LOG
    console.log("📊 DEBUG - Visitors from DB (ordered by lastSeen DESC):");
    recentVisitors.forEach((v) => {
      console.log(
        `  #${v.visitorNumber}: ${v.lastCity}, ${v.lastCountry} - lastSeen: ${v.lastSeen.toISOString()}`,
      );
    });

    const onlineVisitorMap = new Map(
      onlineVisitors.map((v) => [v.visitorId, v]),
    );

    const history = recentVisitors
      .filter((v) => v.sessions.length > 0)
      .map((visitor) => {
        const latestSession = visitor.sessions[0];
        const onlineData = onlineVisitorMap.get(visitor.id);

        if (onlineData) {
          return {
            id: onlineData.socketId,
            visitorId: visitor.id,
            visitorNumber: visitor.visitorNumber,
            city: onlineData.city || "Unknown",
            country: onlineData.country || "Unknown",
            timestamp: onlineData.timestamp.toISOString(),
            disconnectedAt: null,
            isOnline: true,
          };
        }

        return {
          id: latestSession.sessionId,
          visitorId: visitor.id,
          visitorNumber: visitor.visitorNumber,
          city: latestSession.city || "Unknown",
          country: latestSession.country || "Unknown",
          timestamp: latestSession.connectedAt.toISOString(),
          disconnectedAt: latestSession.disconnectedAt?.toISOString() || null,
          isOnline: false,
        };
      });

    const onlineCount = history.filter((h) => h.isOnline).length;

    // DEBUG LOG
    console.log("📊 DEBUG - History returned (should match DB order):");
    history.forEach((h) => {
      console.log(
        `  #${h.visitorNumber}: ${h.city}, ${h.country} - isOnline: ${h.isOnline}`,
      );
    });

    console.log(
      `✅ Returning ${history.length} visitors (${onlineCount} online, ${history.length - onlineCount} offline)`,
    );

    res.json({
      success: true,
      history,
      total: history.length,
      totalVisitors,
      onlineCount,
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

// GET /api/admin/users/sessions (WebSocketConnection - per admin loggati)
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
                1000,
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

// GET /api/admin/analytics/total-visits
router.get("/analytics/total-visits", async (req, res) => {
  try {
    console.log("📊 Fetching total visits...");

    // Count total sessions (= total visits)
    const totalVisits = await prisma.session.count();

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
//   VISITOR ACTIVITY DETAILS
// ====================================

// GET /api/admin/visitors/:visitorId/events
router.get(
  "/visitors/:visitorId/events",
  async (req: Request, res: Response) => {
    try {
      const { visitorId } = req.params;

      if (!visitorId) {
        return res.status(400).json({
          success: false,
          error: "visitorId is required",
        });
      }

      // Fetch visitor info with sessions and events
      const visitor = await prisma.visitor.findUnique({
        where: { id: visitorId },
        include: {
          sessions: {
            orderBy: { connectedAt: "desc" },
            take: 10,
          },
          events: {
            orderBy: { timestamp: "desc" },
            take: 100,
          },
        },
      });

      if (!visitor) {
        return res.status(404).json({
          success: false,
          error: "Visitor not found",
        });
      }

      res.json({
        success: true,
        data: {
          visitor: {
            id: visitor.id,
            visitorNumber: visitor.visitorNumber,
            firstSeen: visitor.firstSeen,
            lastSeen: visitor.lastSeen,
            totalVisits: visitor.totalVisits,
            totalTimeSpent: visitor.totalTimeSpent,
            lastCountry: visitor.lastCountry,
            lastCity: visitor.lastCity,
          },
          sessions: visitor.sessions.map((session) => ({
            id: session.id,
            sessionId: session.sessionId,
            connectedAt: session.connectedAt,
            disconnectedAt: session.disconnectedAt,
            duration: session.duration,
            country: session.country,
            city: session.city,
            isOnline: session.isOnline,
          })),
          events: visitor.events.map((event) => ({
            id: event.id,
            type: event.type,
            page: event.page,
            pageTitle: event.pageTitle,
            productId: event.productId,
            orderId: event.orderId,
            value: event.value,
            metadata: event.metadata,
            timestamp: event.timestamp,
          })),
        },
      });
    } catch (error) {
      console.error("Error fetching visitor events:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch visitor events",
      });
    }
  },
);

// GET /api/admin/sessions/:sessionId/events
router.get(
  "/sessions/:sessionId/events",
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;

      console.log(`📊 Loading events for session: ${sessionId}`);

      const events = await prisma.event.findMany({
        where: { sessionId },
        orderBy: { timestamp: "asc" },
      });

      console.log(`✅ Found ${events.length} events for session ${sessionId}`);

      res.json({
        success: true,
        data: { events },
      });
    } catch (error) {
      console.error("❌ Error loading session events:", error);
      res.status(500).json({
        success: false,
        error: "Failed to load session events",
      });
    }
  },
);

// ====================================
//   DASHBOARD COMPLETE
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
        metrics: dashboardMetrics,
        realtime: realtimeMetrics,
        charts: {
          data: periodData.periodData,
          previousData: periodData.previousPeriodData,
          summary: periodData.summary,
        },
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

// GET /api/admin/dashboard/recent-activity
router.get(
  "/dashboard/recent-activity",
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
          2,
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
  },
);

// ====================================
//      ANALYTICS ENDPOINTS
// ====================================

// GET /api/admin/analytics/dashboard
router.get("/analytics/dashboard", async (req: Request, res: Response) => {
  try {
    const { period = "week" } = req.query;

    const filters: AnalyticsFilters = {
      period: period as any,
    };

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

// GET /api/admin/analytics/period-data
router.get("/analytics/period-data", async (req: Request, res: Response) => {
  try {
    const { period = "week", from, to } = req.query;

    const filters: AnalyticsFilters = {
      period: period as any,
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
    };

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

// GET /api/admin/analytics/realtime
router.get("/analytics/realtime", async (req: Request, res: Response) => {
  try {
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
