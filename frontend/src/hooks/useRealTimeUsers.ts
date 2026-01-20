import { useState, useEffect, useRef, useCallback } from "react";
import { adminUsers, adminWebSocket } from "../services/adminApi";
import type { OnlineUser } from "../types/admin";

interface WebSocketMessage {
  type: "user_count" | "notification" | "unread_count" | "system";
  count?: number;
  data?: any;
}

interface UserTrackingMessage {
  type:
    | "user_connected"
    | "user_disconnected"
    | "user_activity"
    | "session_ended";
  user?: OnlineUser;
  sessionId?: string;
  page?: string;
  timestamp?: string;
  endTime?: string;
}

type AnyWebSocketMessage = WebSocketMessage | UserTrackingMessage;

export function useRealTimeUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isRefreshingRef = useRef(false);

  const refreshData = useCallback(async () => {
    if (isRefreshingRef.current) {
      console.log("⏭️ Skipping refresh - already in progress");
      return;
    }

    try {
      isRefreshingRef.current = true;
      setLoading(true);

      const users = await adminUsers.getOnline();
      console.log("📊 Refreshed users:", users?.length || 0);

      setOnlineUsers(users || []);
      setError(null);
    } catch (err) {
      console.error("❌ Refresh failed:", err);
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  const handleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error("❌ Max reconnect attempts reached");
      setError("Connection failed. Please refresh the page.");
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.min(
      1000 * Math.pow(2, reconnectAttemptsRef.current),
      10000,
    );

    console.log(
      `🔄 Scheduling reconnect attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`,
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`🔄 Attempting reconnect #${reconnectAttemptsRef.current}`);
      if (wsRef.current && typeof wsRef.current.connect === "function") {
        wsRef.current.connect();
      }
    }, delay);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      try {
        console.log("📊 Initial data load...");
        const users = await adminUsers.getOnline();
        if (mounted) {
          setOnlineUsers(users || []);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error("❌ Initial load failed:", err);
        if (mounted) {
          setError("Failed to load initial data");
          setLoading(false);
        }
      }
    };

    initialLoad();

    const setupWebSocket = () => {
      try {
        console.log("🔧 Setting up WebSocket connection...");

        wsRef.current = adminWebSocket.connect((data: AnyWebSocketMessage) => {
          if (!mounted) return;

          console.log("🔌 WebSocket message received:", data);

          if ("type" in data) {
            switch (data.type) {
              case "user_connected":
                if (data.user) {
                  setOnlineUsers((prev: OnlineUser[]) => {
                    const filtered = prev.filter(
                      (u) => u.sessionId !== data.user?.sessionId,
                    );
                    const newUser = data.user as OnlineUser;
                    console.log("➕ User connected:", newUser.sessionId);
                    const updated = [...filtered, newUser];
                    console.log(`📊 Total users after add: ${updated.length}`);
                    return updated;
                  });
                }
                break;

              case "user_disconnected":
                if (data.sessionId) {
                  console.log("➖ User disconnected:", data.sessionId);
                  setOnlineUsers((prev: OnlineUser[]) => {
                    const remaining = prev.filter(
                      (u) => u.sessionId !== data.sessionId,
                    );
                    console.log(`📊 Remaining users: ${remaining.length}`);
                    return remaining;
                  });
                }
                break;

              case "user_activity":
                if (data.sessionId) {
                  console.log("🔄 User activity:", data.sessionId, data.page);
                  setOnlineUsers((prev: OnlineUser[]) =>
                    prev.map((user) =>
                      user.sessionId === data.sessionId
                        ? {
                            ...user,
                            currentPage: data.page || user.currentPage,
                            lastActivity:
                              data.timestamp || new Date().toISOString(),
                          }
                        : user,
                    ),
                  );
                }
                break;

              case "user_count":
                if (typeof data.count === "number") {
                  const count = data.count;
                  console.log("👥 User count update:", count);
                  setOnlineUsers((prev) => {
                    if (Math.abs(prev.length - count) > 0) {
                      console.log("⚠️ Count mismatch, triggering refresh...");
                      setTimeout(() => {
                        refreshData();
                      }, 0);
                    }
                    return prev;
                  });
                }
                break;

              default:
                console.log("ℹ️ Unhandled message type:", data.type);
            }
          }
        });

        if (!wsRef.current) {
          console.error("❌ Failed to create WebSocket connection");
          setError("Failed to create WebSocket connection");
          return;
        }

        console.log("✅ WebSocket object created:", typeof wsRef.current);

        // Event: connect
        wsRef.current.on("connect", () => {
          if (!mounted) return;
          console.log("✅ Connected to WebSocket");
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;
        });

        // Event: disconnect
        wsRef.current.on("disconnect", (reason: string) => {
          if (!mounted) return;
          console.log("⚠️ Disconnected from WebSocket. Reason:", reason);
          setIsConnected(false);

          if (reason === "io server disconnect") {
            console.log("🔄 Server disconnected us, attempting reconnect...");
            handleReconnect();
          } else if (
            reason === "transport close" ||
            reason === "transport error"
          ) {
            console.log("🔄 Transport issue, attempting reconnect...");
            handleReconnect();
          }
        });

        // Event: reconnect
        wsRef.current.on("reconnect", (attemptNumber: number) => {
          if (!mounted) return;
          console.log(`✅ Reconnected after ${attemptNumber} attempts`);
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;
          refreshData(); // Solo dopo reconnect
        });

        // Event: reconnect_attempt
        wsRef.current.on("reconnect_attempt", (attemptNumber: number) => {
          if (!mounted) return;
          console.log(`🔄 Reconnect attempt ${attemptNumber}...`);
        });

        // Event: reconnect_error
        wsRef.current.on("reconnect_error", (error: any) => {
          if (!mounted) return;
          console.error("❌ Reconnect error:", error);
        });

        // Event: reconnect_failed
        wsRef.current.on("reconnect_failed", () => {
          if (!mounted) return;
          console.error("❌ Reconnection failed after all attempts");
          setError("Connection lost. Please refresh the page.");
          setIsConnected(false);
        });

        // Event: error
        wsRef.current.on("error", (error: any) => {
          if (!mounted) return;
          console.error("❌ WebSocket error:", error);
          setError("WebSocket connection error");
        });

        // Event: connect_error
        wsRef.current.on("connect_error", (error: any) => {
          if (!mounted) return;
          console.error("❌ Connection error:", error);
          setError(`Connection error: ${error.message || "Unknown error"}`);
          handleReconnect();
        });
      } catch (error) {
        console.error("❌ Failed to setup WebSocket:", error);
        setError("Failed to setup WebSocket connection");
        setIsConnected(false);
      }
    };

    setupWebSocket();

    return () => {
      mounted = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        console.log("🧹 Cleaning up WebSocket connection");
        try {
          wsRef.current.removeAllListeners();
          wsRef.current.close();
        } catch (e) {
          console.error("Error during cleanup:", e);
        }
        wsRef.current = null;
      }
    };
  }, []);

  return {
    onlineUsers,
    loading,
    error,
    isConnected,
    totalOnline: onlineUsers.length,
    isWebSocketConnected: () => isConnected,
    refreshData,
    getOnlineUsersByCountry: (country: string) =>
      onlineUsers.filter((user) => user.location?.country === country),
  };
}
