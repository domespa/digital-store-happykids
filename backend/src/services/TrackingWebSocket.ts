import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { prisma } from "../utils/prisma";
import {
  generateVisitorFingerprint,
  getOrCreateVisitor,
  updateVisitorLocation,
} from "../utils/visitorFingerprint";

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

interface EventData {
  type:
    | "add_to_cart"
    | "purchase"
    | "page_view"
    | "product_view"
    | "cta_click"
    | "section_view"
    | "scroll_depth";
  productId?: string;
  orderId?: string;
  page?: string;
  pageTitle?: string;
  value?: number;
  metadata?: any;
}

class UnifiedTrackingWebSocket {
  private visitorIO: Server;
  private adminIO: Server;
  private activeVisitors = new Map<string, LocationData>();

  constructor(httpServer: HTTPServer) {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //    WebSocket VISITATORI (path: /tracking)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    this.visitorIO = new Server(httpServer, {
      path: "/tracking",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false,
      },
      transports: ["websocket", "polling"],
      pingTimeout: 30000,
      pingInterval: 10000,
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //    WebSocket ADMIN (path: /admin-tracking)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    this.adminIO = new Server(httpServer, {
      path: "/admin-tracking",
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupVisitorTracking();
    this.setupAdminTracking();

    console.log("🚀 UnifiedTrackingWebSocket initialized");
    console.log("   📍 Visitor tracking: /tracking");
    console.log("   👨‍💼 Admin tracking: /admin-tracking");
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //        TRACKING VISITATORI ANONIMI
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  private setupVisitorTracking(): void {
    this.visitorIO.on("connection", (socket: Socket) => {
      console.log(`📍 Visitor connected: ${socket.id}`);

      socket.on("send_location", async (locationData: any) => {
        try {
          console.log(`📍 Location received from ${socket.id}`);

          if (locationData.page?.startsWith("/admin")) {
            console.log("⏭️ Skipping admin page tracking");
            socket.emit("location_received", {
              success: false,
              error: "Admin pages not tracked",
            });
            return;
          }

          const ipAddress = socket.handshake.address || null;
          const userAgent = socket.handshake.headers["user-agent"] || null;
          const sessionToken = locationData.sessionToken; //

          console.log(`🔑 Session token: ${sessionToken?.slice(0, 30)}...`);

          // ✅ Generate fingerprint (with sessionToken priority)
          const fingerprint = generateVisitorFingerprint({
            ipAddress,
            userAgent,
            sessionToken,
          });

          // ✅ Get or create visitor
          const { visitorId, visitorNumber, isNew } =
            await getOrCreateVisitor(fingerprint);

          // ✅ Update visitor location
          await updateVisitorLocation(visitorId, {
            country: locationData.country,
            city: locationData.city,
            region: locationData.region,
            countryCode: locationData.countryCode,
          });

          // ✅ Create session and CONNECTED event
          await prisma.$transaction(async (tx) => {
            // 1️⃣ Create Session
            await tx.session.create({
              data: {
                sessionId: socket.id,
                visitorId,
                country: locationData.country,
                city: locationData.city,
                region: locationData.region,
                countryCode: locationData.countryCode,
                timezone: locationData.timezone,
                ipAddress,
                userAgent,
                referrer: locationData.referrer || null,
                utmSource: locationData.utm?.source || null,
                utmMedium: locationData.utm?.medium || null,
                utmCampaign: locationData.utm?.campaign || null,
                entryPage: locationData.page || "/",
                currentPage: locationData.page || "/",
                isOnline: true,
              },
            });

            // 2️⃣ Create CONNECTED event
            await tx.event.create({
              data: {
                sessionId: socket.id,
                visitorId,
                type: "CONNECTED",
                page: locationData.page || "/",
                pageTitle: locationData.pageTitle,
              },
            });
          });

          // ✅ Store in active visitors map
          const visitorData: LocationData = {
            country: locationData.country,
            city: locationData.city,
            region: locationData.region,
            countryCode: locationData.countryCode,
            timezone: locationData.timezone,
            socketId: socket.id,
            visitorId,
            visitorNumber,
            timestamp: new Date(),
          };
          this.activeVisitors.set(socket.id, visitorData);

          // ✅ Notify admins in real-time
          this.broadcastToAdmins("user_connected", {
            sessionId: socket.id,
            visitorId,
            visitorNumber,
            location: {
              country: locationData.country,
              city: locationData.city,
              region: locationData.region,
              countryCode: locationData.countryCode,
              timezone: locationData.timezone,
            },
            connectedAt: new Date().toISOString(),
          });

          console.log(
            `✅ Visitor #${visitorNumber} connected (${locationData.city}, ${locationData.country})`,
          );

          // ✅ Send success response
          socket.emit("location_received", { success: true, visitorNumber });
        } catch (error) {
          console.error("❌ Error handling location:", error);
          socket.emit("location_received", {
            success: false,
            error: "Failed to save location",
          });
        }
      });

      socket.on("track_event", async (eventData: EventData) => {
        try {
          const visitorData = this.activeVisitors.get(socket.id);
          if (!visitorData) {
            console.warn(`⚠️ Event from unknown visitor: ${socket.id}`);
            return;
          }

          let eventType: any = "PAGE_VIEW";
          switch (eventData.type) {
            case "add_to_cart":
              eventType = "ADD_TO_CART";
              break;
            case "purchase":
              eventType = "PURCHASE";
              break;
            case "product_view":
              eventType = "PRODUCT_VIEW";
              break;
            case "page_view":
              eventType = "PAGE_VIEW";
              break;
            case "cta_click":
              eventType = "CTA_CLICK";
              break;
            case "section_view":
              eventType = "SECTION_VIEW";
              break;
            case "scroll_depth":
              eventType = "SCROLL_DEPTH";
              break;
          }

          await prisma.event.create({
            data: {
              sessionId: socket.id,
              visitorId: visitorData.visitorId,
              type: eventType,
              page: eventData.page,
              pageTitle: eventData.pageTitle,
              productId: eventData.productId,
              orderId: eventData.orderId,
              value: eventData.value,
              metadata: eventData.metadata || {},
            },
          });

          await prisma.session.update({
            where: { sessionId: socket.id },
            data: {
              lastActivity: new Date(),
              currentPage: eventData.page,
            },
          });

          if (eventType === "ADD_TO_CART") {
            this.broadcastToAdmins("visitor_add_to_cart", {
              visitorNumber: visitorData.visitorNumber,
              visitorId: visitorData.visitorId,
              productId: eventData.productId,
              timestamp: new Date().toISOString(),
            });
          }

          if (eventType === "PURCHASE") {
            this.broadcastToAdmins("visitor_purchase", {
              visitorNumber: visitorData.visitorNumber,
              visitorId: visitorData.visitorId,
              orderId: eventData.orderId,
              value: eventData.value,
              timestamp: new Date().toISOString(),
            });
          }

          console.log(
            `✅ Event tracked: ${eventType} for visitor #${visitorData.visitorNumber}`,
          );

          socket.emit("event_tracked", { success: true });
        } catch (error) {
          console.error("❌ Error tracking event:", error);
        }
      });

      socket.on("disconnect", async (reason: string) => {
        const visitorData = this.activeVisitors.get(socket.id);

        if (visitorData) {
          try {
            const session = await prisma.session.findUnique({
              where: { sessionId: socket.id },
              select: { connectedAt: true },
            });

            const duration = session
              ? Math.floor((Date.now() - session.connectedAt.getTime()) / 1000)
              : 0;

            await prisma.session.update({
              where: { sessionId: socket.id },
              data: {
                disconnectedAt: new Date(),
                isOnline: false,
                duration,
              },
            });

            await prisma.visitor.update({
              where: { id: visitorData.visitorId },
              data: {
                totalTimeSpent: { increment: duration },
              },
            });

            await prisma.event.create({
              data: {
                sessionId: socket.id,
                visitorId: visitorData.visitorId,
                type: "DISCONNECTED",
                metadata: { reason, duration },
              },
            });

            this.broadcastToAdmins("user_disconnected", {
              sessionId: socket.id,
              visitorId: visitorData.visitorId,
              visitorNumber: visitorData.visitorNumber,
              disconnectReason: reason,
              duration,
              disconnectedAt: new Date().toISOString(),
            });

            console.log(
              `🔴 Visitor #${visitorData.visitorNumber} disconnected (${duration}s)`,
            );
          } catch (error) {
            console.error("❌ Error handling disconnect:", error);
          }

          this.activeVisitors.delete(socket.id);
        }
      });

      socket.on("ping", () => {
        socket.emit("pong");
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //        WEBSOCKET ADMIN (REAL-TIME UPDATES)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  private setupAdminTracking(): void {
    this.adminIO.on("connection", (socket: Socket) => {
      console.log(`👨‍💼 Admin connected: ${socket.id}`);

      socket.join("admin");

      const onlineVisitors = Array.from(this.activeVisitors.values());
      socket.emit("initial_visitors", {
        visitors: onlineVisitors.map((v) => ({
          sessionId: v.socketId,
          visitorId: v.visitorId,
          visitorNumber: v.visitorNumber,
          location: {
            country: v.country,
            city: v.city,
            region: v.region,
            countryCode: v.countryCode,
            timezone: v.timezone,
          },
          connectedAt: v.timestamp.toISOString(),
        })),
      });

      socket.on("disconnect", () => {
        console.log(`👨‍💼 Admin disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Broadcast event to all connected admins
   */
  private broadcastToAdmins(event: string, data: any): void {
    this.adminIO.to("admin").emit(event, {
      type: event,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //        UTILITY METHODS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  getOnlineVisitors(): LocationData[] {
    return Array.from(this.activeVisitors.values());
  }

  getOnlineCount(): number {
    return this.activeVisitors.size;
  }

  async cleanup(): Promise<void> {
    const activeSessions = Array.from(this.activeVisitors.keys());

    await prisma.session.updateMany({
      where: {
        sessionId: { in: activeSessions },
        isOnline: true,
      },
      data: {
        isOnline: false,
        disconnectedAt: new Date(),
      },
    });

    this.activeVisitors.clear();
    this.visitorIO.close();
    this.adminIO.close();

    console.log("🧹 UnifiedTrackingWebSocket cleanup complete");
  }
}

export default UnifiedTrackingWebSocket;
