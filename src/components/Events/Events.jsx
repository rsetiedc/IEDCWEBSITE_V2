import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import "./Events.css";

import { fetchEvents } from "../../services/eventsApi";
import EventCard from "./EventCard";
import EventModal from "./EventModal";

// Filter tabs shown below the heading
const TABS = [
  { key: "open", label: "Open Events" },
  { key: "closed", label: "Closed Events" },
];

// How often the page re-checks the Baserow database for changes (overridable
// via VITE_EVENTS_REFRESH_MS in .env). Unset/invalid/zero values fall back to
// the 15s default, and the page additionally re-syncs instantly whenever the
// tab regains focus/visibility — so edits in Baserow appear with very little
// latency.
const parsedRefreshMs = Number(import.meta.env.VITE_EVENTS_REFRESH_MS);
const REFRESH_INTERVAL_MS =
  Number.isFinite(parsedRefreshMs) && parsedRefreshMs > 0
    ? parsedRefreshMs
    : 15_000;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [activeTab, setActiveTab] = useState("open");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const syncingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Store the fetched events. If the details modal is open, swap its event for
   * the freshly fetched one (when it still exists) so the modal always shows
   * the latest data from Baserow.
   */
  const applyEvents = useCallback((data, { initial = false } = {}) => {
    setEvents(data);
    setLastUpdated(new Date());
    setSelectedEvent((current) => {
      if (!current) return current;
      return data.find((event) => event.id === current.id) || null;
    });
    if (initial) setStatus("ready");
  }, []);

  /**
   * Fetch events from Baserow. `initial` failures surface the error state;
   * background refreshes fail silently and keep the current list.
   */
  const syncEvents = useCallback(
    async ({ initial = false } = {}) => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      if (!initial) setRefreshing(true);
      try {
        const data = await fetchEvents();
        if (mountedRef.current) applyEvents(data, { initial });
      } catch {
        if (mountedRef.current && initial) setStatus("error");
      } finally {
        if (mountedRef.current) {
          syncingRef.current = false;
          setRefreshing(false);
        }
      }
    },
    [applyEvents]
  );

  // Initial load + auto-refresh: re-sync on a fixed interval and whenever the
  // tab regains focus/visibility — so edits saved in Baserow appear here
  // automatically, without a redeploy or even a manual reload.
  useEffect(() => {
    let cancelled = false;

    // Initial load — chained so no state is set synchronously in the effect
    // body (which react-hooks/set-state-in-effect would flag).
    fetchEvents()
      .then((data) => {
        if (!cancelled) applyEvents(data, { initial: true });
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    const intervalId =
      REFRESH_INTERVAL_MS > 0
        ? setInterval(() => syncEvents(), REFRESH_INTERVAL_MS)
        : null;
    const reSyncWhenVisible = () => {
      if (document.visibilityState === "visible") syncEvents();
    };
    document.addEventListener("visibilitychange", reSyncWhenVisible);
    window.addEventListener("focus", reSyncWhenVisible);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", reSyncWhenVisible);
      window.removeEventListener("focus", reSyncWhenVisible);
    };
  }, [applyEvents, syncEvents]);

  /** Manual retry (from the error state). */
  const handleRetry = () => {
    setStatus("loading");
    syncEvents({ initial: true });
  };

  /**
   * Open an event's details modal, first pulling the latest Baserow data in
   * the background so the modal opens with fresh details.
   */
  const handleReadMore = (event) => {
    syncEvents();
    setSelectedEvent(event);
  };

  const openEvents = useMemo(() => events.filter((event) => event.isOpen), [events]);
  const closedEvents = useMemo(() => events.filter((event) => !event.isOpen), [events]);

  /** Allow arrow-key navigation between the filter tabs (a11y). */
  const handleTabKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const currentIndex = TABS.findIndex((tab) => tab.key === activeTab);
    const direction = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + TABS.length) % TABS.length;
    setActiveTab(TABS[nextIndex].key);
  };

  const currentEvents = activeTab === "open" ? openEvents : closedEvents;
  const emptyMessage =
    activeTab === "open"
      ? "No open events at the moment. Stay tuned!"
      : "No past events to show yet. Check back soon!";

  return (
    <main className="events-page">
      {/* ============ Section 1: Hero Heading ============ */}
      <section className="events-hero">
        <motion.span
          className="events-tag"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Events
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          OUR EVENTS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover the workshops, competitions, and startup initiatives shaping
          the entrepreneurial spirit at RSET IEDC.
        </motion.p>
      </section>

      <section className="events-content">
        {/* ============ Section 2: Filter Tabs + Auto-refresh ============ */}
        <div className="events-tabs">
          <div
            className="events-tablist"
            role="tablist"
            aria-label="Filter events"
            onKeyDown={handleTabKeyDown}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="events-panel"
                  className={`events-tab ${isActive ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="events-tab-pill"
                      className="events-tab-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="events-tab-label">{tab.label}</span>
                  <span className="events-tab-count">
                    {tab.key === "open" ? openEvents.length : closedEvents.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Manual refresh + live-update indicator */}
          <div className="events-toolbar">
            {lastUpdated && status === "ready" && (
              <span className="events-updated" role="status" aria-live="polite">
                <span className="events-live-dot" aria-hidden="true" />
                Auto-refreshed{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}
            <button
              type="button"
              className={`events-refresh ${refreshing ? "spinning" : ""}`}
              onClick={() => syncEvents()}
              disabled={refreshing}
              aria-label="Refresh events from Baserow now"
              title="Refresh events from Baserow now"
            >
              <FiRefreshCw className="events-refresh-icon" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ============ Sections 3 & 4: Event Grid / Empty State ============ */}
        <div id="events-panel" role="tabpanel">
          {status === "loading" && (
            <div className="events-status" role="status" aria-live="polite">
              <span className="events-spinner" aria-hidden="true" />
              <p>Loading events…</p>
            </div>
          )}

          {status === "error" && (
            <div className="events-status" role="alert">
              <p>We couldn't load the events right now. Please try again.</p>
              <button type="button" className="events-retry" onClick={handleRetry}>
                <FiRefreshCw aria-hidden="true" /> Retry
              </button>
            </div>
          )}

          {status === "ready" &&
            (currentEvents.length > 0 ? (
              <motion.div
                key={activeTab}
                className="events-grid"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              >
                {currentEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onReadMore={() => handleReadMore(event)}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="events-empty" role="status">
                <span className="events-empty-icon" aria-hidden="true">
                  📅
                </span>
                <p>{emptyMessage}</p>
              </div>
            ))}
        </div>
      </section>

      {/* ============ Section 5: Event Details Modal ============ */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            key={selectedEvent.id}
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
