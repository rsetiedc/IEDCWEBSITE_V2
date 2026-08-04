import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { mapRowToEvent } from "../src/services/eventsMapping.js";

const apiUrl = process.env.VITE_BASEROW_API_URL || "https://api.baserow.io/api";
const token = process.env.VITE_BASEROW_TOKEN || "";
const tableId = process.env.VITE_BASEROW_TABLE_ID || "";

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

if (!token || !tableId) {
  await writeFallbackIfMissing("Missing VITE_BASEROW_TOKEN or VITE_BASEROW_TABLE_ID.");
  process.exit(0);
}

const url = `${apiUrl}/database/rows/table/${tableId}/?user_field_names=true&size=200`;
const response = await fetch(url, {
  headers: { Authorization: `Token ${token}` },
});

if (!response.ok) {
  await writeFallbackIfMissing(`Baserow request failed: HTTP ${response.status}.`);
  process.exit(0);
}

let data;
try {
  data = await response.json();
} catch (e) {
  await writeFallbackIfMissing(`Failed to parse Baserow response: ${e?.message || e}.`);
  process.exit(0);
}

const events = (data.results || []).map(mapRowToEvent);

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");
console.log(`Wrote ${events.length} events to ${outPath}`);
