import axios from "axios";
import type {
  OrderListResponse,
  OrderFilters,
  AdminOrderResponse,
  UpdateOrderStatusRequest,
  OnlineUser,
  UserSession,
  DashboardStats,
  ProductListResponse,
  ProductMutationResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
} from "../types/admin";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { ProductImage } from "../types/admin";

const API_BASE_URL =
  import.meta.env.VITE_API_URL + "/api" || "http://localhost:3001/api";

// Environment-aware logging
const isDev = import.meta.env.DEV;
const devLog = (...args: any[]) => {
  if (isDev) console.log(...args);
};

// ========================
//   WEBSOCKET TYPES
// ========================
interface WebSocketMessage {
  type: "user_count" | "notification" | "unread_count" | "system";
  count?: number;
  data?: unknown;
}

interface NotificationData {
  id: string;
  title: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  timestamp: string;
}

interface SystemMessage {
  message: string;
  level: "info" | "warning" | "error";
  timestamp: string;
}

interface ConnectionEstablished {
  message: string;
  unreadCount: number;
}

interface UnreadCountUpdate {
  count: number;
}

export interface RecentActivity {
  id: string;
  type: "order";
  message: string;
  timestamp: string;
  metadata: {
    orderId: string;
    status: string;
    total: number;
    currency: string;
    items: number;
    customerName: string;
  };
}

// ========================
//   ANALYTICS TYPES
// ========================
interface PeriodDataPoint {
  period: string;
  orders: number;
  revenue: number;
  timestamp: string;
}

interface PeriodDataResponse {
  success: boolean;
  data: Array<{
    period: string;
    orders: number;
    revenue: number;
    timestamp: string;
  }>;
  previousData?: Array<{
    period: string;
    orders: number;
    revenue: number;
    timestamp: string;
  }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    pendingOrders: number;
    conversionRate: number;
    averageOrderValue: number;
    peakPeriod: {
      period: string;
      orders: number;
      revenue: number;
    };
  };
}

// ========================
//   SETUP AXIOS ADMIN
// ========================
const adminApiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR PER TOKEN ADMIN
adminApiInstance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

// Interceptor per gestione errori consistente
adminApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout su 401 (token scaduto/invalido)
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      // Redirect solo se non siamo già sulla pagina di login
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// ========================
//   ADMIN API FUNCTIONS
// ========================

// ORDERS MANAGEMENT
export const adminOrders = {
  getAll: async (filters: OrderFilters = {}): Promise<OrderListResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await adminApiInstance.get(
      `/admin/orders?${params.toString()}`
    );
    return response.data;
  },

  getById: async (
    orderId: string
  ): Promise<{ success: boolean; order: AdminOrderResponse }> => {
    const response = await adminApiInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  updateStatus: async (
    orderId: string,
    updateData: UpdateOrderStatusRequest
  ): Promise<{ success: boolean; order: AdminOrderResponse }> => {
    const response = await adminApiInstance.put(
      `/admin/orders/${orderId}/status`,
      updateData
    );
    return response.data;
  },

  resendEmail: async (
    orderId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await adminApiInstance.post(
      `/admin/orders/${orderId}/resend-email`
    );
    return response.data;
  },
};

// DASHBOARD & ANALYTICS
export const adminDashboard = {
  getStats: async (): Promise<DashboardStats> => {
    const [dashboardResponse, realtimeResponse] = await Promise.all([
      adminApiInstance.get("/admin/analytics/dashboard"),
      adminApiInstance.get("/admin/analytics/realtime"),
    ]);

    const metrics = dashboardResponse.data.data.metrics;
    const realtime = realtimeResponse.data.data.realTime;

    return {
      totalOrders: metrics.sales.orders.total || 0,
      pendingOrders: realtime.pendingOrders || 0,
      todayOrders: realtime.todayOrders || 0,
      totalRevenue: metrics.sales.revenue.total || 0,
      conversionRate: metrics.overview.conversionRate.current || 0,
      averageOrderValue: metrics.sales.revenue.average?.perOrder || 0,
      topCountries: metrics.users?.countries || [],
      recentActivity: metrics.users?.userActivity || [],
      onlineUsers: realtime?.activeUsers || 0,
    };
  },

  getOverview: async (period: string = "week"): Promise<any> => {
    const response = await adminApiInstance.get(
      `/admin/analytics/overview?period=${period}`
    );
    return response.data.data;
  },

  getRealtime: async (): Promise<any> => {
    const response = await adminApiInstance.get("/admin/analytics/realtime");
    return response.data.data;
  },

  getRecentActivity: async (
    limit: number = 15,
    options?: { signal?: AbortSignal }
  ): Promise<{
    success: boolean;
    activities: RecentActivity[];
    summary: {
      total: number;
      byStatus: {
        completed: number;
        paid: number;
        pending: number;
        failed: number;
        refunded: number;
      };
    };
  }> => {
    const response = await adminApiInstance.get(
      `/admin/dashboard/recent-activity?limit=${limit}`,
      options?.signal ? { signal: options.signal } : undefined
    );
    return response.data;
  },
};

// REAL-TIME USERS
export const adminUsers = {
  getOnline: async (): Promise<OnlineUser[]> => {
    const response = await adminApiInstance.get("/admin/users/online");
    return response.data.users || [];
  },

  getSessions: async (filters: any = {}): Promise<UserSession[]> => {
    const params = new URLSearchParams(filters);
    const response = await adminApiInstance.get(
      `/admin/users/sessions?${params.toString()}`
    );
    return response.data.sessions || [];
  },
};

// WEBSOCKET CONNECTION
export const adminWebSocket = {
  connect: (onMessage: (data: WebSocketMessage) => void): Socket => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      throw new Error("Admin token required");
    }

    const WS_URL =
      import.meta.env.VITE_API_URL?.replace("https://", "wss://").replace(
        "http://",
        "ws://"
      ) || "http://localhost:3001";

    console.log("🔌 Creating WebSocket connection to:", WS_URL);

    const socket = io(WS_URL, {
      auth: {
        token: adminToken,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,

      // Configurazione reconnect robusta
      reconnection: true, // Abilita reconnect automatica
      reconnectionAttempts: 10, // Numero massimo di tentativi
      reconnectionDelay: 1000, // Delay iniziale (1 secondo)
      reconnectionDelayMax: 5000, // Delay massimo (5 secondi)
      randomizationFactor: 0.5, // Randomizzazione per evitare thundering herd

      // Timeout configurati per evitare disconnessioni premature
      timeout: 20000, // Timeout connessione iniziale

      // Configurazione upgrade
      upgrade: true, // Prova ad upgradare da polling a websocket
      rememberUpgrade: true, // Ricorda l'upgrade per le prossime connessioni

      // Query params per debug
      query: {
        type: "admin-dashboard",
      },
    });

    socket.on("connect", () => {
      console.log("✅ Admin WebSocket connected");
      console.log("   Socket ID:", socket.id);
      console.log("   Transport:", socket.io.engine.transport.name);

      // Richiedi conteggio utenti online al connect
      socket.emit("get_online_users");
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Admin WebSocket disconnected. Reason:", reason);
      console.log("   Will attempt to reconnect:", socket.io.opts.reconnection);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
      console.log("   Reconnection attempt:", socket.io.reconnectionAttempts());
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      // Richiedi di nuovo i dati dopo reconnect
      socket.emit("get_online_users");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after all attempts");
      console.log("Please refresh the page to reconnect");
    });

    // Ascolta TUTTI i tipi di messaggi dal backend
    socket.on("notification", (data: NotificationData) => {
      devLog("📬 Notification received:", data);
      onMessage({ type: "notification", data });
    });

    socket.on("system", (data: SystemMessage) => {
      devLog("🔔 System message:", data);
      onMessage({ type: "system", data });
    });

    socket.on("connection_established", (data: ConnectionEstablished) => {
      devLog("✅ Connection established:", data);
    });

    socket.on("unread_count_updated", (data: UnreadCountUpdate) => {
      devLog("📊 Unread count updated:", data.count);
      onMessage({ type: "unread_count", count: data.count });
    });

    socket.on("user_count", (data: { count: number }) => {
      devLog("👥 User count:", data.count);
      onMessage({ type: "user_count", count: data.count });
    });

    //  Eventi per tracking utenti in tempo reale
    socket.on("user_connected", (data: any) => {
      console.log("➕ User connected event:", data);
      onMessage({ type: "user_connected" as any, ...data });
    });

    socket.on("user_disconnected", (data: any) => {
      console.log("➖ User disconnected event:", data);
      onMessage({ type: "user_disconnected" as any, ...data });
    });

    socket.on("user_activity", (data: any) => {
      console.log("🔄 User activity event:", data);
      onMessage({ type: "user_activity" as any, ...data });
    });

    // Ping/pong per mantenere connessione viva
    setInterval(() => {
      if (socket.connected) {
        console.log("💓 Sending keepalive ping");
        socket.emit("ping");
      }
    }, 25000); // Ogni 25 secondi

    socket.on("pong", () => {
      console.log("💓 Keepalive pong received");
    });

    // Log upgrade del trasporto
    socket.io.engine.on("upgrade", (transport: any) => {
      console.log("⬆️ Transport upgraded to:", transport.name);
    });

    return socket;
  },
};

// ADMIN AUTH
export const adminAuth = {
  login: async (email: string, password: string) => {
    const response = await adminApiInstance.post("/auth/login", {
      email,
      password,
    });

    if (response.data.user?.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("adminToken");
  },

  getProfile: async () => {
    const response = await adminApiInstance.get("/auth/me");
    return response.data;
  },
};

// PRODUCTS MANAGEMENT
export const adminProducts = {
  getAll: async (
    filters: ProductFilters = {}
  ): Promise<ProductListResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    const response = await adminApiInstance.get(
      `/admin/products?${params.toString()}`
    );
    return response.data;
  },

  create: async (
    productData: CreateProductRequest
  ): Promise<ProductMutationResponse> => {
    const response = await adminApiInstance.post(
      "/admin/products",
      productData
    );
    return response.data;
  },

  update: async (
    productId: string,
    productData: UpdateProductRequest
  ): Promise<ProductMutationResponse> => {
    const response = await adminApiInstance.put(
      `/admin/products/${productId}`,
      productData
    );
    return response.data;
  },

  delete: async (productId: string): Promise<ProductMutationResponse> => {
    const response = await adminApiInstance.delete(
      `/admin/products/${productId}`
    );
    return response.data;
  },

  getImages: async (
    productId: string
  ): Promise<{
    success: boolean;
    message: string;
    images: ProductImage[];
    total: number;
  }> => {
    const response = await adminApiInstance.get(
      `/admin/products/${productId}/images`
    );
    return response.data;
  },

  uploadImages: async (
    productId: string,
    files: File[]
  ): Promise<{
    success: boolean;
    message: string;
    images: ProductImage[];
  }> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await adminApiInstance.post(
      `/admin/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteImage: async (
    productId: string,
    imageId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await adminApiInstance.delete(
      `/admin/products/${productId}/images/${imageId}`
    );
    return response.data;
  },

  setFeaturedImage: async (
    productId: string,
    imageId: string
  ): Promise<{
    success: boolean;
    message: string;
    image: ProductImage;
  }> => {
    const response = await adminApiInstance.patch(
      `/admin/products/${productId}/images/${imageId}/featured`
    );
    return response.data;
  },

  uploadEbook: async (
    productId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{
    success: boolean;
    message: string;
    product: {
      id: string;
      name: string;
      filePath: string;
      fileName: string;
      isDigital: boolean;
    };
    publicId: string;
    testDownloadLink: string;
    uploadedAt: string;
    uploadedBy: string;
  }> => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      throw new Error("Not authenticated - admin token not found");
    }

    const formData = new FormData();
    formData.append("ebook", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (err) {
            reject(new Error("Invalid response from server"));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(
              new Error(
                error.message || `Upload failed with status ${xhr.status}`
              )
            );
          } catch (err) {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      xhr.open(
        "POST",
        `${API_BASE_URL}/admin/products/${productId}/upload-ebook`
      );
      xhr.setRequestHeader("Authorization", `Bearer ${adminToken}`);
      xhr.send(formData);
    });
  },
};

// ========================
//   ANALYTICS API (REAL)
// ========================
export const adminAnalytics = {
  getPeriodData: async (filters: {
    period: "today" | "week" | "month" | "year" | "total";
    from?: string;
    to?: string;
  }): Promise<PeriodDataResponse> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      devLog(
        "🔄 Calling API:",
        `/admin/analytics/period-data?${params.toString()}`
      );

      const response = await adminApiInstance.get(
        `/admin/analytics/period-data?${params.toString()}`
      );

      devLog("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error calling period-data API:", error);
      throw error;
    }
  },

  getDashboard: async (period: string = "week") => {
    const response = await adminApiInstance.get(
      `/admin/analytics/dashboard?period=${period}`
    );
    return response.data;
  },

  getSales: async (period: string = "week") => {
    const response = await adminApiInstance.get(
      `/admin/analytics/sales?period=${period}`
    );
    return response.data;
  },

  getOverview: async (period: string = "week") => {
    const response = await adminApiInstance.get(
      `/admin/analytics/overview?period=${period}`
    );
    return response.data;
  },

  getRealtime: async () => {
    const response = await adminApiInstance.get("/admin/analytics/realtime");
    return response.data;
  },

  getInsights: async (period: string = "week") => {
    const response = await adminApiInstance.get(
      `/admin/analytics/insights?period=${period}`
    );
    return response.data;
  },

  getTopProducts: async (period: string = "week", limit: number = 10) => {
    const response = await adminApiInstance.get(
      `/admin/analytics/top-products?period=${period}&limit=${limit}`
    );
    return response.data;
  },

  comparePeriods: async (
    currentPeriod: string,
    previousPeriod: string,
    metric: string
  ) => {
    const response = await adminApiInstance.get(
      `/admin/analytics/compare?currentPeriod=${currentPeriod}&previousPeriod=${previousPeriod}&metric=${metric}`
    );
    return response.data;
  },

  refreshDashboard: async (
    period: string = "week"
  ): Promise<{
    stats: DashboardStats;
    periodData: PeriodDataPoint[];
    insights: any;
  }> => {
    try {
      const [statsResponse, periodResponse, insightsResponse] =
        await Promise.all([
          adminDashboard.getStats(),
          adminAnalytics.getPeriodData({ period: period as any }),
          adminAnalytics.getInsights(period).catch(() => null),
        ]);

      return {
        stats: statsResponse,
        periodData: periodResponse.data,
        insights: insightsResponse?.data || null,
      };
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      throw error;
    }
  },

  getTotalVisits: async (): Promise<number> => {
    try {
      const response = await adminApiInstance.get(
        "/admin/analytics/total-visits"
      );
      return response.data.totalVisits || 0;
    } catch (error) {
      console.error("Error fetching total visits:", error);
      return 0;
    }
  },

  clearAnalyticsCache: async (): Promise<{ success: boolean }> => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "https://api.shethrivesadhd.com/api/admin/analytics/clear-cache",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear cache");
      }

      return response.json();
    } catch (error) {
      console.error("Error clearing cache:", error);
      // Non bloccare il refresh se fallisce
      return { success: false };
    }
  },
};

// ========================
//   UTILITY FUNCTIONS
// ========================
export function convertTimePeriodToApiPeriod(
  timePeriod: string
): "today" | "week" | "month" | "year" | "total" {
  switch (timePeriod.toLowerCase()) {
    case "oggi":
    case "today":
      return "today";
    case "settimana":
    case "week":
      return "week";
    case "mese":
    case "month":
      return "month";
    case "anno":
    case "year":
      return "year";
    case "totale":
    case "total":
      return "total";
    default:
      return "week";
  }
}

// ========================
//   MAIN ADMIN API OBJECT
// ========================
export const adminApi = {
  getOrders: adminOrders.getAll,
  getOrderById: adminOrders.getById,
  updateOrderStatus: adminOrders.updateStatus,
  getDashboardStats: adminDashboard.getStats,
  getOverview: adminDashboard.getOverview,
  getRealtime: adminDashboard.getRealtime,
  getOnlineUsers: adminUsers.getOnline,
  getUserSessions: adminUsers.getSessions,
  connectWebSocket: adminWebSocket.connect,
  getProducts: adminProducts.getAll,
  createProduct: adminProducts.create,
  updateProduct: adminProducts.update,
  deleteProduct: adminProducts.delete,
  analytics: adminAnalytics,
  getPeriodData: adminAnalytics.getPeriodData,
  refreshDashboard: adminAnalytics.refreshDashboard,
  login: adminAuth.login,
  logout: adminAuth.logout,
  getProfile: adminAuth.getProfile,
  convertTimePeriod: convertTimePeriodToApiPeriod,
  getRecentActivity: adminDashboard.getRecentActivity,
  clearAnalyticsCache: adminAnalytics.clearAnalyticsCache,
};

export default adminApi;
