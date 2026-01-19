import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { prisma } from "../utils/prisma";

interface LocationData {
  country: string;
  city: string;
  region: string;
  countryCode: string;
  timezone: string;
  detectionMethod?: "ip" | "fallback";
  precisionLevel?: "country" | "city";
  timestamp: Date;
  socketId: string;
}

class LocationTrackingWebSocket {
  private io: Server;
  private userLocations = new Map<string, LocationData>();
  private mainWebSocketService: any;

  constructor(
    httpServer: HTTPServer,
    mainWebSocketService?: any,
    path: string = "/location",
  ) {
    this.io = new Server(httpServer, {
      path,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false,
      },
      transports: ["websocket", "polling"],
      pingTimeout: 30000,
      pingInterval: 10000,
    });

    this.setupEventHandlers();

    // Usa il parametro se fornito, altrimenti fallback a globalThis
    this.mainWebSocketService =
      mainWebSocketService || (globalThis as any).webSocketService;

    console.log("🗺️ LocationTrackingWebSocket initialized");
    console.log(
      "🔗 Main WebSocket service available:",
      !!this.mainWebSocketService,
    );

    // Log aggiuntivo per debug
    if (!this.mainWebSocketService) {
      console.error("❌ CRITICAL: Main WebSocket service is NOT available!");
      console.error(
        "   This means user connections will NOT be broadcasted to admins!",
      );
    } else {
      console.log("✅ Main WebSocket service is properly connected");
    }
  }

  private broadcastToAdmins(event: string, data: any) {
    if (!this.mainWebSocketService) {
      console.warn(
        `⚠️ Cannot broadcast ${event} - main WebSocket not available`,
      );
      return;
    }

    try {
      // Metodo 1: Usa broadcastToAdmins se disponibile
      if (typeof this.mainWebSocketService.broadcastToAdmins === "function") {
        this.mainWebSocketService.broadcastToAdmins(event, data);
        console.log(
          `✅ Broadcasted ${event} to admins via broadcastToAdmins()`,
        );
      }
      // Metodo 2: Fallback a emit diretto
      else if (this.mainWebSocketService.io) {
        this.mainWebSocketService.io.emit(event, {
          type: event,
          ...data,
          timestamp: new Date().toISOString(),
        });
        console.log(`✅ Broadcasted ${event} to admins via io.emit()`);
      } else {
        console.error(`❌ No broadcast method available for ${event}`);
      }
    } catch (error) {
      console.error(`❌ Error broadcasting ${event}:`, error);
    }
  }

  private setupEventHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(`📍 Location tracking client connected: ${socket.id}`);

      socket.on("send_location", async (locationData: any) => {
        try {
          console.log(`📍 Location received from ${socket.id}:`, {
            country: locationData.country,
            city: locationData.city,
          });

          const storedData: LocationData = {
            country: locationData.country,
            city: locationData.city,
            region: locationData.region,
            countryCode: locationData.countryCode,
            timezone: locationData.timezone,
            detectionMethod: locationData.detectionMethod || "ip",
            precisionLevel: locationData.precisionLevel || "city",
            timestamp: new Date(),
            socketId: socket.id,
          };

          this.userLocations.set(socket.id, storedData);

          try {
            await prisma.pageView.upsert({
              where: {
                sessionId: socket.id,
              },
              update: {
                createdAt: new Date(),
                disconnectedAt: null,
              },
              create: {
                page: "homepage",
                sessionId: socket.id,
                userAgent: socket.handshake.headers["user-agent"] || null,
                ipAddress: socket.handshake.address || null,
                country: locationData.country || null,
                city: locationData.city || null,
              },
            });
            console.log(`✅ Visit upserted for ${socket.id}`);

            // ✅ BROADCAST IMMEDIATO AGLI ADMIN
            this.broadcastToAdmins("user_connected", {
              sessionId: socket.id,
              location: {
                country: storedData.country,
                city: storedData.city,
                region: storedData.region,
              },
              connectedAt: storedData.timestamp.toISOString(),
            });
          } catch (dbError) {
            console.error("❌ Failed to save visit to database:", dbError);
          }

          socket.emit("location_received", { success: true });
        } catch (error) {
          console.error("❌ Error handling location:", error);
          socket.emit("location_received", {
            success: false,
            error: "Failed to save location",
          });
        }
      });

      // ✅ DISCONNECT CON BROADCAST IMMEDIATO
      socket.on("disconnect", async (reason: string) => {
        const location = this.userLocations.get(socket.id);

        if (location) {
          console.log(
            `🔄 User disconnecting - ${socket.id}: ${location.city}, ${location.country}`,
          );

          try {
            const updated = await prisma.pageView.updateMany({
              where: {
                sessionId: socket.id,
                disconnectedAt: null,
              },
              data: {
                disconnectedAt: new Date(),
              },
            });

            if (updated.count > 0) {
              console.log(`✅ Updated disconnectedAt for session ${socket.id}`);

              // ✅ BROADCAST IMMEDIATO AGLI ADMIN
              this.broadcastToAdmins("user_disconnected", {
                sessionId: socket.id,
                disconnectReason: reason,
                disconnectedAt: new Date().toISOString(),
                location: {
                  country: location.country,
                  city: location.city,
                },
              });
            } else {
              console.warn(`⚠️ No pageView found to update for ${socket.id}`);
            }
          } catch (dbError) {
            console.error("❌ Failed to update disconnectedAt:", dbError);
          }

          this.userLocations.delete(socket.id);
          console.log(`🗺️ Remaining locations: ${this.userLocations.size}`);
        }

        console.log(
          `📍 Location tracking client disconnected: ${socket.id}, reason: ${reason}`,
        );
      });

      // USER ACTIVITY
      socket.on("user_activity", (data: any) => {
        const locationData = this.userLocations.get(socket.id);

        if (locationData) {
          // Aggiorna il timestamp dell'attività
          locationData.timestamp = new Date();
          this.userLocations.set(socket.id, locationData);

          // Notifica gli admin dell'attività
          this.broadcastToAdmins("user_activity", {
            sessionId: socket.id,
            page: data.page || "unknown",
            timestamp: new Date().toISOString(),
            action: data.action || "page_view",
          });
        } else {
          console.warn(`⚠️ Activity received for unknown user: ${socket.id}`);
        }
      });

      // PING/PONG
      socket.on("ping", () => {
        socket.emit("pong");

        const locationData = this.userLocations.get(socket.id);
        if (locationData) {
          locationData.timestamp = new Date();
          this.userLocations.set(socket.id, locationData);
        }
      });

      // ERRORI
      socket.on("error", (error: Error) => {
        console.error(`❌ Socket error for ${socket.id}:`, error);
      });
    });

    // Log delle connessioni al server Socket.IO
    this.io.engine.on("connection_error", (err: any) => {
      console.error("❌ Socket.IO connection error:", err);
    });
  }

  getOnlineUserLocations(): LocationData[] {
    const locations = Array.from(this.userLocations.values());
    console.log(
      `🔍 getOnlineUserLocations - returning ${locations.length} locations`,
    );
    return locations;
  }

  getUserLocation(socketId: string): LocationData | null {
    const location = this.userLocations.get(socketId) || null;
    console.log(
      `🔍 getUserLocation for ${socketId}:`,
      location ? `${location.city}, ${location.country}` : "NOT FOUND",
    );
    return location;
  }

  getLocationStats() {
    const locations = Array.from(this.userLocations.values());
    const countries = new Set(locations.map((l) => l.country));
    const cities = new Set(locations.map((l) => `${l.city}, ${l.country}`));

    const stats = {
      totalOnlineUsers: locations.length,
      uniqueCountries: countries.size,
      uniqueCities: cities.size,
      countries: Array.from(countries),
      cities: Array.from(cities),
      locationsByCountry: this.aggregateByCountry(locations),
      lastUpdate: new Date(),
    };

    console.log(`📊 Location stats:`, {
      totalOnlineUsers: stats.totalOnlineUsers,
      uniqueCountries: stats.uniqueCountries,
      uniqueCities: stats.uniqueCities,
    });

    return stats;
  }

  private aggregateByCountry(locations: LocationData[]) {
    const byCountry = new Map<string, number>();

    locations.forEach((loc) => {
      const count = byCountry.get(loc.country) || 0;
      byCountry.set(loc.country, count + 1);
    });

    return Array.from(byCountry.entries()).map(([country, count]) => ({
      country,
      userCount: count,
    }));
  }

  testAdminNotification() {
    if (this.mainWebSocketService) {
      const testData = {
        message: "Location tracking system test",
        timestamp: new Date().toISOString(),
        connectedUsers: this.userLocations.size,
      };

      this.broadcastToAdmins("system", testData);
      console.log("📡 Admin notification test sent");
      return true;
    }
    console.log(
      "❌ Cannot send admin notification - main service not available",
    );
    return false;
  }

  cleanup(): void {
    if (this.mainWebSocketService) {
      const shutdownData = {
        message: "Location tracking system shutting down",
        timestamp: new Date().toISOString(),
      };

      this.broadcastToAdmins("system", shutdownData);
    }

    console.log(
      "🧹 LocationTrackingWebSocket cleanup - clearing",
      this.userLocations.size,
      "locations",
    );
    this.userLocations.clear();
    this.io.close();
  }

  getConnectedCount(): number {
    return this.userLocations.size;
  }

  isMainWebSocketAvailable(): boolean {
    return !!this.mainWebSocketService;
  }

  // Metodo per forzare il sync con gli admin
  forceAdminSync(): void {
    if (!this.mainWebSocketService) {
      console.warn("⚠️ Cannot sync - main WebSocket service not available");
      return;
    }

    console.log(`🔄 Force syncing ${this.userLocations.size} users to admins`);

    const allUsers = Array.from(this.userLocations.entries()).map(
      ([socketId, location]) => ({
        sessionId: socketId,
        location: {
          country: location.country,
          city: location.city,
          region: location.region,
          countryCode: location.countryCode,
          timezone: location.timezone,
        },
        connectedAt: location.timestamp.toISOString(),
        lastActivity: location.timestamp.toISOString(),
      }),
    );

    this.broadcastToAdmins("user_count", {
      count: allUsers.length,
      users: allUsers,
    });

    console.log("✅ Admin sync completed");
  }
}

export default LocationTrackingWebSocket;
