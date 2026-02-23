import { io, Socket } from "socket.io-client";

interface LocationData {
  country: string;
  city: string;
  region: string;
  countryCode: string;
  timezone: string;
  detectionMethod?: "ip" | "fallback";
  precisionLevel?: "country" | "city";
}

class LocationWebSocketService {
  private socket: Socket | null = null;
  private locationData: LocationData | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor() {
    console.log("🗺️ LocationWebSocketService initialized (IP-only mode)");
  }

  connect() {
    if (this.isConnected && this.socket?.connected) {
      console.log("✅ Already connected to location tracking");
      return;
    }

    try {
      const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
      const BASE_URL = API_URL.replace(/\/api$/, "");
      const LOCATION_PATH = "/location";

      console.log(
        "🔌 Connecting to location WebSocket:",
        `${BASE_URL}${LOCATION_PATH}`,
      );

      this.socket = io(BASE_URL, {
        path: LOCATION_PATH,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 10000,
        autoConnect: true,
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error("❌ Error connecting to location WebSocket:", error);
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log(
        "✅ Connected to location tracking WebSocket:",
        this.socket?.id,
      );
      this.isConnected = true;
      this.reconnectAttempts = 0;

      if (this.locationData) {
        console.log("📍 Sending IP-based location data:", {
          country: this.locationData.country,
          city: this.locationData.city,
          method: this.locationData.detectionMethod || "ip",
        });

        this.socket?.emit("send_location", this.locationData);
      }
    });

    this.socket.on("location_received", (response: any) => {
      if (response.success) {
        console.log("✅ Location data received by server (IP-only)");
      } else {
        console.error("❌ Failed to send location:", response.error);
      }
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("🔌 Disconnected from location tracking:", reason);
      this.isConnected = false;

      if (reason === "io server disconnect") {
        console.log("🔄 Server disconnected, attempting reconnect...");
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("❌ Location WebSocket connection error:", error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(
          "❌ Max reconnection attempts reached for location tracking",
        );
      }
    });

    this.socket.on("pong", () => {
      console.log("🏓 Pong received from location server");
    });
  }

  setLocationData(data: LocationData) {
    console.log("📍 Setting location data (IP-only):", {
      country: data.country,
      city: data.city,
      method: data.detectionMethod || "ip",
      precision: data.precisionLevel || "city",
    });

    if ("latitude" in data || "longitude" in data) {
      console.warn(
        "⚠️ WARNING: GPS coordinates detected and removed for GDPR compliance",
      );
      const { latitude, longitude, ...cleanData } = data as any;
      this.locationData = cleanData;
    } else {
      this.locationData = data;
    }

    if (this.isConnected && this.socket?.connected) {
      console.log("📤 Sending location data immediately (IP-only)");
      this.socket.emit("send_location", this.locationData);
    } else {
      console.log("⏳ Will send location data when connected");
    }
  }

  sendActivity(
    page: string,
    action: string = "page_view",
    target?: string,
    data?: Record<string, any>,
  ) {
    if (this.isConnected && this.socket) {
      this.socket.emit("user_activity", {
        page,
        action,
        target,
        data,
        timestamp: new Date().toISOString(),
      });
      console.log(
        `📊 Activity sent: ${page} (${action})${target ? ` [${target}]` : ""}`,
      );
    }
  }

  ping() {
    if (this.isConnected && this.socket) {
      this.socket.emit("ping");
    }
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting from location tracking");
      this.socket.disconnect();
      this.isConnected = false;
      this.locationData = null;
    }
  }

  isConnectedToTracking(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

const locationWebSocketService = new LocationWebSocketService();
export default locationWebSocketService;
