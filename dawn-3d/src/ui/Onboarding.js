import { bus } from '../core/EventBus.js';
import { flags } from '../core/Debug.js';

/**
 * Onboarding · a small tips strip that shows for the first ~30 seconds
 * or until the rover has moved a meaningful distance.
 */
export class Onboarding {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.className = 'onboarding';
    this.el.innerHTML = `
      <div class="onboarding__row"><span class="onboarding__key">W</span><span class="onboarding__key">A</span><span class="onboarding__key">S</span><span class="onboarding__key">D</span><span>drive</span></div>
      <div class="onboarding__row"><span class="onboarding__key">Space</span><span>brake</span></div>
      <div class="onboarding__row"><span class="onboarding__key">C</span><span>camera</span></div>
      <div class="onboarding__row"><span class="onboarding__key">E</span><span>interact</span></div>
      <div class="onboarding__row"><span class="onboarding__key">Esc</span><span>close</span></div>
    `;
    root.appendChild(this.el);
    this.hidden = false;
    this._t = 0;
    this._dist = 0;
    if (flags.reducedMotion) this.hide();
  }

  hide() {
    if (this.hidden) return;
    this.hidden = true;
    this.el.classList.add('onboarding--hidden');
    setTimeout(() => this.el.remove(), 800);
  }

  update(dt, rover) {
    if (this.hidden) return;
    this._t += dt;
    this._dist += Math.abs(rover.speed) * dt;
    if (this._t > 25 || this._dist > 55) this.hide();
  }
}
