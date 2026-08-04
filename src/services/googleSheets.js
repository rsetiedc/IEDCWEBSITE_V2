import { mapRowToEvent } from "./eventsMapping.js";

// The events table lives in this publicly shared Google Sheet. The CSV export
// endpoint is CORS-enabled (Access-Control-Allow-Origin: *) and needs no API
// key or authentication, so it can be fetched straight from the browser.
export const DEFAULT_SHEET_ID = "1rZUeS3HQUzrKHRNR1nplt5cdkHWK0h-wDOsjmGSSHp4";
export const DEFAULT_SHEET_GID = "311663456";

/** Build the public CSV export URL for a sheet tab (gid). */
export function getSheetCsvUrl(sheetId = DEFAULT_SHEET_ID, gid = DEFAULT_SHEET_GID) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

/**
 * Minimal RFC-4180-style CSV parser. Handles quoted fields, escaped double
 * quotes, commas and literal newlines inside quotes, and CRLF endings.
 */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // Ignored — CRLF rows terminate at the \n.
    } else {
      field += ch;
    }
  }

  row.push(field);
  if (row.length > 1 || field !== "") rows.push(row);
  return rows;
}

/**
 * Turn parsed CSV rows into plain objects whose keys match the field names the
 * event mapper expects:
 *  - the first (unnamed) column holds the event code          -> "Field 1"
 *  - the trailing duplicate "Status" column holds the
 *    registration status (open/closed)                        -> "Status 2"
 * Every row also gets an `id` (1-based) used as a React key.
 */
export function rowsToEventRows(csvRows) {
  const [header, ...body] = csvRows;
  if (!header) return [];

  const keys = header.map((h, i) => {
    const name = String(h ?? "").trim();
    if (!name) return i === 0 ? "Field 1" : `Column_${i}`;
    // Second occurrence of "Status" is the registration-status column.
    if (name === "Status" && header.slice(0, i).some((p) => String(p).trim() === "Status")) {
      return "Status 2";
    }
    return name;
  });

  return body
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row, i) => {
      const obj = { id: i + 1 };
      keys.forEach((key, ci) => {
        obj[key] = String(row[ci] ?? "").trim();
      });
      return obj;
    });
}

/** Fetch the sheet and return the mapped event list. */
export async function fetchSheetEvents(sheetId = DEFAULT_SHEET_ID, gid = DEFAULT_SHEET_GID) {
  const response = await fetch(getSheetCsvUrl(sheetId, gid), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load events (HTTP ${response.status}).`);
  }
  const text = await response.text();
  return rowsToEventRows(parseCsv(text)).map(mapRowToEvent).filter(Boolean);
}
