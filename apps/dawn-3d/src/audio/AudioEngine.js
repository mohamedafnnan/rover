/**
 * AudioEngine · a tiny WebAudio graph with three ducking buses.
 *
 *   master · overall gain (respects mute)
 *   music  · ambient wind bed
 *   sfx    · rover motor, UI cues
 *
 * Nothing plays until the first user gesture. Autoplay is disallowed
 * by every modern browser.
 */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.muted = false;
    this._buses = {};
    // Wake on first pointer or key event.
    const wake = () => {
      if (this.ready) return;
      this._init();
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
    };
    window.addEventListener('pointerdown', wake);
    window.addEventListener('keydown', wake);
  }

  _init() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      const master = this.ctx.createGain(); master.gain.value = 0.7; master.connect(this.ctx.destination);
      const music  = this.ctx.createGain(); music.gain.value  = 0.6; music.connect(master);
      const sfx    = this.ctx.createGain(); sfx.gain.value    = 0.9; sfx.connect(master);
      this._buses = { master, music, sfx };
      this.ready = true;
    } catch (e) {
      // Silent failure — audio is decorative.
      console.warn('[audio] init failed', e);
    }
  }

  bus(name) { return this._buses[name]; }

  toggleMute() {
    if (!this.ready) return;
    this.muted = !this.muted;
    this._buses.master.gain.setTargetAtTime(this.muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
  }

  /** Fire-and-forget UI click. */
  chirp(freq = 660) {
    if (!this.ready) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = freq;
    const g = ctx.createGain(); g.gain.value = 0.0001;
    o.connect(g); g.connect(this._buses.sfx);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.start(t); o.stop(t + 0.14);
  }
}
