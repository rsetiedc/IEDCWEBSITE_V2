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
- Events come from a Baserow database. On every deploy the workflow regenerates
  `public/events.json`; if the fetch fails it keeps the committed snapshot, so the
  events page never goes blank.
- To auto-refresh events on every push, add these secrets under
  **repo Settings → Secrets and variables → Actions** (same values as your local `.env`):
  `VITE_BASEROW_API_URL`, `VITE_BASEROW_TOKEN`, `VITE_BASEROW_TABLE_ID`.

## Event Posters

Poster images are loaded by the visitor's browser, so they must be reachable without
any login:

- **Google Drive** – the file must be shared as *Anyone with the link → Viewer*
  (private files can never render on a public static site).
- **Repo hosting (no external host)** – drop the image in `public/posters/` and put
  `/posters/your-file.jpg` in the Baserow *Cover Image* cell.
- **Baserow file field** – upload the image directly into the Cover Image cell;
  Baserow serves it from its public CDN.

## Tech Stack

- React 19
- Vite
- Framer Motion
- React Router
- React Icons
