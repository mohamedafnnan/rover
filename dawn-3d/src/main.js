/**
 * DAWN · entry point.
 *
 *  1. Wire the boot overlay progress bar.
 *  2. If ?a11y=1 or WebGL is missing, render the plain-HTML fallback
 *     and stop here.
 *  3. Otherwise instantiate App, boot it, then start the render loop.
 */
import { App } from './core/App.js';
import { content } from './core/ContentStore.js';
import { flags } from './core/Debug.js';
import { renderA11y } from './ui/A11yFallback.js';

const boot     = document.getElementById('boot');
const bootBar  = document.getElementById('boot-bar');
const bootPct  = document.getElementById('boot-pct');
const canvas   = document.getElementById('stage');
const uiRoot   = document.getElementById('ui-root');
const a11yRoot = document.getElementById('a11y-fallback');

function setProgress(frac, tag = '') {
  const pct = Math.round(frac * 100);
  bootBar.style.width = pct + '%';
  bootPct.textContent = String(pct);
  if (tag) console.debug('[boot]', tag);
}

async function main() {
  // WebGL support probe.
  const supported = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (_e) { return false; }
  })();

  if (flags.a11y || !supported) {
    // Load content anyway so the fallback can render everything.
    await content.load(setProgress);
    renderA11y(a11yRoot, content);
    boot.classList.add('boot--hidden');
    canvas.style.display = 'none';
    return;
  }

  const app = new App(canvas, uiRoot);
  try {
    await app.boot(setProgress);
  } catch (err) {
    console.error(err);
    // Graceful fallback if 3D boot fails for any reason.
    await content.load(() => {}).catch(() => {});
    renderA11y(a11yRoot, content);
    boot.classList.add('boot--hidden');
    canvas.style.display = 'none';
    return;
  }

  // First frame — render once so we can hide the boot overlay.
  app.renderer.render(app.world.scene, app.cameraRig.camera);
  app.start();

  // Fade boot overlay next tick so the first frame is fully drawn.
  requestAnimationFrame(() => {
    boot.classList.add('boot--hidden');
    setTimeout(() => boot.remove(), 1400);
  });
}

main();
