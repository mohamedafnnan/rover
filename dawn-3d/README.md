# DAWN · The Interactive Mars Rover Experience

The official digital experience of the **FISAT Rover Team** — Federal Institute of Science and Technology, Angamaly, Kerala.

You land on Mars, take control of **DAWN**, and drive through the team's world. Every building, monument, and canyon is a slice of the team's work: departments, competitions, sponsors, achievements, timeline, gallery, arm, roster, recruitment.

No traditional navigation. The world is the interface.

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Move with **W A S D** or the arrow keys. **Space** to brake. **C** to cycle camera. **E** to interact when a prompt appears. **Esc** to close a panel. **R** to respawn at the landing zone.

### Production build

```bash
npm run build
npm run preview     # local preview of the built bundle
```

Any static host will do — see `DEPLOY.md`.

---

## URL flags

| Flag         | Effect                                                   |
|--------------|----------------------------------------------------------|
| `?debug=1`   | Verbose console logs                                     |
| `?a11y=1`    | Skip 3D. Render the full content as a plain-HTML page   |
| `?nointro=1` | Skip the cinematic intro overlay                         |
| `?free=1`    | Let the interact key open POIs without proximity gating |

`prefers-reduced-motion: reduce` is honoured automatically — the intro is skipped and camera easing is disabled.

---

## Editing content

**All copy lives under `/content/*.json`. No JavaScript changes are needed to add or move content.**

- `site.json`         — mission, tagline, socials, canonical URL
- `team.json`         — patrons, mentors, every member with department tag
- `departments.json`  — the six departments (Design & Manufacturing, Electrical, Controls, AI & Autonomy, Science, Research & Documentation)
- `rover.json`        — DAWN spec sheet + arm-joint callouts
- `sponsors.json`     — tiered sponsors + value-prop points
- `competitions.json` — IRC 2026 + task categories + progress log
- `achievements.json` — season milestones
- `timeline.json`     — kickoff → finals
- `gallery.json`      — photo grid entries
- `faq.json`          — question / answer pairs
- `recruitment.json`  — hiring pipeline
- `pois.json`         — world layout. Change a `[x, z]` and the building moves.
- `missions.json`     — optional side quests
- `contact.json`      — address, socials

To add a new sponsor, competition, gallery item, blog post, department or POI, edit the relevant JSON. If a **new** POI type is required (a new kind of structure geometry) add a subclass factory to `src/world/pois/Structures.js` and reference it from `pois.json` — no other code changes.

---

## Project layout

```
dawn-3d/
├─ index.html          · shell, boot overlay, canvas mount
├─ vite.config.js
├─ package.json
├─ content/            · every piece of the site, as JSON
├─ public/media/       · optional local overrides for portraits (URLs pull from fisatrover.in by default)
└─ src/
   ├─ main.js          · entry point, boot progress, a11y fallback
   ├─ core/            · Renderer, Loop, Input, EventBus, ContentStore, AssetLoader, Debug, App
   ├─ world/           · Scene root, terrain, sky, sun, dust, storm, rocks, POI registry + structures
   ├─ rover/           · Procedural DAWN, physics, arm, motor audio
   ├─ camera/          · CameraRig (follow / orbit / inspection / cinematic)
   ├─ interaction/     · ProximitySystem, ScanSystem, MissionSystem
   ├─ audio/           · WebAudio engine + Martian wind ambience
   ├─ ui/              · HUD, Codex, Prompt, Toast, Onboarding, CinematicIntro, A11yFallback, panels/
   └─ styles/          · tokens.css, base.css, hud.css
```

Non-negotiables enforced by the code:

- **One `WebGLRenderer`** (`src/core/Renderer.js`).
- **One `requestAnimationFrame` loop** (`src/core/Loop.js`).
- **One `PerspectiveCamera`** (`src/camera/CameraRig.js`).
- **One event bus** for cross-cutting messages (`src/core/EventBus.js`).
- **One content store** — every panel reads the same JSON (`src/core/ContentStore.js`).

---

## Attribution & content source

The source of truth for content is the team's canonical website: <https://fisatrover.in>. Team portraits, sponsor logos, and rover photos are referenced by URL from that origin. This project is built for and with the FISAT Rover Team.

Fonts: Space Grotesk & JetBrains Mono via Google Fonts.
3D: Three.js r170 (WebGL2).

---

## License

Code: MIT. Team content, portraits, and sponsor logos remain © their respective owners (FISAT Rover Team and partners).
