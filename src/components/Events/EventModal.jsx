import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// If a poster request hangs (throttled/blocked network) instead of erroring,
// fall back to the placeholder after this many seconds.
const POSTER_TIMEOUT_MS = 8000;
import {
  FiArrowUpRight,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

const DETAIL_ICONS = {
  date: FiCalendar,
  time: FiClock,
  venue: FiMapPin,
  organizer: FiUser,
  audience: FiUsers,
};

/**
 * EventModal — centered modal with a two-column layout on desktop
 * (poster left / details right) and a single column on mobile.
 */
export default function EventModal({ event, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  // Fall back to the styled placeholder if the poster fails to load
  const [posterFailed, setPosterFailed] = useState(false);
  const posterTimer = useRef(null);

  // Arm the timeout only once the browser actually starts loading the image
  // (lazy-loaded posters must not be timed out pre-emptively).
  const handlePosterLoadStart = () => {
    clearTimeout(posterTimer.current);
    posterTimer.current = setTimeout(() => setPosterFailed(true), POSTER_TIMEOUT_MS);
  };

  // Clear the pending timer on unmount
  useEffect(() => () => clearTimeout(posterTimer.current), []);

  // ----- Event photos gallery -----
  const [activePhoto, setActivePhoto] = useState(0);
  const [failedPhotos, setFailedPhotos] = useState(() => new Set());

  // Photos still loadable — broken ones are dropped on error
  const photos = (event.photos || []).filter((url) => !failedPhotos.has(url));
  const currentIndex = Math.min(activePhoto, Math.max(photos.length - 1, 0));
  const currentPhoto = photos.length ? photos[currentIndex] : null;

  const markPhotoFailed = (url) =>
    setFailedPhotos((prev) => new Set(prev).add(url));

  const showPhoto = (direction) =>
    setActivePhoto((i) =>
      photos.length === 0 ? i : (i + direction + photos.length) % photos.length
    );
  const showPrevPhoto = () => showPhoto(-1);
  const showNextPhoto = () => showPhoto(1);

  // Keep the current photo count available to the stable keydown handler below
  // (updated after every render, so the handler never reads a stale value).
  const photosCountRef = useRef(0);
  useEffect(() => {
    photosCountRef.current = photos.length;
  });

  // Focus the close button on open, trap focus, lock scroll, close on ESC.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Arrow keys navigate the event photo gallery (when it has photos)
      if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        photosCountRef.current > 1
      ) {
        e.preventDefault();
        const direction = e.key === "ArrowLeft" ? -1 : 1;
        setActivePhoto((i) =>
          (i + direction + photosCountRef.current) % photosCountRef.current
        );
        return;
      }
      // Simple focus trap: keep Tab/Shift+Tab within the modal
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // disable background scrolling

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  // Categories shown as "A • B • C" under the badge
  const categories = [event.eventType, event.category, ...event.tags].filter(Boolean);

  const details = [
    { key: "date", label: "Date", value: event.date },
    { key: "time", label: "Time", value: event.time },
    { key: "venue", label: "Venue", value: event.venue },
    { key: "organizer", label: "Organizer", value: event.organizer },
    { key: "audience", label: "Audience", value: event.audience },
  ].filter((detail) => detail.value);

  const canRegister = event.isOpen && Boolean(event.registrationLink);

  return (
    <motion.div
      className="event-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        ref={dialogRef}
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Modal header ---------- */}
        <header className="event-modal-header">
          <h2 className="event-modal-title">{event.title}</h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="event-modal-close"
            onClick={onClose}
            aria-label="Close event details"
          >
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div className="event-divider event-modal-divider" aria-hidden="true" />

        {/* ---------- Modal body ---------- */}
        <div className="event-modal-body">
          {/* Left: poster */}
          <div className="event-modal-poster-wrap">
            {event.poster && !posterFailed ? (
              <img
                src={event.poster}
                alt={`${event.title} poster`}
                className="event-modal-poster"
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoadStart={handlePosterLoadStart}
                onLoad={() => clearTimeout(posterTimer.current)}
                onError={() => setPosterFailed(true)}
              />
            ) : (
              <div className="event-modal-poster event-poster-fallback" aria-hidden="true">
                <span>{event.title.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Right: information */}
          <div className="event-modal-info">
            <span className="event-badge">Event</span>
            {categories.length > 0 && (
              <p className="event-modal-categories">{categories.join(" • ")}</p>
            )}

            {/* Event details card */}
            <div className="event-modal-card">
              <h3 className="event-modal-card-title">Event Details</h3>
              <div className="event-divider" aria-hidden="true" />
              <ul className="event-details-list">
                {details.map((detail) => {
                  const Icon = DETAIL_ICONS[detail.key];
                  return (
                    <li key={detail.key} className="event-detail-row">
                      <span className="event-detail-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <div className="event-detail-text">
                        <span className="event-detail-label">{detail.label}</span>
                        <span className="event-detail-value">{detail.value}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Registration & contact card */}
            <div className="event-modal-card">
              <h3 className="event-modal-card-title">Registration &amp; Contact</h3>
              <div className="event-divider" aria-hidden="true" />
              <ul className="event-contact-list">
                {event.contacts.map((contact, index) => (
                  <li key={index} className="event-contact-row">
                    <span className="event-contact-name">{contact.name}</span>
                    <span className="event-contact-links">
                      {contact.phone && (
                        <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                          <FiPhone aria-hidden="true" /> {contact.phone}
                        </a>
                      )}
                      {contact.email && (
                        <a href={`mailto:${contact.email}`}>
                          <FiMail aria-hidden="true" /> {contact.email}
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom status */}
            <div className="event-modal-footer">
              {canRegister ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="event-register-btn"
                >
                  <span>Register Now</span>
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <button type="button" className="event-register-btn disabled" disabled>
                  <FiLock aria-hidden="true" />
                  <span>Registration Closed</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Event photos gallery ---------- */}
        {photos.length > 0 && (
          <section className="event-modal-photos" aria-label={`${event.title} photos`}>
            <div className="event-modal-photos-head">
              <h3 className="event-modal-photos-title">Event Photos</h3>
              {photos.length > 1 && (
                <span className="event-modal-photos-count" aria-live="polite">
                  {currentIndex + 1} / {photos.length}
                </span>
              )}
            </div>

            <div className="event-modal-photos-main">
              {photos.length > 1 && (
                <button
                  type="button"
                  className="event-modal-photos-nav prev"
                  onClick={showPrevPhoto}
                  aria-label="Previous photo"
                >
                  <FiChevronLeft aria-hidden="true" />
                </button>
              )}

              <div className="event-modal-photos-stage">
                {currentPhoto && (
                  <motion.img
                    key={currentPhoto}
                    src={currentPhoto}
                    alt={`${event.title} photo ${currentIndex + 1}`}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    onError={() => markPhotoFailed(currentPhoto)}
                  />
                )}
              </div>

              {photos.length > 1 && (
                <button
                  type="button"
                  className="event-modal-photos-nav next"
                  onClick={showNextPhoto}
                  aria-label="Next photo"
                >
                  <FiChevronRight aria-hidden="true" />
                </button>
              )}
            </div>

            {photos.length > 1 && (
              <div className="event-modal-photos-thumbs" aria-label="Choose photo">
                {photos.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    className={`event-modal-photo-thumb ${
                      index === currentIndex ? "active" : ""
                    }`}
                    aria-label={`Photo ${index + 1}`}
                    aria-current={index === currentIndex}
                    onClick={() => setActivePhoto(index)}
                  >
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() => markPhotoFailed(url)}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </motion.div>
    </motion.div>
  );
}
