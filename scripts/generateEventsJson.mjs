import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  getSheetCsvUrl,
  parseCsv,
  rowsToEventRows,
  DEFAULT_SHEET_ID,
  DEFAULT_SHEET_GID,
} from "../src/services/googleSheets.js";
import { mapRowToEvent } from "../src/services/eventsMapping.js";

const sheetId = process.env.VITE_EVENTS_SHEET_ID || DEFAULT_SHEET_ID;
const sheetGid = process.env.VITE_EVENTS_SHEET_GID || DEFAULT_SHEET_GID;

const outPath = path.join(process.cwd(), "public", "events.json");

const writeFallbackIfMissing = async (reason) => {
  try {
    await fs.access(outPath);
    console.warn(`${reason} Using existing snapshot at ${outPath}`);
    return;
  } catch {
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, "[]\n", "utf8");
    console.warn(`${reason} Wrote empty snapshot to ${outPath}`);
  }
};

const url = getSheetCsvUrl(sheetId, sheetGid);
const response = await fetch(url, { cache: "no-store" });

if (!response.ok) {
  await writeFallbackIfMissing(`Google Sheet request failed: HTTP ${response.status}.`);
  process.exit(0);
}

let text;
try {
  text = await response.text();
} catch (e) {
  await writeFallbackIfMissing(`Failed to read Google Sheet response: ${e?.message || e}.`);
  process.exit(0);
}

const events = rowsToEventRows(parseCsv(text)).map(mapRowToEvent).filter(Boolean);

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");
console.log(`Wrote ${events.length} events to ${outPath}`);
