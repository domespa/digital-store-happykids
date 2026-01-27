import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import {
  TrackEventRequest,
  TrackEventResponse,
  DashboardMetrics,
  EventType,
  DeviceType,
} from "../types/landingAnalytics";

function parseUserAgent(userAgent: string | undefined) {
  if (!userAgent) {
    return {
      browser: "Unknown",
      os: "Unknown",
      deviceType: "desktop" as DeviceType,
    };
  }

  const ua = userAgent.toLowerCase();

  // Detect device type
  let deviceType: DeviceType = "desktop";
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    deviceType = "mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    deviceType = "tablet";
  }

  // Detect browser
  let browser = "Unknown";
  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("safari")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("edge")) browser = "Edge";

  // Detect OS
  let os = "Unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
    os = "iOS";

  return { browser, os, deviceType };
}

// Mappa nomi paesi completi → codici ISO (2 lettere)
const COUNTRY_CODE_MAP: Record<string, string> = {
  Italy: "IT",
  "United States": "US",
  "United Kingdom": "GB",
  Germany: "DE",
  France: "FR",
  Spain: "ES",
  Canada: "CA",
  Australia: "AU",
  Japan: "JP",
  China: "CN",
};

function getCountryCode(country: string | null): string | null {
  if (!country) return null;

  // Se è già un codice a 2 lettere, restituiscilo
  if (country.length === 2) {
    return country.toUpperCase();
  }

  // Altrimenti cerca nella mappa
  return COUNTRY_CODE_MAP[country] || country.substring(0, 2).toUpperCase();
}

async function getGeoLocation(req: Request) {
  let country = req.headers["cf-ipcountry"] as string;
  let city = req.headers["cf-ipcity"] as string;

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    "unknown";

  if ((!country || !city) && ip !== "unknown") {
    try {
      const pageView = await prisma.pageView.findFirst({
        where: {
          ipAddress: ip,
          disconnectedAt: null,
        },
        select: { country: true, city: true },
        orderBy: { createdAt: "desc" },
      });

      if (pageView) {
        country = pageView.country || country;
        city = pageView.city || city;
        console.log(`✅ Location found via IP: ${city}, ${country}`);
      } else {
        console.log(`⚠️ No location found for IP: ${ip}`);
      }
    } catch (error) {
      console.error("Error fetching location from page_views:", error);
    }
  }

  return {
    country: getCountryCode(country),
    city: city || null,
    ip,
  };
}

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const body = req.body as TrackEventRequest;

    if (!body.sessionId || !body.eventType || !body.pageUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: sessionId, eventType, pageUrl",
      });
    }

    const { browser, os, deviceType } = parseUserAgent(
      req.headers["user-agent"],
    );
    const { country, city, ip } = await getGeoLocation(req);

    const result = (await prisma.$queryRaw`
      INSERT INTO landing_analytics_events (
        session_id, visitor_id, event_type, event_name, page_url, page_title,
        referrer, event_data, user_agent, ip_address, country, city,
        device_type, browser, os, screen_width, screen_height, timestamp,
        session_duration, utm_source, utm_medium, utm_campaign, utm_content, utm_term
      ) VALUES (
        ${body.sessionId}, ${body.visitorId || null}, ${body.eventType}::"varchar",
        ${body.eventName || null}, ${body.pageUrl}, ${body.pageTitle || null},
        ${body.referrer || null}, ${JSON.stringify(body.eventData || {})}::jsonb,
        ${req.headers["user-agent"] || null}, ${ip}, ${country}, ${city},
        ${deviceType}::"varchar", ${browser}, ${os},
        ${body.eventData?.screenWidth || null}::integer,
        ${body.eventData?.screenHeight || null}::integer, NOW(),
        ${body.sessionDuration || null}::integer,
        ${body.utm?.source || null}, ${body.utm?.medium || null},
        ${body.utm?.campaign || null}, ${body.utm?.content || null},
        ${body.utm?.term || null}
      ) RETURNING id
    `) as Array<{ id: string }>;

    await updateSession(body.sessionId, body, {
      browser,
      os,
      deviceType,
      country,
      city,
    });

    res.json({
      success: true,
      eventId: result[0]?.id,
    } as TrackEventResponse);
  } catch (error) {
    console.error("Track event error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track event",
    });
  }
};

async function updateSession(
  sessionId: string,
  eventData: TrackEventRequest,
  techInfo: {
    browser: string;
    os: string;
    deviceType: DeviceType;
    country: string | null;
    city: string | null;
  },
) {
  try {
    const existing = (await prisma.$queryRaw`
      SELECT session_id FROM landing_analytics_sessions 
      WHERE session_id = ${sessionId} LIMIT 1
    `) as Array<{ session_id: string }>;

    if (existing.length === 0) {
      await prisma.$queryRaw`
        INSERT INTO landing_analytics_sessions (
          session_id, visitor_id, started_at, entry_page, referrer,
          device_type, browser, os, country, city,
          utm_source, utm_medium, utm_campaign, page_views
        ) VALUES (
          ${sessionId}, ${eventData.visitorId || null}, NOW(),
          ${eventData.pageUrl}, ${eventData.referrer || null},
          ${techInfo.deviceType}::"varchar", ${techInfo.browser}, ${techInfo.os},
          ${techInfo.country}, ${techInfo.city},
          ${eventData.utm?.source || null}, ${eventData.utm?.medium || null},
          ${eventData.utm?.campaign || null}, 1
        )
      `;
    } else {
      let updateParts: string[] = [];

      if (eventData.eventType === "page_view") {
        updateParts.push("page_views = page_views + 1");
      }

      if (eventData.eventType === "cta_click") {
        updateParts.push("cta_clicks = cta_clicks + 1");
      }

      if (
        eventData.eventType === "scroll" &&
        eventData.eventData?.scrollDepth
      ) {
        updateParts.push(
          `max_scroll_depth = GREATEST(max_scroll_depth, ${eventData.eventData.scrollDepth})`,
        );
      }

      if (eventData.sessionDuration) {
        updateParts.push(`duration = ${eventData.sessionDuration}`);
      }

      updateParts.push(`exit_page = '${eventData.pageUrl}'`);
      updateParts.push("ended_at = NOW()");

      if (updateParts.length > 0) {
        const updateQuery = `UPDATE landing_analytics_sessions SET ${updateParts.join(", ")} WHERE session_id = '${sessionId}'`;
        await prisma.$executeRawUnsafe(updateQuery);
      }
    }
  } catch (error) {
    console.error("Update session error:", error);
  }
}

export const trackConversion = async (req: Request, res: Response) => {
  try {
    const { sessionId, conversionType, conversionValue } = req.body;

    if (!sessionId || !conversionType) {
      return res.status(400).json({
        success: false,
        error: "Missing sessionId or conversionType",
      });
    }

    await prisma.$executeRaw`
      UPDATE landing_analytics_sessions
      SET converted = true, conversion_type = ${conversionType}::"varchar",
          conversion_value = ${conversionValue || 0}::decimal
      WHERE session_id = ${sessionId}
    `;

    res.json({ success: true });
  } catch (error) {
    console.error("Track conversion error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track conversion",
    });
  }
};

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const overview = (await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        AVG(duration)::integer as avg_duration,
        (COUNT(*) FILTER (WHERE page_views = 1)::float / NULLIF(COUNT(*), 0) * 100)::decimal(5,2) as bounce_rate,
        (COUNT(*) FILTER (WHERE converted = true)::float / NULLIF(COUNT(*), 0) * 100)::decimal(5,2) as conversion_rate
      FROM landing_analytics_sessions
      WHERE started_at >= ${startDate}
    `) as any;

    const trafficByDevice = (await prisma.$queryRaw`
      SELECT device_type, COUNT(*) as count
      FROM landing_analytics_sessions
      WHERE started_at >= ${startDate}
      GROUP BY device_type
      ORDER BY count DESC
    `) as any;

    const timeline = (await prisma.$queryRaw`
      SELECT 
        DATE(started_at) as date,
        COUNT(*) as visitors,
        COUNT(*) FILTER (WHERE converted = true) as conversions,
        SUM(conversion_value)::decimal(10,2) as revenue
      FROM landing_analytics_sessions
      WHERE started_at >= ${startDate}
      GROUP BY DATE(started_at)
      ORDER BY date ASC
    `) as any;

    const metrics: DashboardMetrics = {
      overview: {
        totalVisitors: Number(overview[0]?.total_sessions || 0),
        uniqueVisitors: Number(overview[0]?.unique_visitors || 0),
        avgSessionDuration: overview[0]?.avg_duration || 0,
        bounceRate: Number(overview[0]?.bounce_rate || 0),
        conversionRate: Number(overview[0]?.conversion_rate || 0),
      },
      traffic: {
        byDevice: trafficByDevice.map((d: any) => ({
          device: d.device_type,
          count: Number(d.count),
        })),
        bySource: [],
        byCountry: [],
      },
      engagement: {
        avgScrollDepth: 0,
        totalCtaClicks: 0,
        ctaClickRate: 0,
        topSections: [],
      },
      conversions: {
        total: 0,
        rate: Number(overview[0]?.conversion_rate || 0),
        value: 0,
        byType: [],
      },
      timeline: timeline.map((t: any) => ({
        date: t.date.toISOString().split("T")[0],
        visitors: Number(t.visitors),
        conversions: Number(t.conversions),
        revenue: Number(t.revenue || 0),
      })),
    };

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard metrics",
    });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const days = parseInt(req.query.days as string) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = (await prisma.$queryRaw`
      SELECT * FROM landing_analytics_sessions
      WHERE started_at >= ${startDate}
      ORDER BY started_at DESC
      LIMIT ${limit}
    `) as Array<any>;

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sessions",
    });
  }
};

export const getSessionEvents = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const events = (await prisma.$queryRaw`
      SELECT 
        id, event_type, event_name, event_data, timestamp
      FROM landing_analytics_events
      WHERE session_id = ${sessionId}
      ORDER BY timestamp ASC
    `) as Array<any>;

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get session events error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch events",
    });
  }
};
