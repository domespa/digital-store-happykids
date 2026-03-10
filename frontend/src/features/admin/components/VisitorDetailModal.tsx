import { useEffect, useState } from "react";
import type { OnlineUser } from "../../../types/admin";

interface VisitorDetailModalProps {
  visitor: OnlineUser & { sessions?: any[] };
  isOnline: boolean;
  onClose: () => void;
}

interface EventGroup {
  scrollDepth: number;
  sectionsViewed: string[];
  ctaClicks: string[];
  pageViews: string[];
  purchases: any[];
  addToCarts: any[];
}

export default function VisitorDetailModal({
  visitor,
  isOnline,
  onClose,
}: VisitorDetailModalProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set(),
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateDuration = (session: any) => {
    if (!session.disconnectedAt) return "In corso...";

    const start = new Date(session.timestamp);
    const end = new Date(session.disconnectedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "< 1m";
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  // Load visitor events
  useEffect(() => {
    if (!visitor.sessions || visitor.sessions.length === 0) {
      setLoading(false);
      return;
    }

    // Carica eventi per TUTTE le sessioni di questo visitor
    const sessionIds = visitor.sessions.map((s: any) => s.id);

    Promise.all(
      sessionIds.map((sessionId) =>
        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/sessions/${sessionId}/events`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          },
        ).then((res) => res.json()),
      ),
    )
      .then((results) => {
        const allEvents = results.flatMap((r) =>
          r.success ? r.data?.events || [] : [],
        );
        setEvents(allEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading events:", error);
        setLoading(false);
      });
  }, [visitor.sessions]);

  // Group events
  const groupedEvents: EventGroup = events.reduce(
    (acc, event) => {
      switch (event.type) {
        case "SCROLL_DEPTH":
          acc.scrollDepth = Math.max(
            acc.scrollDepth,
            event.metadata?.depth || 0,
          );
          break;
        case "SECTION_VIEW":
          if (
            event.metadata?.section &&
            !acc.sectionsViewed.includes(event.metadata.section)
          ) {
            acc.sectionsViewed.push(event.metadata.section);
          }
          break;
        case "CTA_CLICK":
          if (event.metadata?.cta) {
            acc.ctaClicks.push(event.metadata.cta);
          }
          break;
        case "PAGE_VIEW":
          if (event.page) {
            acc.pageViews.push(event.page);
          }
          break;
        case "PURCHASE":
          acc.purchases.push(event);
          break;
        case "ADD_TO_CART":
          acc.addToCarts.push(event);
          break;
      }
      return acc;
    },
    {
      scrollDepth: 0,
      sectionsViewed: [] as string[],
      ctaClicks: [] as string[],
      pageViews: [] as string[],
      purchases: [] as any[],
      addToCarts: [] as any[],
    },
  );

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Visitatore #{visitor.visitorNumber || "N/A"}
            </h2>
            {isOnline && (
              <span className="px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full">
                Online
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* LOCALITÀ */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    📍 Località
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {visitor.location?.city ||
                        visitor.sessions?.[0]?.city ||
                        "Sconosciuta"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {visitor.location?.country ||
                        visitor.sessions?.[0]?.country ||
                        "Sconosciuto"}
                    </p>
                  </div>
                </div>

                {/* STATISTICHE */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    📊 Statistiche
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        Sessioni:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {visitor.sessions?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        Eventi:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {events.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATTIVITÀ SUMMARY */}
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary dark:text-blue-400">
                    {groupedEvents.scrollDepth}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Max Scroll
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {groupedEvents.sectionsViewed.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Sezioni
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {groupedEvents.ctaClicks.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    CTA Click
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {groupedEvents.purchases.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Acquisti
                  </p>
                </div>
              </div>

              {/* TIMELINE SESSIONI - ACCORDION */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  📅 Timeline Sessioni ({visitor.sessions?.length || 0})
                </h3>

                <div className="space-y-2">
                  {visitor.sessions?.map((session: any, index: number) => {
                    const sessionEvents = events.filter(
                      (e) => e.sessionId === session.id,
                    );
                    const isExpanded = expandedSessions.has(session.id);

                    return (
                      <div
                        key={session.id}
                        className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                      >
                        {/* SESSION HEADER */}
                        <button
                          onClick={() => toggleSession(session.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                session.isOnline
                                  ? "bg-green-500 animate-pulse"
                                  : "bg-gray-400"
                              }`}
                            />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Sessione {index + 1}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(session.timestamp)} •{" "}
                                {formatTime(session.timestamp)} •{" "}
                                {calculateDuration(session)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {sessionEvents.length} eventi
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </button>

                        {/* SESSION CONTENT */}
                        {isExpanded && (
                          <div className="p-4 pt-0 bg-gray-50 dark:bg-slate-700/30">
                            {sessionEvents.length === 0 ? (
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                Nessun evento registrato
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {sessionEvents.map((event) => (
                                  <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg"
                                  >
                                    <div className="flex-shrink-0 text-lg">
                                      {event.type === "CONNECTED"
                                        ? "🔵"
                                        : event.type === "DISCONNECTED"
                                          ? "🔴"
                                          : event.type === "PAGE_VIEW"
                                            ? "👁️"
                                            : event.type === "SCROLL_DEPTH"
                                              ? "📜"
                                              : event.type === "SECTION_VIEW"
                                                ? "📑"
                                                : event.type === "CTA_CLICK"
                                                  ? "🎯"
                                                  : event.type === "ADD_TO_CART"
                                                    ? "🛒"
                                                    : event.type === "PURCHASE"
                                                      ? "💰"
                                                      : "📍"}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {event.type === "CONNECTED"
                                          ? "Connesso"
                                          : event.type === "DISCONNECTED"
                                            ? "Disconnesso"
                                            : event.type === "PAGE_VIEW"
                                              ? "Pagina visualizzata"
                                              : event.type === "SCROLL_DEPTH"
                                                ? `Scroll: ${event.metadata?.depth}%`
                                                : event.type === "SECTION_VIEW"
                                                  ? `Sezione: ${event.metadata?.section}`
                                                  : event.type === "CTA_CLICK"
                                                    ? `CTA: ${event.metadata?.cta}`
                                                    : event.type ===
                                                        "ADD_TO_CART"
                                                      ? "Aggiunto al carrello"
                                                      : event.type ===
                                                          "PURCHASE"
                                                        ? "Acquisto completato"
                                                        : event.type}
                                      </p>

                                      {event.page && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                                          {event.page}
                                        </p>
                                      )}

                                      {event.value && (
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 font-semibold">
                                          €{event.value.toFixed(2)}
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex-shrink-0 text-right">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTime(event.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SUMMARY EVENTI */}
              <div className="space-y-3">
                {/* SEZIONI VISTE */}
                {groupedEvents.sectionsViewed.length > 0 && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      📑 Sezioni Visualizzate (
                      {groupedEvents.sectionsViewed.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {groupedEvents.sectionsViewed.map((section, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA CLICCATI */}
                {groupedEvents.ctaClicks.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                      🎯 CTA Cliccati ({groupedEvents.ctaClicks.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {groupedEvents.ctaClicks.map((cta, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {cta}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
