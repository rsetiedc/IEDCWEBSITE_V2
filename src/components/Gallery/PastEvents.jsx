import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import "./PastEvents.css";
import PastEventModal from "./PastEventModal";
import { getEventCoverPhoto } from "../../services/galleryPhotos";


/**
 * Gallery of Past Events — the flagship events of RSET IEDC & IIC RSET.
 *
 * Self-contained section (own component + own CSS) so the existing gallery
 * code (Gallery.jsx / Gallery.css) is never touched. Each event has a photo
 * folder under src/assets/gallery/events_page/; the web-ready copies inside
 * its `optimized/` subfolder are loaded automatically by
 * services/galleryPhotos.js.
 */
const PAST_EVENTS = [
  {
    id: 1,
    name: "IEDC SUMMIT",
    tag: "Flagship Summit",
    description:
      "The annual flagship summit uniting innovators, founders and the RSET community for a day of ideas and inspiration.",
  },
  {
    id: 2,
    name: "IIC REGIONAL MEET",
    tag: "Regional Meet",
    description:
      "A regional gathering of Institution's Innovation Council members, sharing best practices in nurturing innovation.",
  },
  {
    id: 3,
    name: "HACKSUS",
    tag: "Hackathon",
    description:
      "RSET's signature hackathon where student teams build, break and ship ideas in a marathon of code and creativity.",
  },
  {
    id: 4,
    name: "IGNIITE",
    tag: "Entrepreneurship",
    description:
      "A national-level entrepreneurship program igniting startup dreams among young minds.",
  },
  {
    id: 5,
    name: "START-IT-UP",
    tag: "Startup Showcase",
    description:
      "A platform where student startups pitch their ideas to win support and incubation.",
  },
];

/**
 * Renders the art area for an event card — cover photo if available,
 * otherwise the gradient placeholder with the event initial.
 */
function EventArt({ event }) {
  const coverPhoto = getEventCoverPhoto(event.name);

  return (
    <div
      className={`past-event-art past-event-art-${event.id}${coverPhoto ? " has-cover" : ""}`}
      aria-hidden="true"
    >
      {coverPhoto && (
        <img
          src={coverPhoto}
          alt=""
          className="past-event-cover-img"
          loading="lazy"
          decoding="async"
        />
      )}
      {!coverPhoto && (
        <span className="past-event-art-letter">
          {event.name.charAt(0)}
        </span>
      )}
      <span className="past-event-art-num">
        {String(event.id).padStart(2, "0")}
      </span>
      <span className="past-event-view">
        <FiCamera aria-hidden="true" />
        View Photos
      </span>
    </div>
  );
}

export default function PastEvents() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <section className="past-events" aria-labelledby="past-events-title">


      <div className="past-events-head">
        <span className="past-events-tag">Flagship Events</span>
        <h2 id="past-events-title" className="past-events-title">
          Gallery of Past Events
        </h2>
        <p className="past-events-subtitle">
          A look back at the flagship events of RSET IEDC &amp; IIC RSET — the
          milestones that shaped our journey in innovation and entrepreneurship.
          Click an event to open its photo gallery.
        </p>
      </div>

      <div className="past-events-grid">
        {PAST_EVENTS.map((event, index) => (
          <motion.article
            key={event.id}
            className="past-event-card"
            role="button"
            tabIndex={0}
            aria-label={`View photos of ${event.name}`}
            onClick={() => setSelectedEvent(event)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedEvent(event);
              }
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: (index % 3) * 0.08,
              ease: "easeOut",
            }}
          >
            <EventArt event={event} />

            <div className="past-event-body">
              <span className="past-event-tag">{event.tag}</span>
              <h3 className="past-event-name">{event.name}</h3>
              <p className="past-event-desc">{event.description}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <PastEventModal
            key={selectedEvent.id}
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
