import { mapRowToEvent, clean } from "./eventsMapping.js";

/**
 * Baserow data source for the Events page.
 *
 * The events live in a Baserow database with two tables:
 *   1. The events table (default 1123078) — one row per event. Field names
 *      match the columns the event mapper (`eventsMapping.js`) expects.
 *   2. The "Event Contacts" table (default 1123079) — one row per event
 *      (primary field "ID" holds the event code), holding the event's
 *      contact people and phone numbers, linked back to the events table.
 *
 * Both tables are read with the database token below. The token is needed
 * client-side, so it is visible to visitors — keep it scoped to read-only in
 * Baserow. It can be overridden via the VITE_BASEROW_TOKEN env var.
 */
export const DEFAULT_BASEROW_TOKEN = "5QizEuQqqha4ViUdweWNCVuCo9S36RQx";
export const DEFAULT_EVENTS_TABLE_ID = 1123078;
export const DEFAULT_CONTACTS_TABLE_ID = 1123079;
export const BASEROW_API_BASE = "https://api.baserow.io/api";

/** Fetch every row of a Baserow table (follows pagination automatically). */
export async function fetchBaserowRows(tableId, token) {
  const rows = [];
  let url = `${BASEROW_API_BASE}/database/rows/table/${tableId}/?user_field_names=true&size=200`;

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Failed to load Baserow table ${tableId} (HTTP ${response.status}).`);
    }
    const data = await response.json();
    rows.push(...(data.results || []));
    url = data.next || null;
  }

  return rows;
}

/**
 * Fetch the events (table 1) and their contacts (table 2) and return the
 * mapped event list.
 *
 * The contacts table is the normalized source for the event's contact people:
 * it holds ONE ROW PER CONTACT PERSON, and the "Event" link field on each row
 * lists EVERY event that person serves (a person can be linked to several
 * events). A contact row is therefore attached to all of its linked events,
 * so a person shows up on every event they are linked to. The "ID" text
 * column is used only as a fallback when a row has no event links. Emails
 * only exist on the events table, so they are kept from there. When the
 * contacts table has no rows for an event, the event row's own contact
 * columns are kept as a fallback.
 */
export async function fetchBaserowEvents({
  token = DEFAULT_BASEROW_TOKEN,
  eventsTableId = DEFAULT_EVENTS_TABLE_ID,
  contactsTableId = DEFAULT_CONTACTS_TABLE_ID,
} = {}) {
  const [eventRows, contactRows] = await Promise.all([
    fetchBaserowRows(eventsTableId, token),
    fetchBaserowRows(contactsTableId, token),
  ]);

  // Group contact rows by event code, preserving row order. Each row's
  // "Event" link field lists every event it is linked to, so the row is
  // attached to all of those events.
  const contactsByCode = new Map();
  const attachToEvent = (row, code) => {
    if (!code) return;
    const list = contactsByCode.get(code) || [];
    list.push(row);
    contactsByCode.set(code, list);
  };

  for (const row of contactRows) {
    const linkedEvents = Array.isArray(row.Event) ? row.Event : [];
    if (linkedEvents.length > 0) {
      for (const link of linkedEvents) attachToEvent(row, clean(link.value));
    } else {
      attachToEvent(row, clean(row.ID));
    }
  }

  return eventRows
    .map((row) => {
      const merged = { ...row };
      const eventContacts = contactsByCode.get(clean(row["Field 1"]));
      if (eventContacts && eventContacts.length > 0) {
        // Join each contact column across all of the event's rows so the
        // mapper builds one contact per person (newline-separated).
        const join = (key) =>
          eventContacts.map((contact) => clean(contact[key])).filter(Boolean).join("\n");
        merged.Contact_Person = join("Contact_Person");
        merged.Contact_Phone = join("Contact_Phone");
        merged.Contact_Email = join("Contact_Email");
      }
      return mapRowToEvent(merged);
    })
    .filter(Boolean);
}
