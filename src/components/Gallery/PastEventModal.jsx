import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { getGalleryPhotos } from "../../services/galleryPhotos";

// Every event shows 5–7 photo slots.
const MIN_SLOTS = 6;
const MAX_SLOTS = 7;

/**
 * PastEventModal — photo viewer for one flagship event.
 *
 * Photos are managed by developers in src/services/galleryPhotos.js — paste
 * image URLs into that file to publish them. Until then, the slots show
 * "Yet to arrive". Click a photo to view it large (prev/next + arrows).
 */
export default function PastEventModal({ event, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previewBackRef = useRef(null);
  const lastTileRef = useRef(null);

  const [previewIndex, setPreviewIndex] = useState(null);

  const photos = useMemo(() => getGalleryPhotos(event.name), [event.name]);

  // Refs keep the stable keydown handler below from reading stale values.
  // (updated in an effect — updating refs during render is disallowed)
  const previewIndexRef = useRef(previewIndex);
  const photosLengthRef = useRef(photos.length);
  useEffect(() => {
    previewIndexRef.current = previewIndex;
    photosLengthRef.current = photos.length;
  });

  // 5–7 slots: at least MIN_SLOTS, capped at MAX_SLOTS.
  const slotCount = Math.min(MAX_SLOTS, Math.max(MIN_SLOTS, photos.length));
  const slots = Array.from({ length: slotCount }, (_, i) => photos[i] ?? null);

  // Move focus into the preview when it opens, back to the source tile when
  // it closes (a11y — the grid unmounts while the preview is open).
  useEffect(() => {
    if (previewIndex !== null) {
      previewBackRef.current?.focus();
    } else if (lastTileRef.current) {
      lastTileRef.current.focus?.();
      lastTileRef.current = null;
    }
  }, [previewIndex]);

  // Open / a11y: focus close button, lock scroll, ESC + arrow keys, focus trap.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (previewIndexRef.current !== null) setPreviewIndex(null);
        else onClose();
        return;
      }
      if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        previewIndexRef.current !== null
      ) {
        if (photosLengthRef.current > 1) {
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          setPreviewIndex(
            (i) => (i + dir + photosLengthRef.current) % photosLengthRef.current
          );
        }
        return;
      }
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
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="past-event-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        ref={dialogRef}
        className="past-event-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${event.name} photos`}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Header ---------- */}
        <header className="past-event-modal-head">
          <div className="past-event-modal-heading">
            <span className="past-event-modal-tag">{event.tag}</span>
            <h3 className="past-event-modal-title">{event.name}</h3>
            <p className="past-event-sr-only" aria-live="polite">
              {photos.length === 0
                ? "No photos yet."
                : `${photos.length} photo${photos.length === 1 ? "" : "s"}.`}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="past-event-modal-close"
            onClick={onClose}
            aria-label="Close photo viewer"
          >
            <FiX aria-hidden="true" />
          </button>
        </header>

        {previewIndex !== null && photos[previewIndex] ? (
          /* ---------- Large image preview ---------- */
          <div className="past-event-preview">
            {photos.length > 1 && (
              <button
                type="button"
                className="past-event-preview-nav prev"
                onClick={() =>
                  setPreviewIndex((i) => (i - 1 + photos.length) % photos.length)
                }
                aria-label="Previous photo"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
            )}
            <img
              src={photos[previewIndex]}
              alt={`${event.name} photo ${previewIndex + 1}`}
              referrerPolicy="no-referrer"
              decoding="async"
              onClick={() => setPreviewIndex(null)}
            />
            {photos.length > 1 && (
              <button
                type="button"
                className="past-event-preview-nav next"
                onClick={() =>
                  setPreviewIndex((i) => (i + 1) % photos.length)
                }
                aria-label="Next photo"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            )}
            <span className="past-event-preview-count">
              {previewIndex + 1} / {photos.length}
            </span>
            <button
              ref={previewBackRef}
              type="button"
              className="past-event-preview-back"
              onClick={() => setPreviewIndex(null)}
            >
              Back to gallery
            </button>
          </div>
        ) : (
          /* ---------- Photo grid ---------- */
          <div className="past-event-modal-grid">
            {slots.map((url, index) =>
              url ? (
                <div
                  key={url}
                  className="past-event-photo"
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${event.name} photo ${index + 1}`}
                  onClick={(e) => {
                    lastTileRef.current = e.currentTarget;
                    setPreviewIndex(photos.indexOf(url));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      lastTileRef.current = e.currentTarget;
                      setPreviewIndex(photos.indexOf(url));
                    }
                  }}
                >
                  <img
                    src={url}
                    alt={`${event.name} photo ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <span className="past-event-photo-num" aria-hidden="true">
                    {index + 1}
                  </span>
                </div>
              ) : (
                <div
                  key={`empty-${index}`}
                  className="past-event-photo past-event-photo-empty"
                  aria-hidden="true"
                >
                  <FiCamera className="past-event-photo-empty-icon" />
                  <span>Yet to arrive</span>
                </div>
              )
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
