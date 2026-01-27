import { useState, useEffect } from "react";
import { landingAnalytics } from "../../services/adminApi";
import { Card } from "../ui/Card";

interface Event {
  id: string;
  event_type: string;
  event_name: string | null;
  event_data: any;
  timestamp: string;
}

interface Session {
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

interface Props {
  session: Session;
  onClose: () => void;
}

export function SessionDetailModal({ session, onClose }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await landingAnalytics.getSessionEvents(
          session.session_id,
        );
        setEvents(response.events);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [session.session_id]);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Session Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Session ID: {session.session_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-xs text-gray-500">Durata sessione</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatDuration(session.duration)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-500">Pagine viste</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {session.page_views}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-500">
                Percentuale di pagina vista
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {session.max_scroll_depth}%
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-500">Click sulla CTA</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {session.cta_clicks}
              </p>
            </Card>
          </div>

          {/* User Info */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Informazioni utente
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Device</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {session.device_type || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Browser</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {session.browser || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">OS</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {session.os || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Località</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {session.city && session.country
                    ? `${session.city}, ${session.country}`
                    : session.country || "Unknown"}
                </p>
              </div>
            </div>
          </Card>

          {/* Conversion */}
          {session.converted && (
            <Card className="p-4 mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Converted!
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-600 dark:text-green-400">Type</p>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    {session.conversion_type}
                  </p>
                </div>
                {session.conversion_value && (
                  <div>
                    <p className="text-green-600 dark:text-green-400">Value</p>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      €{session.conversion_value}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Events Timeline */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Eventi
            </h3>
            {loading ? (
              <p className="text-center text-gray-500 py-4">
                Loading events...
              </p>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No events found</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {event.event_type}
                        </span>
                        {event.event_name && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                            {event.event_name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
