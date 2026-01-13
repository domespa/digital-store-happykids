console.log("🔥 SERVER.TS STARTED - Before imports");

import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { prisma } from "./utils/prisma";

// IMPORT SECURITY
import {
  generalLimiter,
  speedLimiter,
  authLimiter,
  orderLimiter,
} from "./middleware/rateLimiting";
import {
  requestLogger,
  sanitizeInput,
  checkOrigin,
} from "./middleware/security";
import { reviewRateLimit } from "./middleware/reviewRateLimit";

// IMPORT ROTTE
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/order";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import webhookRoutes from "./routes/webhook";
import categoryRoutes from "./routes/category";
import inventoryRoutes from "./routes/inventory";
import reviewRoutes from "./routes/review";
import wishlistRoutes from "./routes/wishlist";
import searchRoutes from "./routes/search";
import analyticsRoutes from "./routes/analytics";
import { createNotificationRoutes } from "./routes/notification";
import recommendationRoutes from "./routes/recommendation";
import paymentRoutes from "./routes/payment";

// IMPORT SUPPORT SYSTEM
import { setupSupportRoutes } from "./routes/support";
import NotificationService from "./services/notificationService";
import EmailService from "./services/emailService";
import WebSocketService from "./services/websocketService";
import LocationTrackingWebSocket from "./services/locationTrackingWebSocket";
import { FileUploadService } from "./services/uploadService";

// IMPORT CURRENCY
import currencyRoutes from "./routes/currency";

// CARICHIAMO LE VARIABILI DI AMBIENTE
dotenv.config();

console.log("🔥 DOTENV LOADED");
console.log("🔥 PORT:", process.env.PORT);
console.log("🔥 NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL at runtime:", process.env.DATABASE_URL);

// CREO APP EXPRESS
const app = express();
const PORT = process.env.PORT || 3001;

// CREATE HTTP SERVER PER WEBSOCKET
const httpServer = createServer(app);

// SERVIZI CONDIVISI
let emailService: EmailService;
let uploadService: FileUploadService;
let websocketService: WebSocketService;
let notificationService: NotificationService;
let locationTrackingService: LocationTrackingWebSocket;

try {
  console.log("🔧 Initializing services...");

  emailService = new EmailService();
  console.log("✅ EmailService initialized");

  uploadService = new FileUploadService();
  console.log("✅ UploadService initialized");

  // ✅ STEP 1: Inizializza WebSocketService
  websocketService = new WebSocketService(httpServer);
  console.log("✅ WebSocketService initialized");

  // ✅ STEP 2: Assegna a globalThis
  (globalThis as any).webSocketService = websocketService;
  console.log("✅ WebSocketService assigned to globalThis");

  notificationService = new NotificationService(websocketService, emailService);
  console.log("✅ NotificationService initialized");

  // ✅ STEP 3: Passa websocketService direttamente a LocationTrackingWebSocket
  locationTrackingService = new LocationTrackingWebSocket(
    httpServer,
    websocketService, // Passa il riferimento direttamente
    "/location"
  );
  console.log("✅ LocationTrackingService initialized");

  // ✅ STEP 4: Assegna anche locationTracking a globalThis
  (globalThis as any).locationTrackingService = locationTrackingService;
  console.log("✅ LocationTrackingService assigned to globalThis");
} catch (error) {
  console.error("❌ FATAL: Service initialization failed:", error);
  process.exit(1);
}

// ========================
// GLOBAL SERVICE ASSIGNMENT
// ========================

declare global {
  namespace NodeJS {
    interface Global {
      webSocketService: WebSocketService;
      locationTrackingService: LocationTrackingWebSocket;
    }
  }
}

//=====================================================
// ==================== MIDDLEWARE ====================
//=====================================================

// 1. SICUREZZA GENERALE
app.use(helmet());
app.use(requestLogger);

// 2. CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: [
      ...allowedOrigins,
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://shethrivesadhd.com",
      "https://www.shethrivesadhd.com",
      "https://shethrivesadhd.vercel.app",
    ],
    credentials: true,
  })
);

// 3. RATE LIMITING GLOBALE
app.use(generalLimiter);
app.use(speedLimiter);

// 4. WEBHOOK STRIPE (DEVE ESSERE PRIMA DI express.json())
app.use("/api/stripe", webhookRoutes);

// 5. PARSING BODY (DOPO WEBHOOKS)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 6. SANITIZZAZIONE INPUT
app.use(sanitizeInput);

//=====================================================
// ==================== HEALTH CHECK ==================
//=====================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Digital Store Backend running",
    timestamp: new Date().toISOString(),
    readable: new Date().toLocaleString("it-IT"),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    services: {
      database: "connected",
      reviews: "operational",
      payments: "operational",
      notifications: "operational",
      websocket: "enabled",
      recommendations: "operational",
      support: "operational",
      supportAnalytics: "enabled",
      realTimeSupport: "enabled",
    },
  });
});

//=====================================================
// ================ ROUTE PUBBLICHE ===================
//=====================================================

// CURRENCY
app.use("/api/currency", currencyRoutes);

// AUTH (CON RATE LIMITING SPECIFICO)
app.use("/api/auth", authLimiter, authRoutes);

// PRODOTTI (PUBBLICO)
app.use("/api/products", productRoutes);

// CATEGORIE (PUBBLICO)
app.use("/api/categories", categoryRoutes);

// RACCOMANDAZIONI (PUBBLICO + AUTENTICATO)
app.use("/api/recommendations", recommendationRoutes);

// RECENSIONI (PUBBLICO + AUTENTICATO)
app.use("/api/reviews", reviewRateLimit.globalLimit, reviewRoutes);

// RICERCA (PUBBLICO + AUTENTICATO)
app.use("/api/search", searchRoutes);

//=====================================================
// =============== NOTIFICHE (WEBSOCKET) ==============
//=====================================================

const notificationRouter = createNotificationRoutes(websocketService);
app.use("/api/notifications", notificationRouter);

//=====================================================
// ================ ROUTE AUTENTICATE =================
//=====================================================

// WISHLIST
app.use("/api/wishlist", wishlistRoutes);

// ORDINI (RICHIEDE AUTH)
app.use("/api/orders", orderLimiter, orderRoutes);
app.use("/api/payments", paymentRoutes);

// UTENTI (RICHIEDE AUTH)
app.use("/api/user", userRoutes);

// INVENTARIO (RICHIEDE AUTH)
app.use("/api/inventory", inventoryRoutes);

//=====================================================
// ================ SUPPORT SYSTEM ====================
//=====================================================

// SUPPORT ROUTES (RICHIEDE AUTH)
const supportRoutes = setupSupportRoutes(
  prisma,
  {
    websocketService: websocketService,
    emailService: emailService,
    notificationService: notificationService,
    uploadService: uploadService,
  },
  {
    enableAnalytics: true,
    enableAgentManagement: false,
    rateLimitConfig: {
      ticketCreation: { windowMs: 3600000, max: 5 }, // 5 tickets/hour
      messaging: { windowMs: 300000, max: 20 }, // 20 messages/5min
    },
  }
);

app.use("/api/support", supportRoutes);

//=====================================================
// ==================== ROUTE ADMIN ===================
//=====================================================

// ADMIN GENERALE (RICHIEDE ADMIN AUTH)
app.use("/api/admin", adminRoutes);

// ANALYTICS (RICHIEDE ADMIN AUTH)
app.use("/api/admin/analytics", analyticsRoutes);

//=====================================================
// ================== API INFO ENDPOINT ===============
//=====================================================

app.get("/api/info", (req, res) => {
  res.json({
    name: "Digital Store API",
    version: "1.0.0",
    description: "Modern e-commerce backend with advanced features",
    timestamp: new Date().toISOString(),
    features: {
      authentication: "JWT with refresh tokens",
      database: "PostgreSQL with Prisma ORM",
      notifications: "Real-time WebSocket + Email",
      payments: "Stripe integration",
      search: "Advanced product search",
      reviews: "Product reviews with voting",
      recommendations: "AI-powered suggestions",
      analytics: "Business metrics dashboard",
      support: "Multi-level ticketing system",
      security: "Rate limiting, input sanitization, CORS",
    },
    endpoints: {
      health: "/api/health",
      auth: "/api/auth/*",
      products: "/api/products/*",
      orders: "/api/orders/*",
      users: "/api/user/*",
      reviews: "/api/reviews/*",
      notifications: "/api/notifications/*",
      recommendations: "/api/recommendations/*",
      admin: "/api/admin/*",
      analytics: "/api/analytics/*",
      support: "/api/support/*",
    },
    rateLimits: {
      general: "100 requests per 15 minutes",
      speed: "10 requests per second",
      auth: {
        login: "5 attempts per 15 minutes",
        register: "3 registrations per hour",
        refresh: "10 per 15 minutes",
      },
      orders: {
        create: "10 per hour",
        update: "20 per hour",
        read: "100 per 15 minutes",
      },
      reviews: {
        create: "5 per hour (authenticated), 2 per day (guest)",
        vote: "50 per hour",
        report: "10 per hour",
        read: "100 per 15 minutes",
      },
      wishlist: {
        standard: "20 per 15 minutes",
        bulk: "5 per hour",
        sharing: "3 per hour",
      },
      search: {
        standard: "100 per 15 minutes",
        autocomplete: "300 per 15 minutes",
        advanced: "30 per hour",
      },
      admin: "100 moderation actions per hour",
      notifications: {
        general: "100 requests per 15 minutes",
        admin: "200 requests per 15 minutes",
        bulk: "10 bulk operations per hour",
        markRead: "50 mark as read per minute",
      },
      recommendations: {
        authenticated: "100 requests per 15 minutes",
        public: "100 requests per 15 minutes",
        bulk: "10 bulk operations per 5 minutes",
      },
    },
    features_detailed: {
      websocket: "Real-time notifications enabled",
      email: "Email notifications enabled",
      templates: "Customizable notification templates",
      scheduling: "Scheduled notifications support",
      preferences: "User notification preferences",
      recommendations: "AI-powered product recommendations",
      collaborative_filtering: "User-based recommendations",
      content_filtering: "Category-based recommendations",
      trending_analysis: "Real-time trending products",
      bulk_operations: "Batch recommendation processing",
      // SUPPORT FEATURES
      support_system: "Enterprise support system enabled",
      support_tickets: "Multi-level ticketing system",
      support_chat: "Real-time support messaging",
      support_escalation: "Multi-tier escalation system",
      support_sla: "SLA tracking and monitoring",
      support_analytics: "Real-time support analytics dashboard",
      support_satisfaction: "Customer satisfaction tracking",
      support_multi_tenant: "Multi-business model support",
      support_real_time: "WebSocket real-time updates",
      support_reports: "Custom analytics reports and export",
    },
  });
});

//=====================================================
//================== ERROR HANDLERS ==================
//=====================================================

// 404 - PAGINA NON TROVATA
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      "GET /api/health",
      "GET /api/info",
      "GET /api/test-db",
      "POST /api/auth/login",
      "GET /api/products",
      "GET /api/reviews",
      "GET /api/notifications",
      "GET /api/recommendations/trending",
      "GET /api/support/tickets",
    ],
  });
});

// GLOBAL ERROR HANDLER
app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error:", error);

    // RATE LIMITING ERRORS
    if (error instanceof Error && error.message.includes("Too many requests")) {
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded",
        message: "Please try again later",
        retryAfter: "15 minutes",
      });
    }

    // PRISMA ERRORS
    if (error instanceof Error && error.name?.includes("Prisma")) {
      return res.status(500).json({
        success: false,
        error: "Database error",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Database operation failed",
      });
    }

    // SUPPORT ERRORS
    if (error instanceof Error && error.message.includes("SUPPORT_")) {
      return res.status(400).json({
        success: false,
        error: "Support system error",
        message: error.message,
      });
    }

    // VALIDATION ERRORS
    if (
      error instanceof Error &&
      (error.message.includes("validation") ||
        error.message.includes("Invalid"))
    ) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: error.message,
      });
    }

    // CUSTOM ERROR HANDLING
    let status = 500;
    let message = "Internal server error";

    if (error instanceof Error) {
      message =
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong";

      // CHECK FOR CUSTOM STATUS
      if ("status" in error && typeof error.status === "number") {
        status = error.status;
      }
    }

    res.status(status).json({
      success: false,
      error: "Internal server error",
      message,
      ...(process.env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    });
  }
);

//=====================================================
//================== SERVER STARTUP ===================
//=====================================================

httpServer.listen(PORT, () => {
  console.log(`
🚀 Digital Store Backend started!
📡 Server: http://localhost:${PORT}
🧪 Health: http://localhost:${PORT}/api/health  
📋 API Info: http://localhost:${PORT}/api/info
🗃️  Database: http://localhost:${PORT}/api/test-db
📊 Prisma Studio: http://localhost:5555

🔐 Security Features:
  ✅ Rate limiting enabled
  ✅ Input sanitization active
  ✅ CORS configured
  ✅ Helmet security headers
  🔔 WebSocket notifications enabled
  📧 Email notifications ready
  🗺️  Location tracking enabled 

📝 API Endpoints:
  🌍 Public: /api/products, /api/reviews, /api/auth
  🔒 Protected: /api/user, /api/orders, /api/notifications, /api/support
  👑 Admin: /api/admin/*, /api/notifications/admin/*, /api/support/admin/*

🔔 Notification Features:
  📡 Real-time WebSocket notifications
  📧 Email notifications with templates
  ⚙️  User preferences management
  📊 Admin statistics and monitoring
  ⏰ Scheduled notifications support

🤖 AI Recommendation Features:
  🎯 Personalized user recommendations
  🔗 Similar product suggestions
  🔥 Real-time trending analysis
  🛒 Frequently bought together
  📊 Hybrid recommendation algorithms
  💪 Bulk processing capabilities

🎫 Support System Features:
  🎟️  Multi-level ticketing system
  💬 Real-time support chat with WebSocket
  📈 Escalation management
  ⏱️  SLA tracking and monitoring
  📊 Real-time analytics dashboard  
  📈 Custom reports and export     
  😊 Satisfaction surveys
  🏢 Multi-business model support
  🔄 Live metrics streaming       

⏰ Started: ${new Date().toLocaleString("it-IT")}
🌍 Environment: ${process.env.NODE_ENV || "development"}


  `);
});

// GRACEFUL SHUTDOWN
process.on("SIGINT", async () => {
  console.log("\n🛑 Graceful shutdown initiated...");

  try {
    // 🚀 CLEANUP WEBSOCKET SERVICE
    if (websocketService) {
      await websocketService.cleanup();
      console.log("✅ WebSocket service cleaned up");
    }

    if (locationTrackingService) {
      locationTrackingService.cleanup();
      console.log("✅ Location tracking service cleaned up");
    }

    await prisma.$disconnect();
    console.log("✅ Database disconnected");
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
  }

  console.log("👋 Server stopped");
  process.exit(0);
});

// HANDLE UNHANDLED REJECTIONS
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

export default app;
