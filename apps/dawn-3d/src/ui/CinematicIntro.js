import { bus } from '../core/EventBus.js';
import { flags } from '../core/Debug.js';

/**
 * CinematicIntro · full-screen title lockup, dismisses on click or key.
 *
 * We deliberately keep this as an HTML overlay, not a 3D sequence — the
 * whole point is that dismissing it hands control to the rover on the
 * pad below. No pause, no wait.
 */
export class CinematicIntro {
  constructor(root, siteName, subtitle) {
    this.el = document.createElement('div');
    this.el.className = 'cine cine--visible';
    this.el.innerHTML = `
      <div>
        <div class="cine__title"><strong>DAWN</strong>${siteName || 'FISAT Rover Team'}</div>
        <div class="cine__sub">${subtitle || 'the interactive Mars rover experience'}</div>
      </div>
      <button class="cine__cta" id="cine-cta">Begin drive · ${nav()}</button>
    `;
    root.appendChild(this.el);

    const dismiss = () => this.dismiss();
    this.el.querySelector('#cine-cta').addEventListener('click', dismiss);
    window.addEventListener('keydown', (e) => {
      if (this.dismissed) return;
      if (['Enter', 'Escape', ' '].includes(e.key)) dismiss();
    });

    if (flags.nointro || flags.reducedMotion) {
      setTimeout(dismiss, 400);
    }
  }

  dismiss() {
    if (this.dismissed) return;
    this.dismissed = true;
    this.el.classList.remove('cine--visible');
    setTimeout(() => this.el.remove(), 1200);
    bus.emit('cinematic:end');
  }
}

function nav() {
  // Coarse-pointer devices don't have WASD; show a tap hint instead.
  return matchMedia('(pointer: coarse)').matches ? 'tap' : 'press · space';
}
