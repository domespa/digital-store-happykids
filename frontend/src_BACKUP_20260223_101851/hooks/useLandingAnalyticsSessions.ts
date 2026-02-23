import { useState, useEffect } from "react";
import { landingAnalytics } from "../services/adminApi";

interface Session {
  id: string;
  session_id: string;
  visitor_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration: number | null;
  page_views: number;
  max_scroll_depth: number;
  cta_clicks: number;
  sections_viewed: string[];
  converted: boolean;
  conversion_type: string | null;
  conversion_value: number | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export function useLandingAnalyticsSessions(
  limit: number = 20,
  days: number = 7,
) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await landingAnalytics.getSessions({ limit, days });
      setSessions(response.sessions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [limit, days]);

  return {
    sessions,
    loading,
    error,
    refresh: loadSessions,
  };
}
