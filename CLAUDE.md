# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A static wedding invitation website for **Sridharan & Sangeetha** (wedding date: December 14, 2025). Built as a single-page application with no build step, no npm dependencies, and no backend. Deployed via Firebase Hosting.

## Development Workflow

```bash
# Preview locally (no build needed — static files)
python3 -m http.server 8000
# Then open http://localhost:8000

# Deploy to Firebase Hosting
firebase deploy
```

There is no package.json, no linting config, and no test suite. All changes are made directly to HTML/CSS/JS files.

## Architecture

### File Structure
- **`index.html`** — Single-page wedding site. Contains all sections: loader, hero, about, our-story, events, gallery, RSVP, blessings.
- **`css/styles.css`** — Global styles, CSS custom properties (`:root` variables for the lavender theme), animations, and reset.
- **`css/components.css`** — Component-specific styles (profile cards, countdown, RSVP form, gallery, etc.).
- **`js/main.js`** — All interactive JavaScript (vanilla ES6+, no framework): loader/music control, navigation, countdown timer, Three.js background, RSVP form submission.
- **`images/`** — Couple photos (`sangeetha.jpg`, `sridharan.jpg`), event cards (`card-1.jpg` through `card-8.jpg`), QR codes, and social preview thumbnails.
- **`audio/wedding-song.mp3`** — Background music ("Anbil Avan" Tamil song).
- **`firebase.json`** — Hosting config; rewrites all routes to `index.html`.
- **`.firebaserc`** — Firebase project alias (`default` → `disneyplus-clone-19a4e`).

### Key Dependencies (CDN, not bundled)
- **Three.js (r128)** — Renders animated 3D lavender hearts in the background (`#three-background`).
- **AOS 2.3.1** — Scroll-triggered fade-in animations via `data-aos` attributes.
- **Font Awesome 6.5.1** — Icons.
- **Google Fonts** — Great Vibes (cursive), Playfair Display (serif), Montserrat (sans).

### Color Theme (CSS Variables in `styles.css:2-13`)
```css
--primary-color: #ede6f7;      /* Light Violet */
--secondary-color: #b89fdb;    /* Medium Light Violet */
--accent-color: #9b7ec7;       /* Medium Violet */
--dark-violet: #4b2067;        /* Dark Violet */
--darker-purple: #2d1b3d;      /* Darker Purple */
--text-color: #ede6f7;         /* Light Text */
--text-dark: #2d1b3d;          /* Dark Text */
```

### JavaScript Modules in `main.js`
1. **Loader & Music Control** (lines 1–182) — Vinyl record animation, play button, audio autoplay handling with fallback to manual toggle.
2. **Navigation** (lines 184–221) — Scroll detection, mobile menu toggle, smooth scrolling.
3. **Countdown Timer** (lines 223–268) — Counts down to `2025-12-13T23:11:00`; shows "The Music Plays Today!" when expired.
4. **Three.js Background** (lines 270–416) — Two rotating/animating 3D heart meshes with gradient material and mouse parallax.
5. **RSVP Form** (lines 418–504) — Validates event selection, constructs a `mailto:` link to `sangeethapandian6@gmail.com`, shows success message.

### RSVP Flow
The RSVP form does **not** use a backend. On submit, it opens the user's email client via `mailto:` with pre-filled subject/body. The success message is shown but no data is persisted server-side.

### Firebase Hosting
- `public` directory is the repo root (`.`).
- All paths rewrite to `index.html` (SPA-style fallback).
- Deploy with `firebase deploy` (requires authenticated Firebase CLI with access to the `disneyplus-clone-19a4e` project).

## Notes
- Image paths in CSS use relative references (`../images/...`). Keep `images/` at the repo root.
- The `n/` and `y/` folders contain default Firebase welcome pages (not part of the wedding site).
- Modification timestamps on all files are identical (Aug 15 2026), indicating a bulk copy/restore rather than incremental development.
