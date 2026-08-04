import { mapRowToEvent } from "./eventsMapping";

const API_URL = import.meta.env.VITE_BASEROW_API_URL || "https://api.baserow.io/api";
const TOKEN = import.meta.env.VITE_BASEROW_TOKEN || "";
const TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_ID || "";

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

async function fetchEventsFromBaserow() {
  if (!TOKEN || !TABLE_ID) {
    throw new Error("Baserow credentials are missing.");
  }

  const url = `${API_URL}/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200`;
  const response = await fetch(url, {
    headers: { Authorization: `Token ${TOKEN}` },
    // Never serve a stale browser-cached response — the Events page refreshes
    // on an interval and must always see the latest saved content.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load events (HTTP ${response.status}).`);
  }

  const data = await response.json();
  return (data.results || []).map(mapRowToEvent).filter(Boolean);
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
  // Prefer LIVE Baserow data whenever credentials are configured (dev and
  // production alike) so edits saved in the database show up automatically
  // without a redeploy. The committed events.json snapshot is only a fallback
  // for when the API is unreachable or credentials are missing.
  if (TOKEN && TABLE_ID) {
    try {
      return resolvePosterBasePath(await fetchEventsFromBaserow());
    } catch (err) {
      try {
        return resolvePosterBasePath(await fetchEventsFromSnapshot());
      } catch {
        throw err; // surface the live-fetch error so the UI can offer a retry
      }
    }
  }

  return resolvePosterBasePath(await fetchEventsFromSnapshot());
}
