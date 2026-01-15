import { useState, useEffect } from "react";
import { adminApi } from "../services/adminApi";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { ThemeToggle } from "../components/common/ThemeToggle";
import type { Socket } from "socket.io-client";
import { useNavigate } from "react-router";

type AdminPage =
  | "dashboard"
  | "orders"
  | "order-detail"
  | "users-online"
  | "user-map"
  | "analytics"
  | "support"
  | "products"
  | "settings";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout?: () => void;
}

interface WebSocketMessage {
  type: "user_count" | "notification" | "unread_count" | "system";
  count?: number;
  data?: unknown;
}

export default function AdminLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: AdminLayoutProps) {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      if (onLogout) {
        onLogout();
      }
    }
  };

  useEffect(() => {
    let socket: Socket | null = null;

    try {
      socket = adminApi.connectWebSocket((data: WebSocketMessage) => {
        switch (data.type) {
          case "user_count":
            if (typeof data.count === "number") {
              setOnlineUsers(data.count);
            }
            break;
          case "notification":
            setNotifications((prev: number) => prev + 1);
            break;
          case "unread_count":
            if (typeof data.count === "number") {
              setNotifications(data.count);
            }
            break;
          case "system":
            console.log("System notification:", data);
            break;
          default:
            console.log("Unknown WebSocket message:", data);
        }
      });
    } catch (error: unknown) {
      console.error("Failed to connect WebSocket:", error);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const navigation: Array<{ name: string; href: AdminPage; icon: string }> = [
    { name: "Dashboard", href: "dashboard", icon: "📊" },
    // { name: "User Map", href: "user-map", icon: "🌍" },
    // { name: "Users Online", href: "users-online", icon: "👥" },
    { name: "Orders", href: "orders", icon: "📦" },
    { name: "Products", href: "products", icon: "🏷️" },
  ];

  const handleNavigate = (page: AdminPage) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 transition-colors duration-300">
      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-19.5 items-center justify-between px-4 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* NAV */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                className={`
                  group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors
                  ${
                    currentPage === item.href
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-gray-100"
                  }
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
                {item.name === "Users Online" && onlineUsers > 0 && (
                  <span className="ml-auto bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                    {onlineUsers}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-16 left-0 right-0 px-3">
          <div className="relative p-2">
            <ThemeToggle />
          </div>

          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <span className="text-lg">🔔</span>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications > 99 ? "99+" : notifications}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="mr-3 text-lg">🚪</span>
            Logout
          </button>
          <button
            onClick={() => navigate("/")}
            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="mr-3 text-lg">🛒</span>
            Go to landing
          </button>
        </div>

        {/* SYSTEM ONLINE */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              System Online
            </span>
          </div>
        </div>
      </div>

      <div className="lg:pl-64">
        {/* HEADER */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* HAMBURGER MENU */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
