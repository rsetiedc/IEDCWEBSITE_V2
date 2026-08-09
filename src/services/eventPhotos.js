/**
 * Manually curated event photos.
 *
 * Event photos live in this file — NOT in the events database — so they are
 * hand-maintained in the codebase. The map is keyed by the event code (the
 * "Field 1" column in the events database), which stays stable even if rows
 * are reordered or retitled.
 *
 * How to add photos for an event:
 *   1. Drop the images into `public/event-photos/<CODE>/` (e.g. IEDC001).
 *   2. List them under that code below, one per line:
 *        IEDC001: [
 *          "/event-photos/IEDC001/group-photo.jpg",
 *          "/event-photos/IEDC001/activity.jpg",
 *        ],
 *   3. Commit and deploy. Absolute URLs also work (e.g. Drive files shared
 *      as "Anyone with the link").
 *
 * Events with no photos simply omit the gallery in the event modal and the
 * photo-count badge on the event card.
 */
const EVENT_PHOTOS = {
  // NOTE: currently seeded with each event's poster so the gallery and photo
  // count badge render immediately. Replace/expand with real photos as
  // described above.
  IEDC001: [
    "https://lh3.googleusercontent.com/d/1q6vPaP_0T2s1TBv_md8Ng_8FNwmKS82y=w1600",
  ],
  IEDC002: [
    "https://lh3.googleusercontent.com/d/1-nIROkCg1rN4wex3P0ObFggFXAQNrL4y=w1600",
  ],
  IEDC003: [
    "https://lh3.googleusercontent.com/d/1QH4t_KtbN8nGSD-iQZVngVQRap2PLeF9=w1600",
  ],
  IEDC004: [
    "https://lh3.googleusercontent.com/d/1jk1wTVXSc8-m8BpmZD5VjGvP_Wm7aAKo=w1600",
  ],
  IEDC005: [
    "https://lh3.googleusercontent.com/d/1-R_8TNyaXCd2dzQRUC7X7IQRGePuuuma=w1600",
  ],
  IEDC006: [
    "https://lh3.googleusercontent.com/d/1l2XEI8xcu2GFbyCoBS8Z-0AEVRECH0MG=w1600",
  ],
};

/** Return the curated photo list for an event (empty array when none). */
export function getEventPhotos(event) {
  const photos = event?.code ? EVENT_PHOTOS[event.code] : undefined;
  return Array.isArray(photos) ? [...photos] : [];
}
