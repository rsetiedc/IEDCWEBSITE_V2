import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCalendar,
  FiCamera,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";

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
  // Number of curated photos for this event (from src/services/eventPhotos.js)
  const photoCount = (event.photos || []).length;
  // Contact people from the Baserow events + contacts tables. Every person
  // listed in the database is shown (names always render; phones/emails are
  // added when the table has them). Events with no contacts map to an empty
  // list, so no section is rendered.
  const contacts = event.contacts || [];

  // Full-poster hover preview (floating panel showing the complete image)
  const posterWrapRef = useRef(null);
  const [preview, setPreview] = useState(null); // { left, top, width, height } | null

  // Show the full poster beside the card, flipping to the left when there is
  // no room on the right, and clamped to the viewport.
  const openPosterPreview = () => {
    const wrap = posterWrapRef.current;
    if (!wrap || !event.poster || posterFailed) return;
    const rect = wrap.getBoundingClientRect();
    const gap = 20;
    const width = Math.min(300, window.innerWidth - gap * 2);
    const height = Math.min(430, window.innerHeight - gap * 2);

    let left = rect.right + gap;
    if (left + width > window.innerWidth - gap) {
      left = rect.left - gap - width;
      if (left < gap) left = gap;
    }
    let top = rect.top + rect.height / 2 - height / 2;
    top = Math.max(gap, Math.min(top, window.innerHeight - height - gap));

    setPreview({ left, top, width, height });
  };

  const closePosterPreview = () => setPreview(null);

  // Close the preview if the page scrolls/resizes while it is open, so it
  // never stays anchored to a position the card has moved away from.
  useEffect(() => {
    if (!preview) return undefined;
    const close = () => setPreview(null);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [preview]);

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

        {/* Contact people + phone numbers (from Baserow) */}
        {contacts.length > 0 && (
          <div className="event-card-contacts">
            <span className="event-card-contacts-label">Contact</span>
            <ul className="event-card-contacts-list">
              {contacts.map((contact, index) => {
                // tel: links must contain only digits and "+" — strip the
                // rest, and fall back to email when nothing usable remains.
                const cleanedPhone = contact.phone
                  ? contact.phone.replace(/[^+\d]/g, "")
                  : "";
                return (
                  <li key={index} className="event-card-contact">
                    <FiUser className="event-card-contact-icon" aria-hidden="true" />
                    <span className="event-card-contact-name">{contact.name}</span>
                    {cleanedPhone ? (
                      <a
                        href={`tel:${cleanedPhone}`}
                        className="event-card-contact-link"
                      >
                        <FiPhone aria-hidden="true" /> {contact.phone}
                      </a>
                    ) : (
                      contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="event-card-contact-link"
                        >
                          <FiMail aria-hidden="true" /> {contact.email}
                        </a>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Poster + Read More overlay */}
      <div
        ref={posterWrapRef}
        className="event-poster-wrap"
        onMouseEnter={openPosterPreview}
        onMouseLeave={closePosterPreview}
        onClick={closePosterPreview}
      >
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

        {photoCount > 0 && (
          <span
            className="event-photo-count"
            title={`${photoCount} photo${photoCount === 1 ? "" : "s"}`}
            aria-label={`${photoCount} photo${photoCount === 1 ? "" : "s"}`}
          >
            <FiCamera aria-hidden="true" />
            {photoCount}
          </span>
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

      {/* Full-poster preview — rendered via portal so the card's overflow
          (and its entrance transform) can never clip or misposition it. */}
      {createPortal(
        <AnimatePresence>
          {preview && (
            <motion.div
              className="event-poster-preview"
              style={{
                left: preview.left,
                top: preview.top,
                width: preview.width,
                height: preview.height,
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              aria-hidden="true"
            >
              <img src={event.poster} alt="" referrerPolicy="no-referrer" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.article>
  );
}
