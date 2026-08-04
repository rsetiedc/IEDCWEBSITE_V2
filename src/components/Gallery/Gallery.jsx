import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX, FiZoomIn } from "react-icons/fi";
import "./Gallery.css";

// ─────────────────────────────────────────────────────────────────────────────
//  Flagship event photos — PLACEHOLDER SVGs.
//  To swap in the real photos: drop your images into src/assets/gallery/ and
//  update the import paths below (e.g. "./iedc-summit.svg" → "./iedc-summit.jpg").
// ─────────────────────────────────────────────────────────────────────────────
import iedcSummit from "../../assets/gallery/iedc-summit.svg";
import iicRegionalMeet from "../../assets/gallery/iic-regional-meet.svg";
import hacksus from "../../assets/gallery/hacksus.svg";
import redtails from "../../assets/gallery/redtails.svg";
import igniite from "../../assets/gallery/igniite.svg";
import startItUp from "../../assets/gallery/start-it-up.svg";
import foundersJourney from "../../assets/gallery/founders-journey.svg";

const events = [
  {
    id: 1,
    title: "IEDC SUMMIT",
    tag: "Flagship Summit",
    description:
      "The annual flagship summit uniting innovators, founders and the RSET community for a day of ideas and inspiration.",
    src: iedcSummit,
  },
  {
    id: 2,
    title: "IIC REGIONAL MEET",
    tag: "Regional Meet",
    description:
      "A regional gathering of Institution's Innovation Council members, sharing best practices in nurturing innovation.",
    src: iicRegionalMeet,
  },
  {
    id: 3,
    title: "HACKSUS",
    tag: "Hackathon",
    description:
      "RSET's signature hackathon where student teams build, break and ship ideas in a marathon of code and creativity.",
    src: hacksus,
  },
  {
    id: 4,
    title: "REDTAILS",
    tag: "Flagship Event",
    description:
      "A high-energy celebration of innovation, technology and student talent at RSET.",
    src: redtails,
  },
  {
    id: 5,
    title: "IGNIITE",
    tag: "Entrepreneurship",
    description:
      "A national-level entrepreneurship program igniting startup dreams among young minds.",
    src: igniite,
  },
  {
    id: 6,
    title: "START-IT-UP",
    tag: "Startup Showcase",
    description:
      "A platform where student startups pitch their ideas to win support and incubation.",
    src: startItUp,
  },
  {
    id: 7,
    title: "FOUNDER'S JOURNEY",
    tag: "Talk Series",
    description:
      "An inspiring series of talks where founders share the highs, lows and lessons of building a startup.",
    src: foundersJourney,
  },
];

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const open = (index) => {
    lastFocusedRef.current = document.activeElement;
    setActiveIndex(index);
  };
  const close = () => {
    setActiveIndex(null);
    // Return focus to the card that opened the lightbox
    lastFocusedRef.current?.focus();
    lastFocusedRef.current = null;
  };
  const next = () => setActiveIndex((i) => (i + 1) % events.length);
  const prev = () => setActiveIndex((i) => (i - 1 + events.length) % events.length);

  // Move focus into the lightbox when it opens
  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  // Keyboard navigation for the lightbox (Escape / arrow keys) + scroll lock
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <main className="gallery-page">
      {/* ============ Section 1: Hero ============ */}
      <section className="gallery-hero">
        <motion.span
          className="gallery-tag"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gallery
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          OUR FLAGSHIP EVENTS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A glimpse into the milestone moments that define the entrepreneurial
          spirit at RSET IEDC — from summits and hackathons to founder stories.
        </motion.p>
      </section>

      {/* ============ Section 2: Flagship event grid ============ */}
      <section className="gallery-content">
        <motion.div
          className="gallery-grid"
          initial="hidden"
          animate="show"
          variants={gridVariants}
        >
          {events.map((event, index) => (
            <motion.button
              key={event.id}
              type="button"
              className="gallery-card"
              variants={cardVariants}
              onClick={() => open(index)}
              aria-label={`View ${event.title} photo`}
            >
              <img
                src={event.src}
                alt={`${event.title} — ${event.tag}`}
                loading="lazy"
              />
              <div className="gallery-card-overlay" aria-hidden="true" />

              <span className="gallery-card-badge">{event.tag}</span>

              <span className="gallery-card-view" aria-hidden="true">
                <FiZoomIn /> View Photo
              </span>

              <div className="gallery-card-caption">
                <h3 className="gallery-card-title">{event.title}</h3>
                <p className="gallery-card-desc">{event.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <p className="gallery-note">
          Sample images are shown while final event photographs are being
          collected.
        </p>
      </section>

      {/* ============ Section 3: Lightbox ============ */}
      <AnimatePresence>
        {isOpen && (
          <GalleryLightbox
            event={events[activeIndex]}
            index={activeIndex}
            total={events.length}
            onClose={close}
            onPrev={prev}
            onNext={next}
            closeRef={closeBtnRef}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function GalleryLightbox({ event, index, total, onClose, onPrev, onNext, closeRef }) {
  return (
    <motion.div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className="gallery-lightbox-close"
        onClick={onClose}
        aria-label="Close photo viewer"
      >
        <FiX />
      </button>

      <button
        type="button"
        className="gallery-lightbox-nav prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photo"
      >
        <FiChevronLeft />
      </button>

      <figure
        className="gallery-lightbox-figure"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          key={event.id}
          src={event.src}
          alt={`${event.title} — ${event.tag}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <figcaption>
          <span className="gallery-lightbox-tag">{event.tag}</span>
          <span className="gallery-lightbox-title">{event.title}</span>
          <span className="gallery-lightbox-counter">
            {index + 1} / {total}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="gallery-lightbox-nav next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next photo"
      >
        <FiChevronRight />
      </button>
    </motion.div>
  );
}
