const OPEN_STATUSES = ["active", "open", "upcoming", "ongoing", "live"];

export const clean = (value) => (value == null ? "" : String(value).trim());

export const splitList = (value) =>
  clean(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

export function resolveImageUrl(raw) {
  const unwrap = (value) => {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value).trim();
    }
    if (Array.isArray(value)) {
      return unwrap(value[0]);
    }
    if (typeof value === "object") {
      return unwrap(
        value.url ||
          value.download_url ||
          value.thumbnails?.large?.url ||
          value.thumbnails?.card_cover?.url ||
          value.thumbnails?.small?.url ||
          ""
      );
    }
    return "";
  };

  const value = unwrap(raw);
  if (!value) return "";

  const driveIdMatch =
    value.match(
      /drive\.google\.com\/(?:file\/d\/|(?:uc|open|file|edit|thumbnail)\?[^#]*\bid=)([A-Za-z0-9_-]+)/
    ) || value.match(/lh3\.googleusercontent\.com\/d\/([A-Za-z0-9_-]+)/);

  if (driveIdMatch) {
    // Serve Drive images through Google's image CDN (lh3.googleusercontent.com),
    // which is fast and reliable for hotlinking — unlike drive.usercontent.google.com
    // downloads, which many networks and ad blockers throttle. The =w1600 suffix
    // requests a max-width thumbnail to keep the page light.
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=w1600`;
  }
  // Accept absolute URLs as well as site-relative paths (e.g. "/posters/event.jpg"
  // stored in the repo's public/ folder — these render without any external host).
  return /^(https?:\/\/|\/)/i.test(value) ? value : "";
}

export const resolvePosterUrl = (raw) => resolveImageUrl(raw);

export function formatEventDate(start, end) {
  const parse = (raw) => {
    const date = new Date(`${clean(raw)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const startDate = parse(start);
  const endDate = parse(end);
  if (!startDate) return clean(start) || "TBA";

  const fmt = (date) =>
    date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (endDate && endDate.getTime() !== startDate.getTime()) {
    // Show both dates in full (month, day, year) so the end date is never
    // ambiguous or incomplete — e.g. "August 10, 2026 – August 12, 2026".
    return `${fmt(startDate)} – ${fmt(endDate)}`;
  }
  return fmt(startDate);
}

export function formatEventTime(start, end) {
  const to12 = (raw) => {
    const match = clean(raw).match(/^(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const [hours, minutes] = [Number(match[1]), Number(match[2])];
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
  };

  const startTime = to12(start);
  const endTime = to12(end);
  if (!startTime) return clean(start) || "TBA";
  return endTime ? `${startTime} – ${endTime}` : startTime;
}

export function isOpenEvent(row) {
  const status2 = clean(row["Status 2"]).toLowerCase();
  const status = clean(row.Status).toLowerCase();

  if (OPEN_STATUSES.some((value) => status2.includes(value))) return true;
  if (!status2 && OPEN_STATUSES.some((value) => status.includes(value))) return true;
  return false;
}

export function buildContacts(row) {
  const names = splitList(row.Contact_Person);
  const phones = splitList(row.Contact_Phone);
  const emails = splitList(row.Contact_Email);
  const count = Math.max(names.length, phones.length, emails.length);

  // One contact per person, zipped across the three columns. Returns an
  // empty array when the event has no contact data at all — nothing is
  // displayed for events with no contacts listed.
  return Array.from({ length: count }, (_, i) => ({
    name: names[i] || "Contact",
    phone: phones[i] || "",
    email: emails[i] || "",
  }));
}

export function mapRowToEvent(row) {
  const code = clean(row["Field 1"]);
  const title = clean(row.Event_Title);

  // Skip placeholder/draft rows that have no content at all — e.g. an empty
  // row accidentally left in the table. Without this they would render as
  // empty "Event <id>" cards.
  if (!title && !code) return null;

  const poster = resolvePosterUrl(row.Cover_Image);
  const regForm = clean(row.Reg_Form);
  const regSheet = clean(row.Reg_sheet);

  return {
    id: row.id,
    code,
    title: title || `Event ${row.id}`,
    eventType: clean(row.Event_Type),
    category: clean(row.Category),
    description: clean(row.Short_Description) || clean(row.Detailed_Description),
    detailedDescription: clean(row.Detailed_Description),
    poster,
    date: formatEventDate(row.Start_Date, row.End_Date),
    time: formatEventTime(row.Start_Time, row.End_Time),
    venue: clean(row.Venue) || "To be announced",
    organizer: clean(row.Organizer) || "RSET IEDC",
    audience: clean(row.Target_Audience) || "All",
    contacts: buildContacts(row),
    isOpen: isOpenEvent(row),
    registrationStatus: clean(row["Status 2"]) || clean(row.Status),
    capacity: clean(row.Capacity),
    deadline: clean(row.Registration_Deadline),
    tags: splitList(row.Tags),
    keyTopics: splitList(row.Key_Topics),
    registrationLink: regForm || regSheet || "",
  };
}
