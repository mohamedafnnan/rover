/**
 * Loop · the ONE and ONLY requestAnimationFrame loop.
 *
 * Systems register a callback with `add(system)`; the loop passes them
 * a fixed-step delta (dt) and monotonically increasing elapsed time.
 *
 * Fixed-step physics (60Hz) with variable-rate rendering: the wall clock
 * decouples from the physics tick, so slow frames don't destabilise the
 * rover's wheel raycasts.
 */
export class Loop {
  constructor() {
    this.systems = new Set();
    this.running = false;
    this.last = 0;
    this.acc = 0;
    this.dt = 1 / 60;
    this.elapsed = 0;
    this._raf = 0;
  }

  add(system)    { this.systems.add(system); }
  remove(system) { this.systems.delete(system); }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now) => {
      if (!this.running) return;
      const frameDt = Math.min(0.1, (now - this.last) / 1000); // clamp to 100ms
      this.last = now;
      this.acc += frameDt;

      // Fixed-step updates.
      while (this.acc >= this.dt) {
        this.elapsed += this.dt;
        for (const s of this.systems) s.update?.(this.dt, this.elapsed);
        this.acc -= this.dt;
      }

      // Late updates for cameras / interpolation-only systems.
      for (const s of this.systems) s.lateUpdate?.(frameDt, this.elapsed);

      // Render happens once per frame.
      for (const s of this.systems) s.render?.();

      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this._raf);
  }
}
