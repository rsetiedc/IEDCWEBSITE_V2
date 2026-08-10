/**
 * Photo links for the flagship events on the Gallery page.
 *
 * Photos are loaded dynamically from src/assets/gallery/events_page/ using
 * Vite's import.meta.glob. Each event folder contains an `optimized/`
 * subfolder with web-ready copies (JPEG, max 1920px) of every photo in that
 * event:
 *   - iedc_summit_2023       → IEDC SUMMIT
 *   - iic_regional_meet_2025 → IIC REGIONAL MEET
 *   - hacksus                → HACKSUS
 *   - start_it_up            → START-IT-UP
 *   - igniite                → IGNIITE
 *
 * The original, large files (JPG/PNG/HEIC/NEF) stay untouched next to the
 * `optimized/` folder and are deliberately NOT loaded — so every event photo
 * is shown exactly once, in a size that loads fast on mobile.
 */

// Vite glob pattern: eagerly import the optimized JPEG copies of every event.
const imageModules = import.meta.glob(
  "../assets/gallery/events_page/*/optimized/*.{jpg,jpeg,JPG,JPEG}",
  { eager: true, import: "default" }
);

// Map folder names to event names (must match PAST_EVENTS in PastEvents.jsx)
const FOLDER_TO_EVENT = {
  iedc_summit_2023: "IEDC SUMMIT",
  iic_regional_meet_2025: "IIC REGIONAL MEET",
  hacksus: "HACKSUS",
  start_it_up: "START-IT-UP",
  igniite: "IGNIITE",
  mad: "MAD",
};

/**
 * Build a lookup: event name → array of image URLs.
 * We iterate over the glob results, extract the event folder name from each
 * path, map it to the canonical event name, and collect the URLs.
 */
function buildPhotoMap() {
  const map = {};

  for (const [filePath, imageUrl] of Object.entries(imageModules)) {
    // Extract the event folder from the path, e.g.:
    // ".../events_page/hacksus/optimized/IMG_4150.jpg" → "hacksus"
    const match = filePath.match(/events_page\/([^/]+)\/optimized\//);
    if (!match) continue;

    const folderName = match[1];
    const eventName = FOLDER_TO_EVENT[folderName];
    if (!eventName) continue; // Unknown folder — skip

    if (!map[eventName]) map[eventName] = [];
    map[eventName].push(imageUrl);
  }

  // Sort photos within each event for consistent ordering
  for (const eventName of Object.keys(map)) {
    map[eventName].sort((a, b) => a.localeCompare(b));
  }

  return map;
}

// Build the photo map once at module load time
const GALLERY_PHOTOS = buildPhotoMap();

/**
 * Photo URLs for an event (auto-loaded from the events_page folder).
 * @param {string} eventName — must match the name in PAST_EVENTS
 * @returns {string[]} array of image URLs (empty if no photos found)
 */
export function getGalleryPhotos(eventName) {
  return (GALLERY_PHOTOS[eventName] || []).slice();
}

/**
 * Cover photo URL for an event.
 * If a custom cover photo is defined for an event, it will use that photo;
 * otherwise, it defaults to the first image in its folder.
 * Returns null if the event has no photos.
 * @param {string} eventName
 * @returns {string|null}
 */
export function getEventCoverPhoto(eventName) {
  const photos = GALLERY_PHOTOS[eventName];
  if (!photos || photos.length === 0) return null;

  if (eventName === "IEDC SUMMIT") {
    const specificCover = photos.find((url) => url.includes("Summit2023_2.jpg"));
    if (specificCover) return specificCover;
  }

  return photos[0];
}
