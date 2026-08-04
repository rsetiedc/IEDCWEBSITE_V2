import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

// If a poster request hangs (throttled/blocked network) instead of erroring,
// fall back to the placeholder after this many seconds.
const POSTER_TIMEOUT_MS = 8000;

/**
 * EventCard — a single event card.
 * Layout: top accent line → badge → title → description → divider →
 * meta info → poster with an overlaid "Read More" button.
 */
export default function EventCard({ event, onReadMore }) {
  // Fall back to the styled placeholder if the poster fails to load
  const [posterFailed, setPosterFailed] = useState(false);
  const posterTimer = useRef(null);

  // Arm the timeout only once the browser actually starts loading the image
  // (lazy-loaded posters below the fold must not be timed out pre-emptively).
  const handlePosterLoadStart = () => {
    clearTimeout(posterTimer.current);
    posterTimer.current = setTimeout(() => setPosterFailed(true), POSTER_TIMEOUT_MS);
  };

  // Clear the pending timer on unmount
  useEffect(() => () => clearTimeout(posterTimer.current), []);

  return (
    <motion.article
      className="event-card"
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
    >
      {/* Top accent line */}
      <div className="event-card-accent" aria-hidden="true" />

      <div className="event-card-body">
        {/* Badge */}
        <span className="event-badge">Event</span>

        {/* Title (max 2 lines) */}
        <h3 className="event-title">{event.title}</h3>

        {/* Short description (clamped) */}
        {event.description && <p className="event-desc">{event.description}</p>}

        {/* Divider */}
        <div className="event-divider" aria-hidden="true" />

        {/* Event info */}
        <ul className="event-meta">
          <li className="event-meta-row">
            <FiCalendar className="event-meta-icon" aria-hidden="true" />
            <span>{event.date}</span>
          </li>
          <li className="event-meta-row">
            <FiClock className="event-meta-icon" aria-hidden="true" />
            <span>{event.time}</span>
          </li>
          <li className="event-meta-row">
            <FiMapPin className="event-meta-icon" aria-hidden="true" />
            <span>{event.venue}</span>
          </li>
        </ul>
      </div>

      {/* Poster + Read More overlay */}
      <div className="event-poster-wrap">
        {event.poster && !posterFailed ? (
          <img
            src={event.poster}
            alt={`${event.title} poster`}
            className="event-poster"
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoadStart={handlePosterLoadStart}
            onLoad={() => clearTimeout(posterTimer.current)}
            onError={() => setPosterFailed(true)}
          />
        ) : (
          <div className="event-poster event-poster-fallback" aria-hidden="true">
            <span>{event.title.charAt(0).toUpperCase()}</span>
          </div>
        )}

        <button
          type="button"
          className="event-readmore"
          onClick={onReadMore}
          aria-label={`Read more about ${event.title}`}
        >
          <span className="event-readmore-text">Read More</span>
          <span className="event-readmore-icon" aria-hidden="true">
            <FiArrowUpRight />
          </span>
        </button>
      </div>
    </motion.article>
  );
}
