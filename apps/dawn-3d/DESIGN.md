# DAWN · Software Design Document

Concise design record for the DAWN codebase. This is the document you would read before touching any file in `src/`.

---

## 1. Design goals

1. **A single digital experience, not a website.** The world is the navigation. There is no menu, no scroll page, no hero → about → footer stack.
2. **Content-driven.** All copy lives in `/content/*.json`. Adding a sponsor or POI requires zero code changes.
3. **Award-tier polish.** NASA-industrial aesthetic, typography-first HUD, cinematic camera language, procedural DAWN with weighty driving feel.
4. **One renderer, one loop, one camera.** No hidden secondary contexts, no duplicate scenes, no orphan timers.
5. **Graceful degradation.** Full plain-HTML fallback (`A11yFallback`) that reads the same content store as the 3D scene. Reduced motion honoured.

## 2. Runtime architecture

```
   main.js
      │
      ▼
   App  ─────────────────────────────── owns everything ────────────────────
      │
      ├── Renderer          ← the ONE WebGLRenderer
      ├── Loop              ← the ONE requestAnimationFrame
      ├── Input             ← keyboard + touch + gamepad
      ├── AudioEngine + Ambience
      ├── ContentStore      ← loads /content/*.json once
      ├── World
      │     ├── Scene (fog + background)
      │     ├── MarsTerrain (fBm heightmap, 220² grid, bilinear sampling)
      │     ├── Sky (custom shader dome — butterscotch → deep vault, blue sun halo)
      │     ├── Sun (directional key + rim + hemisphere ambient, shadow follows rover)
      │     ├── Rocks (InstancedMesh, ~1100 instances)
      │     ├── DustParticles (GPU points, wind-drift in vertex shader)
      │     ├── DustStorm (translucent volume + exposure/light dip)
      │     └── POIRegistry → 21 POIs (data-driven from pois.json)
      ├── Rover  (procedural: chassis, 6 wheels, rocker-bogie, mast, solar panels, arm, antenna, headlamp)
      ├── RoverPhysics (bicycle-model yaw + heightfield-conforming pose)
      ├── RoverAudio (motor-whine synth tied to speed)
      ├── CameraRig (follow / orbit / inspection / cinematic + blended transitions)
      ├── ProximitySystem, ScanSystem, MissionSystem
      └── UI  (HUD, Prompt, Toast, Onboarding, Codex + 16 panels, CinematicIntro)
```

Cross-cutting communication runs through **`EventBus`** so systems never import each other for events. Key channels:

| Event               | Payload            | Emitter                | Consumers                        |
|---------------------|--------------------|------------------------|----------------------------------|
| `poi:near`          | `{ poi }`          | ProximitySystem        | Prompt, HUD                      |
| `poi:far`           | `{ poi }`          | ProximitySystem        | Prompt, HUD                      |
| `poi:enter`         | `{ poi }`          | ProximitySystem        | Codex, MissionSystem             |
| `codex:open/close`  | `{ poi? }`         | Codex                  | App (camera), Prompt             |
| `arm:setJoint`      | `{ joint, value }` | ArmInspector panel     | App → Rover.arm.setJoint         |
| `arm:pose`          | `{ pose }`         | ArmInspector panel     | App → Rover.arm.setPose          |
| `scan:deploy`       | none               | TestingPanel button    | ScanSystem                       |
| `storm:start / end` | none               | TestingPanel button    | DustStorm                        |
| `camera:mode`       | `{ mode }`         | CameraRig              | HUD pill                         |
| `toast`             | `{ text }`         | anywhere               | Toast                            |
| `mission:done`      | `{ id }`           | MissionSystem          | Toast                            |
| `cinematic:end`     | none               | CinematicIntro         | App (welcome toast)              |

## 3. Frame model

`Loop.js` runs a **fixed-step 60 Hz update** with a variable-rate `lateUpdate` + `render`:

```
while (accumulator >= dt) {
  for s in systems: s.update(dt, elapsed)
  accumulator -= dt
}
for s in systems: s.lateUpdate(frameDt)   // camera, HUD
for s in systems: s.render()              // renderer.render(scene, camera)
```

Wall-clock spikes cannot destabilise the rover's heightfield lookups. Camera easing runs on frameDt so it still feels smooth on high-refresh displays.

## 4. Rover physics

We deliberately avoid a full rigid-body solver (Ammo/Rapier bloat is not worth it here). Instead:

- Longitudinal **speed** is a scalar integrated from throttle with soft acceleration and rolling resistance.
- **Yaw rate** = `speed / wheelbase × tan(steer)` (bicycle model).
- Every tick we sample the terrain heightmap at the six wheel positions.
- **Chassis pitch** is `atan2(front − rear, wheelbaseX)`, **roll** is `atan2(right − left, wheelbaseZ)`.
- **Left/right rocker-bogies** each tilt from the difference of their own three wheel heights, so the visual suspension articulates.

Result: predictable, deterministic, and it feels weighty — exactly the "driving through the experience" feeling the brief asked for.

## 5. Data-driven POI system

`content/pois.json` defines every location. Fields:

```jsonc
{
  "id": "sponsor-plaza",
  "name": "Sponsor Plaza",
  "type": "sponsors",           // maps to a structure factory
  "panel": "SponsorPanel",      // maps to a panel renderer
  "position": [0, 100],
  "color": "#d5c07a"
}
```

`POIRegistry` iterates the array, calls `createPOI` from `Structures.js`, and adds the resulting group to the scene at the terrain's local height. The Codex maintains a table from `panel` name → render function. To add a new POI without touching code:

1. Reuse an existing `type` (`department`, `landmark`, `sponsors`, …).
2. Point `panel` at an existing renderer if the content shape matches.

To add a **new kind** of location, either:

- Add a new subclass to `Structures.js` and switch on it inside `createPOI`, OR
- Add a new panel renderer under `src/ui/panels/` and register it in `Codex.js`.

## 6. Content contract

`ContentStore` is the ONLY thing that reads JSON. Panels always read via `content.<accessor>`. Portraits, sponsor logos and rover photos are hosted by <https://fisatrover.in> and referenced by absolute URL from `team.json`, `sponsors.json`, `rover.json`, `gallery.json`.

## 7. Accessibility

- `?a11y=1` swaps the WebGL surface for the plain-HTML fallback (`A11yFallback.js`) which renders **every** content entry — team, sponsors, departments, achievements, timeline, competitions, recruitment, FAQ, contact.
- `prefers-reduced-motion: reduce` skips the cinematic intro and disables camera easing.
- All HUD and Codex controls are keyboard-reachable. Escape closes the Codex.
- The Codex is a landmark region (`role="complementary"`).

## 8. Performance ceiling

Target: 60fps on M1 / RTX 3050 laptop. 30fps floor on integrated GPUs.

Levers used:

- `WebGLRenderer` DPR capped at 1.75.
- Terrain uses `PlaneGeometry(220, 220)` — ~48k tris.
- `InstancedMesh` for rocks.
- Dust motion runs in the vertex shader; no CPU per-particle work.
- Single directional shadow caster; shadow camera follows the rover.
- No postprocessing pass — tone-mapping is baked into the renderer output.

## 9. Testing

- **Manual scenarios**: land → drive to Mission Control → open Codex → open every department → deploy scan beacons → trigger dust storm → complete Sample Hunt mission.
- **Boot flow**: fresh reload should show boot progress, then a single frame paint, then fade the boot overlay.
- **Reduced motion**: `?nointro=1` and prefers-reduced-motion both skip the intro.
- **Content edit**: change a name in `team.json`; refresh; new name appears in Codex without touching JS.

## 10. Known deliberate trade-offs

- No physics engine → some corners can be driven up beyond a realistic slope. Compensated with a soft world-bound clamp and gravity-only lookdown.
- No GLB / KTX2 pipeline yet → all geometry is procedural. Adding external models later means adding `three/addons/loaders/GLTFLoader.js` in `AssetLoader.js`; the rest of the code doesn't care.
- Portraits load from fisatrover.in at runtime — offline dev needs a small proxy or a mirror in `/public/media`.

## 11. Extension hooks (design-approved)

- Add `three/addons/postprocessing/EffectComposer` for a bloom pass. `Renderer.render` is the single call site to change.
- Swap `MarsTerrain` for a GLB-backed static mesh: keep the `heightAt` / `normalAt` interface intact.
- Multiplayer telemetry: publish rover pose on the bus, subscribe in a `Peer` system.
