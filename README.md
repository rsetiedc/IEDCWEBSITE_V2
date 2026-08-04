# RSET IEDC Website V2

The official website of the **Innovation & Entrepreneurship Development Cell (IEDC)** and **IIC RSET** at Rajagiri School of Engineering & Technology.

Built with **React + Vite**, the site showcases the cell's mission — *Think | Innovate | Inspire* — through sections for the hero, about, stats, events, gallery, team, and contact, featuring smooth animations powered by Framer Motion.

## Getting Started

```bash
  nix-shell -p nodejs_22 pnpm
  npm install
  npm run dev
```

## Scripts

```bash
  npm run dev      # start the dev server
  npm run build    # production build
  npm run preview  # preview the production build
  npm run lint     # run ESLint
```

## GitHub Pages Deployment

- The site is deployed from the `main` branch via `.github/workflows/deploy.yml`.
- Events come from a **publicly shared Google Sheet** (public CSV export — no API
  key or auth needed). Optionally override the sheet via
  `VITE_EVENTS_SHEET_ID` / `VITE_EVENTS_SHEET_GID` (env vars or repo
  **Settings → Variables**).
- On every deploy the workflow also regenerates `public/events.json`; if the fetch
  fails it keeps the committed snapshot, so the events page never goes blank.

## Live Events & Auto-Refresh

- The Events page prefers **live data from the Google Sheet** (dev and production
  alike). Edits saved in the sheet show up automatically: the page re-checks every
  60 seconds (override with `VITE_EVENTS_REFRESH_MS`, in ms — set `0` to disable),
  re-syncs when you switch back to the browser tab, and has a manual refresh
  button.
- `public/events.json` is only a fallback for when the sheet is unreachable.
- Rows with no title **and** no code (empty drafts) are filtered out and never
  shown on the site.

## Event Posters

Poster images are loaded by the visitor's browser, so they must be reachable without
any login:

- **Google Drive** – the file must be shared as *Anyone with the link → Viewer*
  (private files can never render on a public static site). Paste the Drive link
  into the sheet's *Cover Image* cell.
- **Repo hosting (no external host)** – drop the image in `public/posters/` and put
  `/posters/your-file.jpg` in the sheet's *Cover Image* cell.

## Tech Stack

- React 19
- Vite
- Framer Motion
- React Router
- React Icons
