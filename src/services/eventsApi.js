import {
  fetchBaserowEvents,
  DEFAULT_BASEROW_TOKEN,
  DEFAULT_EVENTS_TABLE_ID,
  DEFAULT_CONTACTS_TABLE_ID,
} from "./baserow.js";
import { getEventPhotos } from "./eventPhotos.js";

// The events live in a Baserow database (events table + linked contacts
// table). These are overridable via env vars but default to the configured
// database, so the site works without any setup.
const BASEROW_TOKEN = import.meta.env.VITE_BASEROW_TOKEN || DEFAULT_BASEROW_TOKEN;
const EVENTS_TABLE_ID =
  Number(import.meta.env.VITE_BASEROW_EVENTS_TABLE_ID) || DEFAULT_EVENTS_TABLE_ID;
const CONTACTS_TABLE_ID =
  Number(import.meta.env.VITE_BASEROW_CONTACTS_TABLE_ID) || DEFAULT_CONTACTS_TABLE_ID;

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
 * Prefix site-relative image paths (e.g. "/posters/x.jpg" stored in
 * public/) with the app's base path so they resolve correctly on subpath
 * deployments like GitHub Pages. Applies to the poster and every event photo.
 * Browser-only, so import.meta.env is safe.
 */
const withBase = (url) =>
  url && url.startsWith("/") ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;

const resolveMediaBasePath = (events) =>
  events.map((event) => ({
    ...event,
    poster: withBase(event.poster),
    photos: (event.photos || []).map(withBase),
  }));

/**
 * Attach the manually curated event photos (src/services/eventPhotos.js) to
 * each event. These are codebase-managed — never read from Baserow.
 */
const withEventPhotos = (events) =>
  events.map((event) => ({ ...event, photos: getEventPhotos(event) }));

export async function fetchEvents() {
  // Prefer LIVE data from Baserow (CORS-enabled REST API) so edits saved in
  // the database show up automatically without a redeploy. The committed
  // events.json snapshot is only a fallback for when Baserow is unreachable.
  try {
    const events = await fetchBaserowEvents({
      token: BASEROW_TOKEN,
      eventsTableId: EVENTS_TABLE_ID,
      contactsTableId: CONTACTS_TABLE_ID,
    });
    return resolveMediaBasePath(withEventPhotos(events));
  } catch (err) {
    try {
      return resolveMediaBasePath(withEventPhotos(await fetchEventsFromSnapshot()));
    } catch {
      throw err; // surface the live-fetch error so the UI can offer a retry
    }
  }
}
