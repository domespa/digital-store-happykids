export type EventType =
  | "page_view"
  | "scroll"
  | "click"
  | "cta_click"
  | "form_submit"
  | "section_view"
  | "exit_intent";

export type DeviceType = "mobile" | "tablet" | "desktop";
export type ConversionType = "purchase" | "email_signup" | "add_to_cart";

export interface LandingAnalyticsEvent {
  id: string;
  session_id: string;
  visitor_id: string | null;
  event_type: EventType;
  event_name: string | null;
  page_url: string;
  page_title: string | null;
  referrer: string | null;
  event_data: Record<string, any>;
  user_agent: string | null;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  device_type: DeviceType | null;
  browser: string | null;
  os: string | null;
  screen_width: number | null;
  screen_height: number | null;
  timestamp: Date;
  session_duration: number | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: Date;
}

export interface LandingAnalyticsSession {
  id: string;
  session_id: string;
  visitor_id: string | null;
  started_at: Date;
  ended_at: Date | null;
  duration: number | null;
  page_views: number;
  max_scroll_depth: number;
  cta_clicks: number;
  sections_viewed: string[];
  converted: boolean;
  conversion_type: ConversionType | null;
  conversion_value: number | null;
  entry_page: string | null;
  exit_page: string | null;
  referrer: string | null;
  device_type: DeviceType | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface TrackEventRequest {
  sessionId: string;
  visitorId?: string;
  eventType: EventType;
  eventName?: string;
  eventData?: Record<string, any>;
  pageUrl: string;
  pageTitle?: string;
  referrer?: string;
  sessionDuration?: number;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
}

export interface TrackEventResponse {
  success: boolean;
  eventId?: string;
  error?: string;
}

export interface DashboardMetrics {
  overview: {
    totalVisitors: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  traffic: {
    bySource: { source: string; count: number }[];
    byDevice: { device: DeviceType; count: number }[];
    byCountry: { country: string; count: number }[];
  };
  engagement: {
    avgScrollDepth: number;
    totalCtaClicks: number;
    ctaClickRate: number;
    topSections: { section: string; views: number }[];
  };
  conversions: {
    total: number;
    rate: number;
    value: number;
    byType: { type: ConversionType; count: number }[];
  };
  timeline: {
    date: string;
    visitors: number;
    conversions: number;
    revenue: number;
  }[];
}
