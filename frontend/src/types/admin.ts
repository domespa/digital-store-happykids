export interface AdminOrderResponse {
  id: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  total: number;
  status: string;
  paymentProvider: "STRIPE" | "PAYPAL" | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  downloadCount?: number;
  downloadLimit?: number;
  downloadExpiresAt?: string | null;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    productId: string;
    product: {
      id: string;
      name: string;
      description: string;
      fileName: string;
      filePath?: string;
    } | null;
  }>;
  userId?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  orders: AdminOrderResponse[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusRequest {
  status?: string;
  paymentStatus?: string;
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
}

export interface OnlineUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  location: {
    country: string;
    city: string;
    region: string;
    countryCode: string;
    timezone: string;
  };
  currentPage: string;
  connectedAt: string;
  lastActivity: string;
  isAuthenticated: boolean;
}

export interface UserSession {
  id: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  location: {
    country: string;
    city: string;
    region: string;
    latitude: number;
    longitude: number;
  } | null;
  userAgent: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pagesVisited: string[];
  isActive: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  onlineUsers: number;
  todayOrders: number;
  pendingOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  topCountries: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: "order" | "user_join" | "user_leave";
    message: string;
    timestamp: string;
  }>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  fileName: string;
  filePath: string;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  stock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  viewCount: number;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string | null;
  images?: ProductImage[];
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  fileName: string;
  filePath: string;
  categoryId?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  fileName?: string;
  filePath?: string;
  isActive?: boolean;
  categoryId?: string;
  stock?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  allowBackorder?: boolean;
}

export interface ProductFilters {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  products: Product[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  currency: string;
}

export interface ProductMutationResponse {
  success: boolean;
  message: string;
  product?: Product;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
export interface WebSocketMessage {
  type: "user_count" | "notification" | "unread_count" | "system";
  count?: number;
  data?: unknown;
}

export interface UserTrackingMessage {
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

export interface UseRealTimeUsersReturn {
  onlineUsers: OnlineUser[];
  userSessions: UserSession[];
  loading: boolean;
  error: string | null;
  totalOnline: number;
  totalSessions: number;
  getOnlineUsersByCountry: (country: string) => OnlineUser[];
  getSessionsByCountry: (country: string) => UserSession[];
  isWebSocketConnected: () => boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isMain: boolean;
  createdAt: string;
}

export interface ProductImageListResponse {
  success: boolean;
  message: string;
  images: ProductImage[];
  total: number;
}

export interface ProductImageUploadResponse {
  success: boolean;
  message: string;
  images: ProductImage[];
}

export interface ProductImageDeleteResponse {
  success: boolean;
  message: string;
}

export interface ProductImageFeaturedResponse {
  success: boolean;
  message: string;
  image: ProductImage;
}

export interface OrderDownloadInfo {
  downloadCount: number;
  downloadLimit: number;
  downloadsRemaining: number;
  expiresOn: string;
  daysRemaining: number;
}

export interface AdminOrderResponseWithDownload extends AdminOrderResponse {
  downloadCount?: number;
  downloadLimit?: number;
  downloadExpiresAt?: string | null;
}
