# RSET IEDC AND IIC RSET Website V2

The official website of the **Innovation & Entrepreneurship Development Cell (IEDC)** and **IIC RSET** at Rajagiri School of Engineering & Technology. It highlights the cells' objectives, team, events, photo gallery, and annual reports.

## Project Overview

A single-page React application that serves as the digital home for the Innovation & Entrepreneurship Development Cell and the Institution's Innovation Council at RSET. Built as a fast, animated, and mobile-optimized site, it gives students, faculty, and visitors a window into the cells' activities, people, and achievements.

### Pages

- **Home** – Hero intro with an animated particle background, an overview of the cells, and a preview of the photo gallery.
- **About** – Mission, objectives, and background of both IEDC and IIC RSET.
- **Events** – Upcoming and past events, powered by live data from a Baserow database: the deployed page reads Baserow directly and auto-refreshes every ~15s, and the committed snapshot in `public/events.json` is only a fallback (see [`scripts/generateEventsJson.mjs`](scripts/generateEventsJson.mjs)). Note: the read-only Baserow token is embedded in the public client bundle via `VITE_BASEROW_TOKEN`, so keep it scoped to read-only access.
- **Team** – Profiles of the core team members.
- **Gallery** – Flagship event photo galleries and a scrolling image marquee.
- **Reports** – Annual and activity reports presented in a tabular format.
- **Contact** – Contact form and location details.

### Key Features

- Animated particle background (capped on mobile for low-power devices)
- Animated navigation with an active-page pill indicator and a mobile drawer
- Scroll-to-top and deep-link route restoration on page change
- Framer Motion–powered transitions and micro-interactions throughout
- Fully responsive, optimized for Android and iOS devices
- Deployed to GitHub Pages via a GitHub Actions workflow

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

## Tech Stack

- React 19
- Vite
- Framer Motion
- React Router
- React Icons
- Baserow (events data source)
