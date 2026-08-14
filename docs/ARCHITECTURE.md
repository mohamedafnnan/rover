# Architecture Overview

## 1. Product split

The platform is intentionally split into two layers:

1. **Main site (`apps/web`)**
   - crawlable
   - SEO-friendly
   - accessible without WebGL
   - source-of-truth public information architecture

2. **DAWN 3D (`apps/dawn-3d`)**
   - immersive optional inspection mode
   - retained as a separate app to avoid forcing WebGL on every visitor
   - embedded into the final site as a static sub-route (`/dawn-3d-app/`)

## 2. Why Astro for the main site

Astro was chosen because the public site is content-first and benefits from:

- static HTML output
- low client-side JavaScript overhead
- simple handoff to future student maintainers
- easy route-based information architecture

## 3. Why keep the existing Three.js app

The uploaded ARES project already had:

- a modular runtime (`App`, `Renderer`, `Loop`, `World`, `CameraRig`)
- a structured content layer
- an accessibility fallback path
- a coherent visual direction

So the rebuild preserves this architecture and refactors branding / content instead of replacing it for novelty.

## 4. Build flow

```text
apps/dawn-3d build
  -> dist/
  -> copied into apps/web/public/dawn-3d-app/
apps/web build
  -> final static site in apps/web/dist/
```

## 5. Main route map

- `/`
- `/mission`
- `/dawn`
- `/engineering`
- `/irc-2026`
- `/team`
- `/sponsors`
- `/achievements`
- `/gallery`
- `/contact`
- `/dawn-3d`
- `/dawn-3d-app/`
