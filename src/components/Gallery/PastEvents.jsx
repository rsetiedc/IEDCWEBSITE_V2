import { motion } from "framer-motion";
import "./PastEvents.css";

/**
 * Gallery of Past Events — the flagship events of RSET IEDC & IIC RSET.
 *
 * Self-contained section (own component + own CSS) so the existing gallery
 * code (Gallery.jsx / Gallery.css) is never touched. To show real photos
 * later, drop images into src/assets/gallery/ and add an <img> in place of
 * the placeholder art area.
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
    name: "REDTAILS",
    tag: "Flagship Event",
    description:
      "A high-energy celebration of innovation, technology and student talent at RSET.",
  },
  {
    id: 5,
    name: "IGNIITE",
    tag: "Entrepreneurship",
    description:
      "A national-level entrepreneurship program igniting startup dreams among young minds.",
  },
  {
    id: 6,
    name: "START-IT-UP",
    tag: "Startup Showcase",
    description:
      "A platform where student startups pitch their ideas to win support and incubation.",
  },
  {
    id: 7,
    name: "FOUNDER'S JOURNEY",
    tag: "Talk Series",
    description:
      "An inspiring series of talks where founders share the highs, lows and lessons of building a startup.",
  },
];

export default function PastEvents() {
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
        </p>
      </div>

      <div className="past-events-grid">
        {PAST_EVENTS.map((event, index) => (
          <motion.article
            key={event.id}
            className="past-event-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: (index % 3) * 0.08,
              ease: "easeOut",
            }}
          >
            <div
              className={`past-event-art past-event-art-${event.id}`}
              aria-hidden="true"
            >
              <span className="past-event-art-letter">
                {event.name.charAt(0)}
              </span>
              <span className="past-event-art-num">
                {String(event.id).padStart(2, "0")}
              </span>
            </div>

            <div className="past-event-body">
              <span className="past-event-tag">{event.tag}</span>
              <h3 className="past-event-name">{event.name}</h3>
              <p className="past-event-desc">{event.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
