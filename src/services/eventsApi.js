import { fetchSheetEvents, DEFAULT_SHEET_ID, DEFAULT_SHEET_GID } from "./googleSheets.js";

// The events table lives in a publicly shared Google Sheet. These are
// overridable via env vars but default to the shared sheet, so the site works
// without any configuration.
const SHEET_ID = import.meta.env.VITE_EVENTS_SHEET_ID || DEFAULT_SHEET_ID;
const SHEET_GID = import.meta.env.VITE_EVENTS_SHEET_GID || DEFAULT_SHEET_GID;

async function fetchEventsFromSnapshot() {
  const url = `${import.meta.env.BASE_URL}events.json`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load events snapshot (HTTP ${response.status}).`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid events snapshot format.");
  }
  return data;
}

/**
 * Prefix site-relative poster paths (e.g. "/posters/x.jpg" stored in
 * public/) with the app's base path so they resolve correctly on subpath
 * deployments like GitHub Pages. Browser-only, so import.meta.env is safe.
 */
const resolvePosterBasePath = (events) =>
  events.map((event) => {
    if (!event.poster || !event.poster.startsWith("/")) return event;
    return { ...event, poster: `${import.meta.env.BASE_URL}${event.poster.slice(1)}` };
  });

export async function fetchEvents() {
  // Prefer LIVE data from the Google Sheet (public CSV export, CORS-enabled)
  // so edits saved in the sheet show up automatically without a redeploy.
  // The committed events.json snapshot is only a fallback for when the sheet
  // is unreachable or Google is temporarily unavailable.
  try {
    return resolvePosterBasePath(await fetchSheetEvents(SHEET_ID, SHEET_GID));
  } catch (err) {
    try {
      return resolvePosterBasePath(await fetchEventsFromSnapshot());
    } catch {
      throw err; // surface the live-fetch error so the UI can offer a retry
    }
  }
}
