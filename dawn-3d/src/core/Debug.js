/**
 * Debug · zero-dependency debug flags via URL params.
 *
 *   ?debug=1  · show stats + colliders
 *   ?a11y=1   · skip 3D, render HTML fallback with all content
 *   ?free=1   · disable proximity gating (any POI can be opened from HUD)
 *   ?nointro=1 · skip the cinematic intro
 */
const params = new URLSearchParams(location.search);

export const flags = {
  debug:   params.has('debug'),
  a11y:    params.has('a11y'),
  free:    params.has('free'),
  nointro: params.has('nointro'),
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
};

export function log(...args) {
  if (flags.debug) console.log('[dawn]', ...args);
}
