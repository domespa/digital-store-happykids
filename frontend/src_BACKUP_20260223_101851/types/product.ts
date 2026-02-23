export interface PublicProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  displayPrice: number;
  currency: string;
  compareAtPrice: number;
  displayCompareAtPrice: number;
  originalPrice: number;
  originalCurrency: string;
  formattedPrice: string;
  formattedCompareAtPrice: string;
  exchangeRate: number;
  exchangeSource: "api" | "fallback" | "same";
  isActive: boolean;
  createdAt: Date;
  pages?: number;
  ageRange?: string;
  previewImages?: string[];
  images?: Array<{
    id: string;
    url: string;
    altText: string | null;
    isMain: boolean;
  }>;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  products?: PublicProductResponse[];
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
  currency?: CurrencyInfo;
}

export interface CurrencyInfo {
  current: string;
  supported: Array<{
    code: string;
    symbol: string;
    name: string;
    flag?: string;
  }>;
}

export interface UseProductsOptions {
  autofetch?: boolean;
  currency?: string;
  filters?: {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    isActive?: boolean;
    sortBy?: "name" | "price" | "createdAt";
    sortOrder?: "asc" | "desc";
  };
}

export interface UseProductsReturn {
  products: PublicProductResponse[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  currency: string;
}
