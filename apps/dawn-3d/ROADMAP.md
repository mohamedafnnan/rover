# DAWN · Milestone Roadmap

## v1.0 — Ship (this build, 2026 season)
- Boot flow, cinematic intro, onboarding hints
- Procedural DAWN with rocker-bogie physics + interactive 5-DOF arm
- 21 POIs, 6 departments, full team roster, tiered sponsors
- Codex with 16 panels, HUD with telemetry + compass + minimap
- Dust storm event, scan beacon mini-interaction, 5 optional missions
- WebAudio engine, motor synth, wind ambience
- Plain-HTML `?a11y=1` fallback rendered from the same content store

## v1.1 — Craft polish (~4 weeks)
- Bloom + subtle chromatic aberration via EffectComposer
- Real-time reflections on solar panels (planar reflector)
- Ackermann-corrected steering + independent bogie linkages
- Portrait pre-processing pipeline in `scripts/` (WebP + LQIP)
- Sponsor obelisk decals — actual sponsor logos on faces
- Sound-scape pass: distinct SFX per POI type

## v1.2 — World depth (~6–8 weeks)
- Cave interior for Gallery Canyon easter egg
- Photogrammetric rock variants via Draco-compressed GLTF (loader stubbed today)
- Weather scheduling: day cycle, sunset gradient, procedurally seeded dust
- First-person camera mode with head bob + suspension telemetry HUD
- Localization pass (English + Malayalam)

## v1.3 — Recruitment & community
- Application form panel wired to a serverless endpoint
- Live event ticker on Communication Tower (sponsor demos, competition dates)
- Season-select time machine — press T to swap in a previous year's `pois.json` / `team.json` / `rover.json`

## v2.0 — Multi-rover / multi-user
- WebSocket peer telemetry, ghost rovers of live visitors
- Judge presentation mode with camera cue-list
- WebXR (headset) mode using the same scene graph
