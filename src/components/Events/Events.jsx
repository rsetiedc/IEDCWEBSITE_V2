import { useEffect, useMemo, useState } from "react";
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

export default function Events() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [activeTab, setActiveTab] = useState("open");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events from Baserow (business logic lives in services/eventsApi).
  useEffect(() => {
    let cancelled = false;
    fetchEvents()
      .then((data) => {
        if (!cancelled) {
          setEvents(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Manual retry (from the error state). */
  const handleRetry = () => {
    setStatus("loading");
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
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
        {/* ============ Section 2: Filter Tabs ============ */}
        <div
          className="events-tabs"
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
                    onReadMore={() => setSelectedEvent(event)}
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
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
