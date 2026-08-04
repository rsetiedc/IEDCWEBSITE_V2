import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { mapRowToEvent } from "../src/services/eventsMapping.js";

const apiUrl = process.env.VITE_BASEROW_API_URL || "https://api.baserow.io/api";
const token = process.env.VITE_BASEROW_TOKEN || "";
const tableId = process.env.VITE_BASEROW_TABLE_ID || "";

if (!token || !tableId) {
  console.error("Missing VITE_BASEROW_TOKEN or VITE_BASEROW_TABLE_ID.");
  process.exit(1);
}

const url = `${apiUrl}/database/rows/table/${tableId}/?user_field_names=true&size=200`;
const response = await fetch(url, {
  headers: { Authorization: `Token ${token}` },
});

if (!response.ok) {
  console.error(`Baserow request failed: HTTP ${response.status}`);
  process.exit(1);
}

const data = await response.json();
const events = (data.results || []).map(mapRowToEvent);

const outPath = path.join(process.cwd(), "public", "events.json");
await fs.writeFile(outPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");
console.log(`Wrote ${events.length} events to ${outPath}`);
