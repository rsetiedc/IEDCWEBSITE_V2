import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  fetchBaserowEvents,
  DEFAULT_BASEROW_TOKEN,
  DEFAULT_EVENTS_TABLE_ID,
  DEFAULT_CONTACTS_TABLE_ID,
} from "../src/services/baserow.js";

const token = process.env.VITE_BASEROW_TOKEN || DEFAULT_BASEROW_TOKEN;
const eventsTableId =
  Number(process.env.VITE_BASEROW_EVENTS_TABLE_ID) || DEFAULT_EVENTS_TABLE_ID;
const contactsTableId =
  Number(process.env.VITE_BASEROW_CONTACTS_TABLE_ID) || DEFAULT_CONTACTS_TABLE_ID;

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

let events;
try {
  events = await fetchBaserowEvents({ token, eventsTableId, contactsTableId });
} catch (e) {
  await writeFallbackIfMissing(`Baserow request failed: ${e?.message || e}.`);
  process.exit(0);
}

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");
console.log(`Wrote ${events.length} events to ${outPath}`);
