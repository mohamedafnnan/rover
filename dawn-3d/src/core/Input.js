/**
 * Input · unifies keyboard, touch and gamepad into a rover input state.
 *
 * Consumers read `state` every tick:
 *   throttle  ∈ [-1, 1]     (W/S or up/down or right stick Y)
 *   steer     ∈ [-1, 1]     (A/D or left/right or left stick X)
 *   brake     ∈ [0, 1]      (space or R2)
 *   boost     ∈ [0, 1]      (shift or L2 — soft boost, not a rocket)
 *   action    boolean       (E or A button — POI interact)
 *   camera    boolean       (C or Y button — cycle camera)
 *   reset     boolean       (R or Start button — respawn at landing zone)
 *
 * Also exposes discrete "pressed" one-shots that reset each tick.
 */
export class Input {
  constructor() {
    this.state = {
      throttle: 0, steer: 0, brake: 0, boost: 0,
    };
    this.pressed = { action: false, camera: false, reset: false, escape: false };
    this.keys = new Set();

    // Touch joystick — only enabled if pointer is coarse.
    this.touch = { active: false, base: { x: 0, y: 0 }, tip: { x: 0, y: 0 } };
    this.hasTouch = matchMedia('(pointer: coarse)').matches;

    window.addEventListener('keydown', (e) => this._kd(e));
    window.addEventListener('keyup',   (e) => this._ku(e));
    window.addEventListener('blur',    () => this.keys.clear());

    if (this.hasTouch) this._bindTouch();
  }

  _kd(e) {
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    this.keys.add(k);
    if (k === 'e')      this.pressed.action = true;
    if (k === 'c')      this.pressed.camera = true;
    if (k === 'r')      this.pressed.reset  = true;
    if (k === 'escape') this.pressed.escape = true;
  }
  _ku(e) { this.keys.delete(e.key.toLowerCase()); }

  _bindTouch() {
    // Left half of screen = analog stick, right half = camera pan (unused).
    window.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      if (t.clientX < window.innerWidth / 2) {
        this.touch.active = true;
        this.touch.base = { x: t.clientX, y: t.clientY };
        this.touch.tip  = { x: t.clientX, y: t.clientY };
      }
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!this.touch.active) return;
      const t = e.changedTouches[0];
      if (t) this.touch.tip = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    window.addEventListener('touchend', () => { this.touch.active = false; }, { passive: true });
  }

  // Called every fixed-step tick from Loop.
  update() {
    // --- KEYBOARD --- //
    let throttle = 0, steer = 0;
    if (this.keys.has('w') || this.keys.has('arrowup'))    throttle += 1;
    if (this.keys.has('s') || this.keys.has('arrowdown'))  throttle -= 1;
    if (this.keys.has('a') || this.keys.has('arrowleft'))  steer -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) steer += 1;
    const brake = this.keys.has(' ') || this.keys.has('spacebar') ? 1 : 0;
    const boost = this.keys.has('shift') ? 1 : 0;

    // --- TOUCH --- //
    if (this.touch.active) {
      const dx = this.touch.tip.x - this.touch.base.x;
      const dy = this.touch.tip.y - this.touch.base.y;
      const norm = 60; // px
      steer    = clamp(steer    + dx / norm, -1, 1);
      throttle = clamp(throttle - dy / norm, -1, 1);
    }

    // --- GAMEPAD --- //
    const pads = navigator.getGamepads?.() ?? [];
    for (const p of pads) {
      if (!p) continue;
      const lx = deadzone(p.axes[0] || 0);
      const ly = deadzone(p.axes[1] || 0);
      steer    = clamp(steer    + lx, -1, 1);
      throttle = clamp(throttle - ly, -1, 1);
      // A(0) = action, Y(3) = camera, Start(9) = reset
      if (p.buttons[0]?.pressed) this.pressed.action = true;
      if (p.buttons[3]?.pressed) this.pressed.camera = true;
      if (p.buttons[9]?.pressed) this.pressed.reset  = true;
    }

    this.state.throttle = throttle;
    this.state.steer    = steer;
    this.state.brake    = brake;
    this.state.boost    = boost;
  }

  // Called AFTER consumers have read one-shots each tick.
  clearOneShots() {
    this.pressed.action = false;
    this.pressed.camera = false;
    this.pressed.reset  = false;
    this.pressed.escape = false;
  }
}

function deadzone(v, dz = 0.15) { return Math.abs(v) < dz ? 0 : v; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
