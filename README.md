# FISAT Rover Team — DAWN Website 2.0 (v1 rebuild)

A two-part rebuild of the FISAT Rover Team public platform:

- `apps/web` — the primary Astro + Tailwind website
- `apps/dawn-3d` — the refactored Three.js DAWN inspection experience, integrated into the web app as `/dawn-3d-app/`

## What changed

### Main website
- Rebuilt as a static Astro site for speed, SEO, and maintainability
- Reorganized into dedicated routes: Home, Mission, DAWN, Engineering, IRC 2026, Team, Sponsors, Gallery, Contact, and 3D Mode
- Uses a dark-orange glassmorphism system with stronger hierarchy and better sponsor / gallery organization
- Keeps factual content conservative and source-driven

### 3D experience
- Renamed from **ARES** to **DAWN**
- Retained the modular Vite + Three.js architecture instead of rebuilding from scratch
- Repositioned as an optional premium mode, not the whole website
- Preserved a11y / WebGL fallback behaviour
- Removed local deployment artifacts containing a Vercel token (`.env.local`, `.vercel/`)

## Project structure

```text
.
├─ apps/
│  ├─ web/        # Astro + Tailwind main site
│  └─ dawn-3d/    # Vite + Three.js DAWN experience
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ CONTENT_LEDGER.md
│  ├─ DESIGN_SYSTEM.md
│  └─ KNOWN_LIMITATIONS.md
└─ scripts/
   └─ sync-3d.mjs
```

## Quick start

### 1. Install
```bash
npm run install:all
```

### 2. Run the main site
```bash
npm run dev:web
```

### 3. Run the 3D experience standalone
```bash
npm run dev:3d
```

### 4. Production build
```bash
npm run build
```

This builds `apps/dawn-3d`, copies its `dist/` output into `apps/web/public/dawn-3d-app/`, then builds the Astro site.

## Factual content policy

This repo intentionally avoids inventing technical data. Public UI copy is derived from:

- `https://fisatrover.in/`
- `https://fisatrover.in/irc.html`
- `https://fisatrover.in/team.html`
- `https://fisat.ac.in/event/international-rover-challenge-irc-2026/`
- the official site's mirrored assets included in this repo

If a detail could not be verified, it was either omitted from the live UI or flagged in `docs/CONTENT_LEDGER.md`.

## QA notes

### Completed
- Static builds pass for both apps
- Browser route sweep completed for main routes
- Visual screenshot audit completed for desktop and mobile
- Secret-bearing local deployment files removed from the deliverable repo

### Remaining known issues
- The 3D app still emits headless-browser GPU performance warnings during automated QA; these are browser-driver warnings rather than fatal JS runtime errors.
- The 3D experience remains more polished on desktop than on mobile.
- Public sources do not expose full subsystem specifications, so the site stays intentionally conservative.

## Deployment

### Static hosting
The Astro build output is in:

```text
apps/web/dist/
```

This can be deployed to any static host.

### Important
If you change the DAWN 3D app, rebuild and sync it before deploying the main site:

```bash
npm run build:3d
npm run sync:3d
npm run build:web
```
