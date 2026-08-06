/**
 * Photo links for the flagship events on the Gallery page.
 *
 * Event photos are not available yet, so every event currently has an empty
 * list and the viewer shows "Yet to arrive" placeholders.
 *
 * ── How developers publish photos ──────────────────────────────────────────
 * Photo links are managed in code — paste public image URLs into that
 * event's array below. Any direct image link works, e.g.:
 *   - Google Drive: "https://lh3.googleusercontent.com/d/<FILE_ID>=w1600"
 *     (the file must be shared as *Anyone with the link → Viewer*)
 *   - Repo files:   "/posters/iedc-summit-1.jpg" (drop the image in public/)
 *   - Any other:    "https://example.com/photo.jpg"
 *
 *   "IEDC SUMMIT": [
 *     "https://lh3.googleusercontent.com/d/...=w1600",
 *     "/posters/iedc-summit-1.jpg",
 *   ],
 *
 * Each event's viewer shows 5–7 photo slots (up to 7 photos per event);
 * filled slots display the linked image, empty ones show "Yet to arrive".
 * ───────────────────────────────────────────────────────────────────────────
 */
const GALLERY_PHOTOS = {
  "IEDC SUMMIT": [],
  "IIC REGIONAL MEET": [],
  HACKSUS: [],
  REDTAILS: [],
  IGNIITE: [],
  "START-IT-UP": [],
  "FOUNDER'S JOURNEY": [],
};

/** Photo URLs for an event (managed by developers in this file). */
export function getGalleryPhotos(eventName) {
  return (GALLERY_PHOTOS[eventName] || []).slice();
}
